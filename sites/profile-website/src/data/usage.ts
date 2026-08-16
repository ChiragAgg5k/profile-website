import snapshot from "@/data/usage.json";

export type TokenTotals = {
  cost: number;
  tokens: number;
  input: number;
  output: number;
  cacheWrite: number;
  cacheRead: number;
};

export type AgentId =
  | "claude"
  | "codex"
  | "pi"
  | "opencode"
  | "gemini"
  | "cursor"
  | "other";

export type AgentTotals = TokenTotals & {
  id: string;
  label: string;
};

export type ModelTotals = TokenTotals & {
  name: string;
  agent: string;
};

export type DailyUsage = TokenTotals & {
  date: string;
  agents: Record<string, TokenTotals>;
  models?: ModelTotals[];
};

export type UsageSnapshot = {
  generatedAt: string;
  timezone: string;
  source: string;
  range: { start: string | null; end: string | null };
  totals: TokenTotals & { cacheSavings: number; activeDays: number };
  agents: AgentTotals[];
  models: ModelTotals[];
  daily: DailyUsage[];
  cursor: {
    start: string | null;
    end: string | null;
    planSpendUsd: number;
    totals: TokenTotals;
    models: ModelTotals[];
    daily?: Array<TokenTotals & { date: string; models?: ModelTotals[] }>;
  } | null;
};

export const usage = snapshot as UsageSnapshot;

export const RANGE_OPTIONS = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
] as const;

export type UsageRange = (typeof RANGE_OPTIONS)[number]["value"];

export const AGENT_THEME: Record<
  string,
  { label: string; color: string; colorDark: string }
> = {
  claude: { label: "Claude Code", color: "#c45c32", colorDark: "#e07a4a" },
  codex: { label: "Codex", color: "#171717", colorDark: "#ececec" },
  pi: { label: "Pi", color: "#0f766e", colorDark: "#2dd4bf" },
  opencode: { label: "OpenCode", color: "#92683a", colorDark: "#d4a574" },
  gemini: { label: "Gemini", color: "#3b6fd8", colorDark: "#7ba3ff" },
  cursor: { label: "Cursor", color: "#2563eb", colorDark: "#93c5fd" },
  other: { label: "Other", color: "#737373", colorDark: "#a3a3a3" },
};

export const agentLabel = (id: string) => AGENT_THEME[id]?.label ?? id;

export const agentColor = (id: string, dark: boolean) =>
  dark
    ? (AGENT_THEME[id]?.colorDark ?? "#a3a3a3")
    : (AGENT_THEME[id]?.color ?? "#737373");

export const agentBarClassName: Record<string, string> = {
  claude: "bg-[#c45c32] dark:bg-[#e07a4a]",
  codex: "bg-neutral-900 dark:bg-neutral-100",
  pi: "bg-teal-700 dark:bg-teal-400",
  opencode: "bg-amber-800 dark:bg-amber-300",
  gemini: "bg-blue-700 dark:bg-blue-400",
  cursor: "bg-blue-600 dark:bg-blue-300",
  other: "bg-neutral-500 dark:bg-neutral-400",
};

const emptyTotals = (): TokenTotals => ({
  cost: 0,
  tokens: 0,
  input: 0,
  output: 0,
  cacheWrite: 0,
  cacheRead: 0,
});

const addTotals = (target: TokenTotals, row?: Partial<TokenTotals> | null) => {
  if (!row) return target;
  target.cost += row.cost || 0;
  target.tokens += row.tokens || 0;
  target.input += row.input || 0;
  target.output += row.output || 0;
  target.cacheWrite += row.cacheWrite || 0;
  target.cacheRead += row.cacheRead || 0;
  return target;
};

const shiftDate = (iso: string, days: number) => {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const eachDate = (start: string, end: string) => {
  const dates: string[] = [];
  for (let cursor = start; cursor <= end; cursor = shiftDate(cursor, 1)) {
    dates.push(cursor);
  }
  return dates;
};

export const windowDaily = (range: UsageRange, data: UsageSnapshot = usage) => {
  if (!data.daily.length || !data.range.end) return [];
  const end = data.range.end;
  const start = shiftDate(end, -(range - 1));
  const byDate = new Map(data.daily.map((day) => [day.date, day]));
  return eachDate(start, end).map((date) => {
    const day = byDate.get(date);
    if (day) return day;
    return { date, ...emptyTotals(), agents: {}, models: [] };
  });
};

export const summarizeDays = (days: DailyUsage[]) => {
  const totals = emptyTotals();
  const agents = new Map<string, TokenTotals>();
  const models = new Map<string, ModelTotals>();

  for (const day of days) {
    addTotals(totals, day);
    for (const [id, row] of Object.entries(day.agents || {})) {
      addTotals(
        agents.get(id) ??
          (() => {
            const next = emptyTotals();
            agents.set(id, next);
            return next;
          })(),
        row,
      );
    }
    for (const row of day.models || []) {
      const key = `${row.agent}::${row.name}`;
      const current =
        models.get(key) ??
        (() => {
          const next = { name: row.name, agent: row.agent, ...emptyTotals() };
          models.set(key, next);
          return next;
        })();
      addTotals(current, row);
    }
  }

  const activeDays = days.filter(
    (day) => day.cost > 0 || day.tokens > 0,
  ).length;
  const observedInput = totals.input + totals.cacheWrite + totals.cacheRead;
  let cacheSavings = 0;
  for (const model of models.values()) {
    cacheSavings += estimateCacheSavings(model);
  }

  return {
    totals,
    activeDays,
    cacheSavings,
    observedInput,
    cachedShare: observedInput > 0 ? totals.cacheRead / observedInput : 0,
    agents: [...agents.entries()]
      .map(([id, row]) => ({ id, label: agentLabel(id), ...row }))
      .filter((row) => row.cost > 0 || row.tokens > 0)
      .sort((a, b) => b.cost - a.cost),
    models: [...models.values()]
      .filter((row) => row.cost > 0 || row.tokens > 0)
      .sort((a, b) => b.cost - a.cost),
    days,
  };
};

const estimateCacheSavings = (
  row: TokenTotals & { name?: string; agent?: string },
) => {
  if (row.cost <= 0) return 0;
  const family = `${row.agent ?? ""} ${row.name ?? ""}`
    .toLowerCase()
    .includes("claude")
    ? { cacheRead: 0.1, cacheWrite: 1.25, output: 5 }
    : { cacheRead: 0.5, cacheWrite: 1, output: 4 };
  const denom =
    row.input +
    row.cacheWrite * family.cacheWrite +
    row.cacheRead * family.cacheRead +
    row.output * family.output;
  if (denom <= 0) return 0;
  const inputPrice = row.cost / denom;
  return (
    row.cacheRead * inputPrice * (1 - family.cacheRead) +
    row.cacheWrite * inputPrice * (1 - family.cacheWrite)
  );
};

export const formatMoney = (value: number, digits = 2) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

export const formatCompact = (value: number) => {
  const abs = Math.abs(value);
  const trim = (n: number) => {
    const formatted =
      n >= 10 ? n.toFixed(0) : n >= 1 ? n.toFixed(1) : n.toFixed(2);
    return formatted.replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
  };
  if (abs >= 1e9) return `${trim(value / 1e9)}B`;
  if (abs >= 1e6) return `${trim(value / 1e6)}M`;
  if (abs >= 1e3) return `${trim(value / 1e3)}K`;
  return new Intl.NumberFormat("en-US").format(Math.round(value));
};

export const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

export const formatRangeLabel = (start: string, end: string) => {
  const a = new Date(`${start}T00:00:00`);
  const b = new Date(`${end}T00:00:00`);
  const nowYear = new Date().getFullYear();
  const left = a.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: a.getFullYear() === b.getFullYear() ? undefined : "numeric",
  });
  const right = b.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: b.getFullYear() === nowYear ? undefined : "numeric",
  });
  return `${left} to ${right}`;
};

export const formatAxisDate = (iso: string) =>
  new Date(`${iso}T00:00:00`)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    .toUpperCase();

export const formatUpdatedAt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
