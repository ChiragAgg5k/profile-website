"use client";

import { DailyUsageChart } from "@/components/daily-usage-chart";
import { Icons } from "@/components/icons";
import { Segmented } from "@/components/ui/segmented";
import { DATA } from "@/data/resume";
import {
  formatCompact,
  formatMoney,
  formatPercent,
  summarizeDays,
  usage,
  windowDaily,
  agentBarClassName,
  agentLabel,
  type UsageRange,
} from "@/data/usage";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

type Metric = "cost" | "tokens";

const AGENT_HREF: Record<string, string> = {
  cursor: DATA.contact.social.Cursor.url,
};

const easeOutQuint = (t: number) => 1 - (1 - t) ** 5;

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setValue(target);
      return;
    }
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      setValue(target * easeOutQuint(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function AgentMark({ id, className }: { id: string; className?: string }) {
  const common = cn("size-4 shrink-0", className);
  if (id === "claude") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 257"
        preserveAspectRatio="xMidYMid"
        className={common}
        aria-hidden="true"
      >
        <path
          fill="#D97757"
          d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z"
        />
      </svg>
    );
  }
  if (id === "codex") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        fillRule="evenodd"
        className={cn(common, "text-neutral-900 dark:text-neutral-100")}
        aria-hidden="true"
      >
        <path
          clipRule="evenodd"
          d="M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z"
        />
      </svg>
    );
  }
  if (id === "pi") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800"
        className={common}
        aria-hidden="true"
      >
        <rect width="800" height="800" rx="168" fill="#111" />
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M165.29 165.29H517.36V400H400V517.36H282.65V634.72H165.29Z M282.65 282.65V400H400V282.65Z"
        />
        <path fill="#fff" d="M517.36 400H634.72V634.72H517.36Z" />
      </svg>
    );
  }
  if (id === "cursor") {
    return (
      <Icons.cursor
        className={cn(common, "text-neutral-900 dark:text-neutral-100")}
        aria-hidden="true"
      />
    );
  }
  if (id === "gemini") {
    return (
      <svg viewBox="0 0 16 16" className={common} aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 1.5 9.2 6.8 14.5 8 9.2 9.2 8 14.5 6.8 9.2 1.5 8 6.8 6.8 8 1.5z"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className={common} aria-hidden="true">
      <rect x="3" y="3" width="10" height="10" rx="2" fill="currentColor" />
    </svg>
  );
}

const prettyModelName = (raw: string) => {
  let name = raw.replace(/^(cursor|pi)-/, "");
  name = name
    .replace(/-(high|medium|low|fast|xhigh|thinking)\b/gi, "")
    .replace(/-sol$/, "")
    .replace(/-+/g, "-")
    .replace(/-$/, "");
  if (name.startsWith("gpt-")) return `GPT-${name.slice(4)}`;
  if (name.startsWith("claude-")) {
    return name
      .slice(7)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

function Pill({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex items-center gap-1 text-xs"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full px-2.5 py-1 transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function UsageDashboard() {
  const [range, setRange] = useState<UsageRange>(30);
  const [metric, setMetric] = useState<Metric>("cost");
  const [hidden, setHidden] = useState<string[]>([]);

  const days = useMemo(() => windowDaily(range), [range]);
  const summary = useMemo(() => summarizeDays(days), [days]);
  const visibleAgents = summary.agents
    .map((agent) => agent.id)
    .filter((id) => !hidden.includes(id));
  const featuredAgents = summary.agents.filter((agent) => {
    const total = summary.totals.cost;
    return (total > 0 ? agent.cost / total : 0) >= 0.004;
  });

  const toggleAgent = (id: string) => {
    setHidden((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length + 1 >= featuredAgents.length) return current;
      return [...current, id];
    });
  };

  const cost = summary.totals.cost;
  const animatedCost = useCountUp(cost);
  const favourite = useMemo(
    () => summarizeDays(windowDaily(7)).models[0] ?? null,
    [],
  );

  if (!usage.daily.length) {
    return (
      <div className="rounded-lg border border-dashed px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          My agentic trends
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          No snapshot yet. Run{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
            bun run usage
          </code>{" "}
          in the site folder, then commit{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
            src/data/usage.json
          </code>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            My agentic trends
          </h1>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            What I actually spend running coding agents.
          </p>
        </div>
        <Pill
          label="Time range"
          value={String(range)}
          onChange={(value) => setRange(Number(value) as UsageRange)}
          options={[
            { value: "7", label: "7 days" },
            { value: "30", label: "30 days" },
            { value: "90", label: "90 days" },
          ]}
        />
      </div>

      <div className="mt-8 motion-safe:animate-fade-up">
        <p className="relative w-fit text-4xl font-semibold tracking-tight tabular-nums sm:text-6xl">
          <span className="invisible" aria-hidden="true">
            {formatMoney(cost)}
          </span>
          <span className="absolute inset-0">{formatMoney(animatedCost)}</span>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          raw token api costs
        </p>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)] lg:items-end lg:gap-12">
        <ul className="space-y-4">
          {featuredAgents.map((agent, index) => {
            const share = cost > 0 ? agent.cost / cost : 0;
            const delay = 160 + index * 90;
            return (
              <li
                key={`${range}-${agent.id}`}
                className="motion-safe:animate-fade-up"
                style={{ animationDelay: `${delay}ms` }}
              >
                <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                  {AGENT_HREF[agent.id] ? (
                    <a
                      href={AGENT_HREF[agent.id]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-medium underline-offset-4 hover:underline"
                    >
                      <AgentMark id={agent.id} />
                      {agent.label}
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 font-medium">
                      <AgentMark id={agent.id} />
                      {agent.label}
                    </span>
                  )}
                  <span className="flex items-baseline gap-2 tabular-nums">
                    <span className="text-foreground">
                      {formatMoney(agent.cost)}
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round(share * 100)}% · {formatCompact(agent.tokens)}{" "}
                      tokens
                    </span>
                  </span>
                </div>
                <div className="h-2.5 w-full">
                  <div
                    className={cn(
                      "origin-left rounded-full motion-safe:animate-bar-in",
                      agentBarClassName[agent.id] ?? agentBarClassName.other,
                    )}
                    style={{
                      width: `${Math.max(share * 100, share > 0 ? 1.5 : 0)}%`,
                      height: `${Math.max(5, 4 + share * 8)}px`,
                      marginTop: `${Math.max(0, (10 - (4 + share * 8)) / 2)}px`,
                      animationDelay: `${delay + 80}ms`,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        <section className="mt-10 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-medium">
              Daily {metric === "cost" ? "cost" : "tokens"}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Segmented
                label="Chart metric"
                value={metric}
                onChange={setMetric}
                options={[
                  { value: "cost", label: "Cost" },
                  { value: "tokens", label: "Tokens" },
                ]}
              />
              <div className="flex flex-wrap items-center gap-2">
                {featuredAgents.map((agent) => {
                  const on = !hidden.includes(agent.id);
                  return (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => toggleAgent(agent.id)}
                      className={cn(
                        "flex items-center gap-1.5 text-xs transition-opacity",
                        on ? "opacity-100" : "opacity-40",
                      )}
                    >
                      <span
                        className={cn(
                          "size-2 rounded-[2px]",
                          agentBarClassName[agent.id] ??
                            agentBarClassName.other,
                        )}
                      />
                      {agent.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <DailyUsageChart
            days={days}
            agentIds={visibleAgents.filter((id) =>
              featuredAgents.some((agent) => agent.id === id),
            )}
            metric={metric}
          />
        </section>
      </div>

      <dl
        className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 border-y border-border/70 py-6 motion-safe:animate-fade-up sm:grid-cols-4 lg:divide-x lg:divide-border/70 lg:py-5"
        style={{ animationDelay: "520ms" }}
      >
        <Stat
          label="Processed tokens"
          value={formatCompact(summary.totals.tokens)}
          hint={
            summary.activeDays
              ? `${formatCompact(summary.totals.tokens / summary.activeDays)} per active day`
              : undefined
          }
        />
        <Stat
          label="Cached input"
          value={formatCompact(summary.totals.cacheRead)}
          hint={`${formatPercent(summary.cachedShare)} of observed input`}
        />
        <Stat
          label="Output"
          value={formatCompact(summary.totals.output)}
          hint={
            summary.activeDays
              ? `${formatCompact(summary.totals.output / summary.activeDays)} per active day`
              : undefined
          }
        />
        {favourite ? (
          <Stat
            label="Favourite model right now"
            value={prettyModelName(favourite.name)}
            hint={`via ${agentLabel(favourite.agent)}`}
            tabular={false}
          />
        ) : null}
      </dl>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  tabular = true,
}: {
  label: string;
  value: string;
  hint?: string;
  tabular?: boolean;
}) {
  return (
    <div className="lg:px-4 first:lg:pl-0 last:lg:pr-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "mt-1 text-xl font-semibold tracking-tight sm:text-2xl",
          tabular && "tabular-nums",
        )}
      >
        {value}
      </dd>
      {hint ? (
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
