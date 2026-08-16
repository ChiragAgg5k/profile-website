"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Caption } from "@/components/mermaid-diagram";

const data = [
  { month: "Mar 25", mcp: 1_874_545, commander: 787_130_740 },
  { month: "Apr 25", mcp: 4_212_709, commander: 815_806_539 },
  { month: "May 25", mcp: 20_933_359, commander: 843_891_371 },
  { month: "Jun 25", mcp: 16_837_593, commander: 956_896_142 },
  { month: "Jul 25", mcp: 21_605_761, commander: 968_785_974 },
  { month: "Aug 25", mcp: 24_658_353, commander: 880_885_769 },
  { month: "Sep 25", mcp: 31_258_519, commander: 939_415_279 },
  { month: "Oct 25", mcp: 31_805_028, commander: 988_593_636 },
  { month: "Nov 25", mcp: 35_008_987, commander: 976_224_225 },
  { month: "Dec 25", mcp: 38_516_712, commander: 950_966_229 },
  { month: "Jan 26", mcp: 50_249_918, commander: 1_042_801_043 },
  { month: "Feb 26", mcp: 71_656_771, commander: 1_150_522_398 },
  { month: "Mar 26", mcp: 141_911_796, commander: 1_493_707_532 },
  { month: "Apr 26", mcp: 140_092_905, commander: 1_571_890_965 },
  { month: "May 26", mcp: 153_164_130, commander: 1_718_005_414 },
  { month: "Jun 26", mcp: 165_176_305, commander: 1_813_676_931 },
  { month: "Jul 26", mcp: 191_923_439, commander: 1_928_879_054 },
];

const compact = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const ChartTooltip = ({ active, payload, label, dataKey }: any) => {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.payload?.[dataKey];
  return (
    <div className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <span className="font-medium text-black dark:text-white">{label}</span>
      <span className="text-gray-500 dark:text-gray-400">
        {" "}
        · {compact(value)} downloads
      </span>
    </div>
  );
};

const Sparkline = ({
  dataKey,
  color,
  gradientId,
}: {
  dataKey: "mcp" | "commander";
  color: string;
  gradientId: string;
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.24} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis dataKey="month" hide />
      <YAxis hide domain={["dataMin", "dataMax"]} />
      <Tooltip
        cursor={{ stroke: color, strokeOpacity: 0.35 }}
        content={<ChartTooltip dataKey={dataKey} />}
      />
      <Area
        type="monotone"
        dataKey={dataKey}
        stroke={color}
        strokeWidth={2}
        fill={`url(#${gradientId})`}
        dot={false}
        activeDot={{ r: 3, strokeWidth: 0 }}
        isAnimationActive
      />
    </AreaChart>
  </ResponsiveContainer>
);

export const InterfaceAdoptionChart = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dark = resolvedTheme === "dark";
  const mcpColor = dark ? "#60a5fa" : "#2563eb";
  const cliColor = dark ? "#a3a3a3" : "#525252";

  return (
    <figure className="my-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Monthly npm downloads · Mar 2025–Jul 2026
        </p>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-gray-400">
          Full months
        </span>
      </div>

      <div className="grid gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 dark:border-neutral-800 dark:bg-neutral-800 sm:grid-cols-2">
        <div className="bg-white p-4 dark:bg-neutral-950">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                MCP TypeScript SDK
              </p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-black dark:text-white">
                191.9M
              </p>
            </div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              102×
            </span>
          </div>
          <div className="mt-2 h-28" aria-hidden="true">
            {mounted ? (
              <Sparkline
                dataKey="mcp"
                color={mcpColor}
                gradientId="mcp-adoption"
              />
            ) : null}
          </div>
        </div>

        <div className="bg-white p-4 dark:bg-neutral-950">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Commander CLI framework
              </p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-black dark:text-white">
                1.93B
              </p>
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              2.5×
            </span>
          </div>
          <div className="mt-2 h-28" aria-hidden="true">
            {mounted ? (
              <Sparkline
                dataKey="commander"
                color={cliColor}
                gradientId="cli-adoption"
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-wider text-gray-400">
        <span>Mar 2025</span>
        <span>Jul 2026</span>
      </div>

      <details className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        <summary className="cursor-pointer">Read the chart data</summary>
        <table className="mt-2 w-full border-collapse tabular-nums">
          <thead>
            <tr>
              <th className="border-b border-gray-200 py-1 text-left dark:border-neutral-800">
                Month
              </th>
              <th className="border-b border-gray-200 py-1 text-right dark:border-neutral-800">
                MCP SDK
              </th>
              <th className="border-b border-gray-200 py-1 text-right dark:border-neutral-800">
                Commander
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((point) => (
              <tr key={point.month}>
                <td className="py-1">{point.month}</td>
                <td className="py-1 text-right">{compact(point.mcp)}</td>
                <td className="py-1 text-right">{compact(point.commander)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <Caption>
        Source: npm Downloads API. Downloads are a noisy proxy, but both
        ecosystems are growing.
      </Caption>
    </figure>
  );
};
