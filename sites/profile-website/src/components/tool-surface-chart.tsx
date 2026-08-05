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

// "exposed" is what the model sees in tools/list. "catalog" is how many
// operations sit behind that surface, where the two differ.
const data = [
  { name: "GitHub", exposed: 90, catalog: null },
  { name: "Supabase", exposed: 29, catalog: null },
  { name: "Convex", exposed: 12, catalog: null },
  { name: "Stripe", exposed: 12, catalog: "whole API behind search" },
  { name: "Sentry", exposed: 9, catalog: "46 in catalog" },
  { name: "Appwrite", exposed: 4, catalog: "981 in catalog" },
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

// Recharts renders "name: value" and still emits the separator when the name is
// blank, so the default tooltip shows a stray leading colon. Own the markup.
const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <span className="font-medium text-black dark:text-white">{d.name}</span>
      <span className="text-gray-500 dark:text-gray-400">
        {" "}
        · {d.exposed} exposed
        {d.catalog ? `, ${d.catalog}` : ""}
      </span>
    </div>
  );
};

export const ToolSurfaceChart = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const c = colors[resolvedTheme === "dark" ? "dark" : "light"];

  return (
    <figure className="my-10">
      <p className="mb-4 text-sm font-medium text-black dark:text-gray-200">
        Tools the model actually sees in <Mono>tools/list</Mono>
      </p>

      <div className="h-[260px] w-full" aria-hidden="true">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 150, bottom: 0, left: 0 }}
              barCategoryGap={6}
            >
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={78}
                tick={{ fill: c.text, fontSize: 13 }}
              />
              <Tooltip
                cursor={{ fill: c.grid, fillOpacity: 0.25 }}
                content={<ChartTooltip />}
              />
              <Bar dataKey="exposed" radius={[0, 4, 4, 0]} isAnimationActive>
                {data.map((d) => (
                  <Cell
                    key={d.name}
                    fill={d.name === "Appwrite" ? c.accent : c.gray}
                  />
                ))}
                <LabelList
                  dataKey="exposed"
                  position="right"
                  offset={8}
                  style={{ fill: c.text, fontSize: 12, fontWeight: 600 }}
                />
                <LabelList
                  dataKey="catalog"
                  position="right"
                  offset={34}
                  style={{ fill: c.gray, fontSize: 11 }}
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
                Server
              </th>
              <th className="border-b border-gray-200 py-1 text-left dark:border-neutral-800">
                Exposed
              </th>
              <th className="border-b border-gray-200 py-1 text-left dark:border-neutral-800">
                Behind the surface
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.name}>
                <td className="py-1">{d.name}</td>
                <td className="py-1">{d.exposed}</td>
                <td className="py-1">{d.catalog ?? "same"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <Caption>
        Counts as of August 2026. GitHub&apos;s 90 are grouped into 22 toolsets
        with 5 on by default.
      </Caption>
    </figure>
  );
};
