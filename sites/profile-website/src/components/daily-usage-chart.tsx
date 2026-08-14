"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  agentColor,
  agentLabel,
  formatAxisDate,
  formatCompact,
  formatMoney,
  type DailyUsage,
} from "@/data/usage";
import { cn } from "@/lib/utils";

type Metric = "cost" | "tokens";

type DailyUsageChartProps = {
  days: DailyUsage[];
  agentIds: string[];
  metric: Metric;
};

const ChartTooltip = ({
  active,
  payload,
  label,
  metric,
  dark,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
  metric: Metric;
  dark: boolean;
}) => {
  if (!active || !payload?.length || !label) return null;
  const visible = payload.filter((row) => (row.value || 0) > 0);
  if (!visible.length) return null;
  return (
    <div
      className={`rounded-md border px-2.5 py-2 text-xs shadow-sm ${
        dark
          ? "border-white/10 bg-[#161616] text-white"
          : "border-black/10 bg-white text-black"
      }`}
    >
      <p className="mb-1.5 text-[11px] text-muted-foreground">
        {new Date(`${label}T00:00:00`).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </p>
      <ul className="space-y-1">
        {visible.map((row) => (
          <li
            key={row.dataKey}
            className="flex items-center justify-between gap-6 tabular-nums"
          >
            <span className="flex items-center gap-1.5">
              <span
                className="size-1.5 rounded-full"
                style={{ background: row.color }}
              />
              {agentLabel(row.dataKey)}
            </span>
            <span>
              {metric === "cost"
                ? formatMoney(row.value)
                : formatCompact(row.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export function DailyUsageChart({
  days,
  agentIds,
  metric,
}: DailyUsageChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setMounted(true);
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const dark = resolvedTheme === "dark";
  const axis = dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)";
  const grid = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const cursorFill = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";

  const data = useMemo(
    () =>
      days.map((day) => {
        const row: Record<string, number | string> = { date: day.date };
        for (const id of agentIds) {
          const agent = day.agents[id];
          row[id] = metric === "cost" ? agent?.cost || 0 : agent?.tokens || 0;
        }
        return row;
      }),
    [agentIds, days, metric],
  );

  const ticks = useMemo(() => {
    if (days.length === 0) return [];
    if (days.length < 3) return days.map((day) => day.date);
    return [
      days[0].date,
      days[Math.floor(days.length / 2)].date,
      days[days.length - 1].date,
    ];
  }, [days]);

  if (!mounted) {
    return <div className="h-[280px] w-full sm:h-[320px]" aria-hidden="true" />;
  }

  return (
    <div
      key={`${days[0]?.date ?? ""}-${days.length}-${metric}`}
      className={cn(
        "h-[280px] w-full overflow-hidden sm:h-[320px]",
        "motion-safe:animate-chart-in",
      )}
    >
      <ResponsiveContainer width="100%" height="100%" debounce={1}>
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 12, left: 4, bottom: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke={grid}
            strokeDasharray="0"
          />
          <XAxis
            dataKey="date"
            ticks={ticks}
            tickFormatter={formatAxisDate}
            axisLine={false}
            tickLine={false}
            tick={{ fill: axis, fontSize: 11, fontFamily: "inherit" }}
            dy={8}
            interval={0}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={58}
            domain={[0, "auto"]}
            tickCount={4}
            tickFormatter={(value: number) =>
              metric === "cost"
                ? `$${Math.round(value).toLocaleString("en-US")}`
                : formatCompact(value)
            }
            tick={{ fill: axis, fontSize: 11, fontFamily: "inherit" }}
          />
          <Tooltip
            cursor={{ fill: cursorFill }}
            content={
              <ChartTooltip metric={metric} dark={dark} />
            }
          />
          {agentIds.map((id) => {
            const color = agentColor(id, dark);
            return (
              <Area
                key={id}
                type="monotone"
                dataKey={id}
                stroke={color}
                fill={color}
                fillOpacity={id === "claude" ? 0.28 : id === "codex" ? 0.12 : 0.06}
                strokeWidth={id === "claude" || id === "codex" ? 1.75 : 1.25}
                dot={false}
                activeDot={{ r: 3.5, strokeWidth: 0 }}
                isAnimationActive={false}
                connectNulls
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
