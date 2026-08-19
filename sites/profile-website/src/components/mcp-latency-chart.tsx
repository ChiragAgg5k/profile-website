"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Caption } from "@/components/mermaid-diagram";

// Repeated reads after the agent had selected a project. Milliseconds, lower
// is better. `runs` records how the number was collected:
// medians where three rounds landed, single calls where only one succeeded.
const data = [
  { name: "Resource detail", appwrite: 416, vercel: 891, runs: "3 + 3" },
  { name: "Deployment list", appwrite: 448, vercel: 897, runs: "3 + 3" },
  { name: "Deployment detail", appwrite: 491, vercel: 914, runs: "3 + 3" },
  { name: "Build logs", appwrite: 319, vercel: 2590, runs: "1 + 1" },
  { name: "Analytics", appwrite: 416, vercel: 915, runs: "1 + 1" },
  { name: "Docs search", appwrite: 525, vercel: 1464, runs: "3 + 3" },
];

const colors = {
  light: {
    appwrite: "#f02e65",
    vercel: "#8a8880",
    text: "#0b0b0b",
    grid: "#d6d5d0",
  },
  dark: {
    appwrite: "#fd366e",
    vercel: "#7c7b74",
    text: "#ffffff",
    grid: "#3d3d39",
  },
};

const ms = (value: number) => `${value.toLocaleString("en-US")} ms`;

const TooltipRow = ({
  label,
  value,
  swatch,
}: {
  label: string;
  value: number;
  swatch: string;
}) => (
  <div className="flex items-center gap-2">
    <span className={`size-2 shrink-0 rounded-full ${swatch}`} />
    <span className="text-gray-500 dark:text-gray-400">{label}</span>
    <span className="ml-auto pl-4 font-medium tabular-nums text-black dark:text-white">
      {ms(value)}
    </span>
  </div>
);

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const [fast, slow] =
    d.appwrite <= d.vercel ? ["Appwrite", "Vercel"] : ["Vercel", "Appwrite"];
  const ratio = Math.max(d.appwrite, d.vercel) / Math.min(d.appwrite, d.vercel);

  return (
    <div className="min-w-[13rem] rounded-lg border border-gray-200 bg-white p-3 text-xs shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
      <p className="mb-2 font-medium text-black dark:text-white">{d.name}</p>
      <div className="flex flex-col gap-1.5">
        <TooltipRow
          label="Appwrite"
          value={d.appwrite}
          swatch="bg-[#f02e65] dark:bg-[#fd366e]"
        />
        <TooltipRow
          label="Vercel"
          value={d.vercel}
          swatch="bg-gray-500 dark:bg-neutral-300"
        />
      </div>
      <p className="mt-2 border-t border-gray-100 pt-2 text-gray-500 dark:border-neutral-800 dark:text-gray-400">
        {fast} faster by{" "}
        <span className="tabular-nums text-black dark:text-white">
          {ratio.toFixed(1)}&times;
        </span>{" "}
        <span className="text-gray-400 dark:text-neutral-500">
          ({ms(Math.abs(d.appwrite - d.vercel))})
        </span>
      </p>
    </div>
  );
};

export const McpLatencyChart = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const c = colors[resolvedTheme === "dark" ? "dark" : "light"];

  return (
    <figure className="my-10">
      <p className="mb-4 text-sm font-medium text-black dark:text-gray-200">
        Observed MCP call latency, lower is better
      </p>

      <div className="h-[360px] w-full" aria-hidden="true">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 76, bottom: 0, left: 0 }}
              barCategoryGap={10}
              barGap={2}
            >
              <XAxis type="number" hide domain={[0, 2900]} />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={128}
                tick={{ fill: c.text, fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: c.grid, fillOpacity: 0.25 }}
                content={<ChartTooltip />}
              />
              <Legend
                verticalAlign="top"
                align="left"
                height={28}
                iconType="square"
                iconSize={9}
                wrapperStyle={{ fontSize: 12, color: c.text }}
              />
              <Bar
                dataKey="appwrite"
                name="Appwrite"
                fill={c.appwrite}
                radius={[0, 3, 3, 0]}
                isAnimationActive
              >
                <LabelList
                  dataKey="appwrite"
                  position="right"
                  offset={6}
                  formatter={(v: unknown) => Number(v).toLocaleString("en-US")}
                  style={{ fill: c.text, fontSize: 11 }}
                />
              </Bar>
              <Bar
                dataKey="vercel"
                name="Vercel"
                fill={c.vercel}
                radius={[0, 3, 3, 0]}
                isAnimationActive
              >
                <LabelList
                  dataKey="vercel"
                  position="right"
                  offset={6}
                  formatter={(v: unknown) => Number(v).toLocaleString("en-US")}
                  style={{ fill: c.text, fontSize: 11 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </div>

      <details className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        <summary className="cursor-pointer">View as table</summary>
        <table className="mt-2 w-full border-collapse tabular-nums">
          <thead>
            <tr>
              <th className="border-b border-gray-200 py-1 text-left dark:border-neutral-800">
                Operation
              </th>
              <th className="border-b border-gray-200 py-1 text-right dark:border-neutral-800">
                Appwrite
              </th>
              <th className="border-b border-gray-200 py-1 text-right dark:border-neutral-800">
                Vercel
              </th>
              <th className="border-b border-gray-200 py-1 text-right dark:border-neutral-800">
                Runs
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.name}>
                <td className="py-1">{d.name}</td>
                <td className="py-1 text-right">{ms(d.appwrite)}</td>
                <td className="py-1 text-right">{ms(d.vercel)}</td>
                <td className="py-1 text-right">{d.runs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <Caption>
        Medians where three rounds were collected, single successful calls
        otherwise. Network conditions, payload size, and unlike response shapes
        all move these numbers, so they are not infrastructure benchmarks.
      </Caption>
    </figure>
  );
};
