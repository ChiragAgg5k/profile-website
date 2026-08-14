#!/usr/bin/env node
/**
 * Snapshot local coding-agent usage into src/data/usage.json.
 *
 * Reads Claude Code, Codex, Pi, OpenCode (and any other agent ccusage
 * detects) from on-disk session logs. Optionally folds in the current
 * Cursor billing cycle via the dashboard API, using the token Cursor
 * already stores locally. Nothing is uploaded except that Cursor call.
 *
 *   bun run usage
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "src/data/usage.json");
const TIMEZONE = "Asia/Kolkata";

const AGENT_META = {
  claude: { label: "Claude Code" },
  codex: { label: "Codex" },
  pi: { label: "Pi" },
  opencode: { label: "OpenCode" },
  gemini: { label: "Gemini" },
  cursor: { label: "Cursor" },
};

const emptyTokens = () => ({
  cost: 0,
  tokens: 0,
  input: 0,
  output: 0,
  cacheWrite: 0,
  cacheRead: 0,
});

const addTokens = (target, row) => {
  target.cost += num(row.cost ?? row.totalCost);
  target.input += num(row.inputTokens ?? row.input);
  target.output += num(row.outputTokens ?? row.output);
  target.cacheWrite += num(row.cacheCreationTokens ?? row.cacheWrite);
  target.cacheRead += num(row.cacheReadTokens ?? row.cacheRead);
  target.tokens =
    target.input + target.output + target.cacheWrite + target.cacheRead;
  return target;
};

const num = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const round = (value, digits = 4) => {
  const f = 10 ** digits;
  return Math.round((value + Number.EPSILON) * f) / f;
};

const compact = (tokens) => ({
  cost: round(tokens.cost),
  tokens: Math.round(tokens.tokens),
  input: Math.round(tokens.input),
  output: Math.round(tokens.output),
  cacheWrite: Math.round(tokens.cacheWrite),
  cacheRead: Math.round(tokens.cacheRead),
});

const inferAgent = (modelName, fallback) => {
  const name = String(modelName || "").toLowerCase();
  if (name.startsWith("[pi]") || fallback === "pi") return "pi";
  if (fallback && fallback !== "all") return fallback;
  if (name.includes("claude")) return "claude";
  if (name.includes("gemini")) return "gemini";
  if (name.includes("cursor") || name.includes("composer") || name.includes("grok")) {
    return "cursor";
  }
  if (
    name.includes("kimi") ||
    name.includes("glm") ||
    name.includes("deepseek") ||
    name.includes("k2")
  ) {
    return "opencode";
  }
  if (name.includes("gpt") || name.includes("codex") || name.includes("o1") || name.includes("o3")) {
    return "codex";
  }
  return fallback || "other";
};

const displayModel = (modelName) =>
  String(modelName || "")
    .replace(/^\[[^\]]+]\s*/, "")
    .replace(/-thinking-high$/, "")
    .trim();

const pricingFamily = (modelName, agent) => {
  const name = `${agent} ${modelName}`.toLowerCase();
  if (name.includes("claude")) {
    return { cacheRead: 0.1, cacheWrite: 1.25, output: 5 };
  }
  return { cacheRead: 0.5, cacheWrite: 1, output: 4 };
};

const cacheSavingsFor = (row, agent) => {
  const input = num(row.input);
  const output = num(row.output);
  const cacheWrite = num(row.cacheWrite);
  const cacheRead = num(row.cacheRead);
  const cost = num(row.cost);
  if (cost <= 0) return 0;
  const family = pricingFamily(row.name || "", agent);
  const denom =
    input +
    cacheWrite * family.cacheWrite +
    cacheRead * family.cacheRead +
    output * family.output;
  if (denom <= 0) return 0;
  const inputPrice = cost / denom;
  return (
    cacheRead * inputPrice * (1 - family.cacheRead) +
    cacheWrite * inputPrice * (1 - family.cacheWrite)
  );
};

const runCcusage = () => {
  const bunx = existsSync(join(homedir(), ".bun/bin/bunx"))
    ? join(homedir(), ".bun/bin/bunx")
    : "bunx";
  const args = [
    "--bun",
    "ccusage",
    "daily",
    "--json",
    "--by-agent",
    "--timezone",
    TIMEZONE,
  ];
  console.log("Reading local agent logs via ccusage…");
  const stdout = execFileSync(bunx, args, {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(stdout);
};

const readCursorToken = () => {
  const dbPath = join(
    homedir(),
    "Library/Application Support/Cursor/User/globalStorage/state.vscdb",
  );
  if (!existsSync(dbPath)) return null;
  try {
    const raw = execFileSync(
      "sqlite3",
      [dbPath, "SELECT value FROM ItemTable WHERE key = 'cursorAuth/accessToken';"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    ).trim();
    if (!raw) return null;
    return raw.startsWith('"') ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
};

const dateInTz = (ms) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ms));

const dayStartMs = (isoDate) => Date.parse(`${isoDate}T00:00:00+05:30`);

const mapPool = async (items, limit, fn) => {
  const out = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      out[index] = await fn(items[index], index);
    }
  });
  await Promise.all(workers);
  return out;
};

const cursorModelsFromAggregated = (aggregated) =>
  (aggregated.aggregations || []).map((row) => {
    const name = displayModel(row.modelIntent);
    return {
      name,
      agent: "cursor",
      ...compact(
        addTokens(emptyTokens(), {
          cost: num(row.totalCents) / 100,
          inputTokens: row.inputTokens,
          outputTokens: row.outputTokens,
          cacheCreationTokens: row.cacheWriteTokens,
          cacheReadTokens: row.cacheReadTokens,
        }),
      ),
    };
  });

const fetchCursorCycle = async () => {
  const token = readCursorToken();
  if (!token) {
    console.log("Cursor: no local session token, skipping.");
    return null;
  }

  const post = async (method, body) => {
    const response = await fetch(
      `https://api2.cursor.sh/aiserver.v1.DashboardService/${method}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1",
        },
        body: JSON.stringify(body),
      },
    );
    if (!response.ok) {
      throw new Error(`${method} ${response.status}`);
    }
    return response.json();
  };

  try {
    const period = await post("GetCurrentPeriodUsage", {});
    const start = Number(period.billingCycleStart);
    const end = Number(period.billingCycleEnd);
    const aggregated = await post("GetAggregatedUsageEvents", {
      startDate: start,
      endDate: end,
    });

    const models = cursorModelsFromAggregated(aggregated);
    const totals = models.reduce((acc, row) => addTokens(acc, row), emptyTokens());
    totals.cost = num(aggregated.totalCostCents) / 100 || totals.cost;

    const firstDate = dateInTz(start);
    const lastDate = dateInTz(Math.min(end, Date.now()));
    const dates = [];
    for (
      let ms = dayStartMs(firstDate);
      dateInTz(ms) <= lastDate;
      ms += 24 * 60 * 60 * 1000
    ) {
      dates.push(dateInTz(ms));
    }

    console.log(`Cursor: fetching ${dates.length} daily aggregates…`);
    const daily = (
      await mapPool(dates, 4, async (iso) => {
        const dayStart = dayStartMs(iso);
        const dayAgg = await post("GetAggregatedUsageEvents", {
          startDate: iso === firstDate ? start : dayStart,
          endDate:
            iso === lastDate
              ? Math.min(end, Date.now())
              : dayStart + 24 * 60 * 60 * 1000,
        });
        const dayModels = cursorModelsFromAggregated(dayAgg);
        const dayTotals = dayModels.reduce(
          (acc, row) => addTokens(acc, row),
          emptyTokens(),
        );
        dayTotals.cost = num(dayAgg.totalCostCents) / 100 || dayTotals.cost;
        return {
          date: iso,
          ...compact(dayTotals),
          models: dayModels.filter((row) => row.tokens > 0 || row.cost > 0),
        };
      })
    ).filter((day) => day.tokens > 0 || day.cost > 0);

    console.log(
      `Cursor: current cycle $${round(totals.cost, 2)} across ${models.length} models, ${daily.length} active days.`,
    );

    return {
      start: firstDate,
      end: Number.isFinite(end) ? dateInTz(end) : null,
      planSpendUsd: num(period.planUsage?.totalSpend) / 100,
      totals: compact(totals),
      models,
      daily,
    };
  } catch (error) {
    console.log(`Cursor: skipped (${error.message}).`);
    return null;
  }
};

const buildSnapshot = (ccusage, cursor) => {
  const dailyMap = new Map();
  const modelMap = new Map();
  const agentMap = new Map();

  const ensureDay = (date) => {
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        ...emptyTokens(),
        agents: {},
        models: {},
      });
    }
    return dailyMap.get(date);
  };

  const bumpAgent = (id, row) => {
    if (!agentMap.has(id)) {
      agentMap.set(id, { id, ...emptyTokens() });
    }
    addTokens(agentMap.get(id), row);
  };

  const bumpModel = (agent, name, row) => {
    const key = `${agent}::${name}`;
    if (!modelMap.has(key)) {
      modelMap.set(key, { name, agent, ...emptyTokens() });
    }
    addTokens(modelMap.get(key), row);
  };

  for (const day of ccusage.daily || []) {
    const date = day.period || day.date;
    if (!date) continue;
    const entry = ensureDay(date);
    addTokens(entry, day);

    for (const agentRow of day.agents || []) {
      const id = agentRow.agent;
      if (!id || id === "all") continue;
      if (!entry.agents[id]) entry.agents[id] = emptyTokens();
      addTokens(entry.agents[id], agentRow);
      bumpAgent(id, agentRow);

      for (const modelRow of agentRow.modelBreakdowns || []) {
        const name = displayModel(modelRow.modelName);
        if (!name || name === "<synthetic>") continue;
        const tokens = {
          cost: modelRow.cost,
          inputTokens: modelRow.inputTokens,
          outputTokens: modelRow.outputTokens,
          cacheCreationTokens: modelRow.cacheCreationTokens,
          cacheReadTokens: modelRow.cacheReadTokens,
        };
        const modelKey = `${id}::${name}`;
        if (!entry.models[modelKey]) {
          entry.models[modelKey] = { name, agent: id, ...emptyTokens() };
        }
        addTokens(entry.models[modelKey], tokens);
        bumpModel(id, name, tokens);
      }
    }

    if ((day.agents || []).every((agentRow) => !agentRow.modelBreakdowns?.length)) {
      for (const modelRow of day.modelBreakdowns || []) {
        const name = displayModel(modelRow.modelName);
        if (!name || name === "<synthetic>") continue;
        const agent = inferAgent(modelRow.modelName);
        const tokens = {
          cost: modelRow.cost,
          inputTokens: modelRow.inputTokens,
          outputTokens: modelRow.outputTokens,
          cacheCreationTokens: modelRow.cacheCreationTokens,
          cacheReadTokens: modelRow.cacheReadTokens,
        };
        const modelKey = `${agent}::${name}`;
        if (!entry.models[modelKey]) {
          entry.models[modelKey] = { name, agent, ...emptyTokens() };
        }
        addTokens(entry.models[modelKey], tokens);
        bumpModel(agent, name, tokens);
      }
    }
  }

  if (cursor?.daily?.length) {
    for (const day of cursor.daily) {
      const entry = ensureDay(day.date);
      addTokens(entry, day);
      if (!entry.agents.cursor) entry.agents.cursor = emptyTokens();
      addTokens(entry.agents.cursor, day);
      bumpAgent("cursor", day);
      for (const modelRow of day.models || []) {
        const name = displayModel(modelRow.name);
        if (!name) continue;
        const modelKey = `cursor::${name}`;
        if (!entry.models[modelKey]) {
          entry.models[modelKey] = { name, agent: "cursor", ...emptyTokens() };
        }
        addTokens(entry.models[modelKey], modelRow);
        bumpModel("cursor", name, modelRow);
      }
    }
  }

  const daily = [...dailyMap.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((day) => ({
      date: day.date,
      ...compact(day),
      agents: Object.fromEntries(
        Object.entries(day.agents).map(([id, tokens]) => [id, compact(tokens)]),
      ),
      models: Object.values(day.models)
        .filter((row) => row.tokens > 0 || row.cost > 0)
        .map((row) => ({
          name: row.name,
          agent: row.agent,
          ...compact(row),
        })),
    }));

  const models = [...modelMap.values()]
    .map((row) => ({
      name: row.name,
      agent: row.agent,
      ...compact(row),
    }))
    .filter((row) => row.tokens > 0 || row.cost > 0)
    .sort((a, b) => b.cost - a.cost);

  const agents = [...agentMap.values()]
    .map((row) => ({
      id: row.id,
      label: AGENT_META[row.id]?.label || row.id,
      ...compact(row),
    }))
    .sort((a, b) => b.cost - a.cost);

  let cacheSavings = 0;
  for (const model of models) {
    cacheSavings += cacheSavingsFor(model, model.agent);
  }

  const totals = daily.reduce((acc, day) => addTokens(acc, day), emptyTokens());
  const activeDays = daily.filter((day) => day.tokens > 0 || day.cost > 0).length;

  return {
    generatedAt: new Date().toISOString(),
    timezone: TIMEZONE,
    source: "ccusage",
    range: {
      start: daily[0]?.date ?? null,
      end: daily.at(-1)?.date ?? null,
    },
    totals: {
      ...compact(totals),
      cacheSavings: round(Math.max(0, cacheSavings)),
      activeDays,
    },
    agents,
    models,
    daily,
    cursor,
  };
};

const main = async () => {
  const ccusage = runCcusage();
  const cursor = await fetchCursorCycle();
  const snapshot = buildSnapshot(ccusage, cursor);

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(snapshot, null, 2)}\n`);

  console.log(
    `Wrote ${outPath}\n` +
      `  ${snapshot.daily.length} days · ${snapshot.agents.map((a) => a.label).join(", ")}\n` +
      `  $${snapshot.totals.cost.toFixed(2)} API-rate · ${snapshot.totals.tokens.toLocaleString()} tokens`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
