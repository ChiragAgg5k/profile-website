"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Caption, Mono } from "@/components/mermaid-diagram";

// Playwright MCP calls from Claude Code transcripts, 17 Sep to 17 Oct 2026.
// "Other" folds the ten tools with fewer than 40 calls each.
const data = [
  { name: "navigate", calls: 372 },
  { name: "take_screenshot", calls: 332 },
  { name: "evaluate", calls: 304 },
  { name: "click", calls: 247 },
  { name: "run_code_unsafe", calls: 188 },
  { name: "wait_for", calls: 160 },
  { name: "snapshot", calls: 120 },
  { name: "resize", calls: 45 },
  { name: "other 10 tools", calls: 161 },
];

const colors = {
  light: {
    accent: "#2a78d6",
    gray: "#8a8880",
    text: "#0b0b0b",
    grid: "#d6d5d0",
  },
  dark: {
    accent: "#3987e5",
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
      <span className="font-medium text-black dark:text-white">{d.name}</span>
      <span className="text-gray-500 dark:text-gray-400">
        {" "}
        · {d.calls.toLocaleString("en-US")} calls
      </span>
    </div>
  );
};

export const PlaywrightToolChart = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const c = colors[resolvedTheme === "dark" ? "dark" : "light"];

  return (
    <figure className="my-10">
      <p className="mb-4 text-sm font-medium text-black dark:text-gray-200">
        1,929 Playwright MCP calls by tool
      </p>

      <div className="h-[320px] w-full" aria-hidden="true">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 48, bottom: 0, left: 0 }}
              barCategoryGap={6}
            >
              <XAxis type="number" hide domain={[0, 400]} />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={120}
                tick={{ fill: c.text, fontSize: 13 }}
              />
              <Tooltip
                cursor={{ fill: c.grid, fillOpacity: 0.25 }}
                content={<ChartTooltip />}
              />
              <Bar dataKey="calls" radius={[0, 4, 4, 0]} isAnimationActive>
                {data.map((d) => (
                  <Cell
                    key={d.name}
                    fill={d.name === "take_screenshot" ? c.accent : c.gray}
                  />
                ))}
                <LabelList
                  dataKey="calls"
                  position="right"
                  offset={8}
                  style={{ fill: c.text, fontSize: 12, fontWeight: 600 }}
                />
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
                Tool
              </th>
              <th className="border-b border-gray-200 py-1 text-left dark:border-neutral-800">
                Calls
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.name}>
                <td className="py-1">{d.name}</td>
                <td className="py-1">{d.calls}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <Caption>
        Every <Mono>mcp__playwright__*</Mono> call in my Claude Code
        transcripts, 17 September to 17 October 2026, across 62 sessions.
      </Caption>
    </figure>
  );
};
