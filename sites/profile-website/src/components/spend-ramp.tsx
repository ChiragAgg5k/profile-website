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
import { Caption } from "@/components/mermaid-diagram";

// Monthly spend across every agent. April is the step change: 7.4x March, and
// the month the worktree-and-subagent workflow replaced one-chat-at-a-time.
const data = [
  { month: "Jan", cost: 21, days: 9, partial: false },
  { month: "Feb", cost: 240, days: 21, partial: false },
  { month: "Mar", cost: 533, days: 26, partial: false },
  { month: "Apr", cost: 3930, days: 30, partial: false },
  { month: "May", cost: 6556, days: 29, partial: false },
  { month: "Jun", cost: 5268, days: 27, partial: false },
  { month: "Jul", cost: 6289, days: 30, partial: false },
  { month: "Aug", cost: 5498, days: 14, partial: true },
];

const colors = {
  light: {
    accent: "#2a78d6",
    gray: "#8a8880",
    faded: "#c9c8c2",
    text: "#0b0b0b",
    grid: "#d6d5d0",
  },
  dark: {
    accent: "#3987e5",
    gray: "#7c7b74",
    faded: "#4a4a45",
    text: "#ffffff",
    grid: "#3d3d39",
  },
};

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <span className="font-medium text-black dark:text-white">{d.month}</span>
      <span className="text-gray-500 dark:text-gray-400">
        {" "}
        · ${d.cost.toLocaleString()} over {d.days} active days, $
        {Math.round(d.cost / d.days)}/day
        {d.partial ? " (to the 14th)" : ""}
      </span>
    </div>
  );
};

export const SpendRamp = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const c = colors[resolvedTheme === "dark" ? "dark" : "light"];

  return (
    <figure className="my-10">
      <p className="mb-4 text-sm font-medium text-black dark:text-gray-200">
        Agent spend by month, all harnesses
      </p>

      <div className="h-[240px] w-full" aria-hidden="true">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
              barCategoryGap={10}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: c.text, fontSize: 12 }}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: c.grid, fillOpacity: 0.25 }}
                content={<ChartTooltip />}
              />
              <Bar dataKey="cost" radius={[4, 4, 0, 0]} isAnimationActive>
                {data.map((d) => (
                  <Cell
                    key={d.month}
                    fill={
                      d.partial
                        ? c.faded
                        : d.month === "Apr"
                          ? c.accent
                          : c.gray
                    }
                  />
                ))}
                <LabelList
                  dataKey="cost"
                  position="top"
                  offset={6}
                  formatter={(value) => {
                    const cost = Number(value);
                    return cost >= 1000
                      ? `$${(cost / 1000).toFixed(1)}k`
                      : `$${cost}`;
                  }}
                  style={{ fill: c.text, fontSize: 11, fontWeight: 600 }}
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
                Month
              </th>
              <th className="border-b border-gray-200 py-1 text-left dark:border-neutral-800">
                Spend
              </th>
              <th className="border-b border-gray-200 py-1 text-left dark:border-neutral-800">
                Active days
              </th>
              <th className="border-b border-gray-200 py-1 text-left dark:border-neutral-800">
                Per day
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.month}>
                <td className="py-1">
                  {d.month}
                  {d.partial ? " (partial)" : ""}
                </td>
                <td className="py-1">${d.cost.toLocaleString()}</td>
                <td className="py-1">{d.days}</td>
                <td className="py-1">${Math.round(d.cost / d.days)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <Caption>
        January starts on the 12th and August stops on the 14th, so both ends
        are short. April is the step change: 7.4&times; March.
      </Caption>
    </figure>
  );
};
