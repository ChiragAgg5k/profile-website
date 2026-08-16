"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Caption } from "@/components/mermaid-diagram";

// Tool calls and human turns bucketed by local hour, Claude Code and Codex
// summed. Both harnesses independently put 0.7% of their tool calls in the
// 00:00-06:00 band, which is the only number in this post that matters.
const NIGHT_END = 6;

const tools = [
  1221, 0, 101, 21, 6, 69, 388, 2382, 11783, 12482, 17250, 15958, 12145, 14312,
  18266, 15536, 20507, 19476, 11964, 7244, 6255, 6391, 4857, 2859,
];

const humans = [
  44, 0, 4, 0, 0, 2, 34, 187, 803, 795, 1130, 1070, 867, 1034, 1342, 1167, 1341,
  1329, 629, 352, 389, 360, 296, 179,
];

const data = tools.map((toolCalls, hour) => ({
  hour,
  label: `${String(hour).padStart(2, "0")}:00`,
  toolCalls,
  humanTurns: humans[hour],
  night: hour < NIGHT_END,
}));

const colors = {
  light: {
    accent: "#2a78d6",
    night: "#c9c8c2",
    gray: "#8a8880",
    text: "#0b0b0b",
    grid: "#d6d5d0",
  },
  dark: {
    accent: "#3987e5",
    night: "#4a4a45",
    gray: "#7c7b74",
    text: "#ffffff",
    grid: "#3d3d39",
  },
};

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <span className="font-medium text-black dark:text-white">{d.label}</span>
      <span className="text-gray-500 dark:text-gray-400">
        {" "}
        · {d.toolCalls.toLocaleString()} tool calls,{" "}
        {d.humanTurns.toLocaleString()} human turns
      </span>
    </div>
  );
};

export const AgentClock = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const c = colors[resolvedTheme === "dark" ? "dark" : "light"];

  return (
    <figure className="my-10">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="text-sm font-medium text-black dark:text-gray-200">
          Agent tool calls by hour of day
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: c.night }}
            />
            00:00&ndash;06:00
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: c.accent }}
            />
            awake
          </span>
        </div>
      </div>

      <div className="h-[260px] w-full" aria-hidden="true">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 4, right: 0, bottom: 16, left: 0 }}
              barCategoryGap={2}
            >
              <CartesianGrid
                horizontal
                vertical={false}
                stroke={c.grid}
                strokeDasharray="2 4"
              />
              <XAxis
                dataKey="hour"
                axisLine={false}
                tickLine={false}
                ticks={[0, 3, 6, 9, 12, 15, 18, 21]}
                tick={{ fill: c.text, fontSize: 11 }}
                tickFormatter={(h: number) =>
                  `${String(h).padStart(2, "0")}:00`
                }
                label={{
                  value: "hour of day",
                  position: "insideBottom",
                  offset: -12,
                  style: { fill: c.gray, fontSize: 11 },
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={38}
                domain={[0, 21000]}
                ticks={[0, 5000, 10000, 15000, 20000]}
                tick={{ fill: c.gray, fontSize: 11 }}
                tickFormatter={(v: number) => (v === 0 ? "0" : `${v / 1000}k`)}
              />
              <Tooltip
                cursor={{ fill: c.grid, fillOpacity: 0.25 }}
                content={<ChartTooltip />}
              />
              <Bar dataKey="toolCalls" radius={[3, 3, 0, 0]} isAnimationActive>
                {data.map((d) => (
                  <Cell key={d.hour} fill={d.night ? c.night : c.accent} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </div>

      <details className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        <summary className="cursor-pointer">View as table</summary>
        <table className="mt-2 w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b border-gray-200 py-1 text-left dark:border-neutral-800">
                Hour
              </th>
              <th className="border-b border-gray-200 py-1 text-left dark:border-neutral-800">
                Tool calls
              </th>
              <th className="border-b border-gray-200 py-1 text-left dark:border-neutral-800">
                Human turns
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.hour}>
                <td className="py-1">{d.label}</td>
                <td className="py-1">{d.toolCalls.toLocaleString()}</td>
                <td className="py-1">{d.humanTurns.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <Caption>
        201,473 tool calls across Claude Code and Codex, 12 January to 14 August
        2026, bucketed by local hour. The grey bars are 00:00 to 06:00: 1,418
        calls, or 0.7% of the total.
      </Caption>
    </figure>
  );
};
