"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

type Day = {
  date: string;
  count: number;
  level: number;
};

const LEVEL = [
  "bg-neutral-200 dark:bg-white/[0.08]",
  "bg-emerald-300 dark:bg-emerald-900",
  "bg-emerald-400 dark:bg-emerald-700",
  "bg-emerald-500 dark:bg-emerald-500",
  "bg-emerald-600 dark:bg-emerald-400",
] as const;

const weekday = (iso: string) => new Date(`${iso}T00:00:00`).getDay();

const monthLabel = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short" });

const toWeeks = (days: Day[]) => {
  if (!days.length) return [];
  const pad = weekday(days[0].date);
  const cells: Array<Day | null> = [...Array(pad).fill(null), ...days];
  const weeks: Array<Array<Day | null>> = [];
  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7);
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
};

export function GitHubActivity({
  username,
  profileUrl,
}: {
  username: string;
  profileUrl: string;
}) {
  const [days, setDays] = useState<Day[] | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then((payload: { total?: { lastYear?: number }; contributions?: Day[] }) => {
        if (cancelled) return;
        setDays(payload.contributions ?? []);
        setTotal(payload.total?.lastYear ?? 0);
      })
      .catch(() => {
        if (!cancelled) setDays([]);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  const weeks = useMemo(() => (days ? toWeeks(days) : []), [days]);

  const months = useMemo(() => {
    const labels: Array<{ index: number; label: string }> = [];
    let last = "";
    weeks.forEach((week, index) => {
      const first = week.find((day) => day)?.date;
      if (!first) return;
      const label = monthLabel(first);
      if (label !== last) {
        labels.push({ index, label });
        last = label;
      }
    });
    return labels;
  }, [weeks]);

  if (days && days.length === 0) return null;

  return (
    <section className="mt-10 pb-4 motion-safe:animate-fade-up" style={{ animationDelay: "640ms" }}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-medium">GitHub</h2>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {total
            ? `${total.toLocaleString("en-US")} contributions in the last year`
            : `@${username}`}
        </a>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[40rem]">
          <div className="relative mb-1.5 h-4">
            {months.map((month) => (
              <span
                key={`${month.label}-${month.index}`}
                className="absolute top-0 text-[10px] uppercase tracking-wide text-muted-foreground"
                style={{ left: `${(month.index / Math.max(weeks.length, 1)) * 100}%` }}
              >
                {month.label}
              </span>
            ))}
          </div>
          <div className="flex w-full justify-between">
            {(weeks.length ? weeks : Array.from({ length: 53 }, () => Array(7).fill(null))).map(
              (week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => (
                    <div
                      key={day?.date ?? `${weekIndex}-${dayIndex}`}
                      className={cn(
                        "size-[11px] rounded-[2px]",
                        day
                          ? LEVEL[Math.min(day.level, 4)]
                          : days
                            ? "bg-transparent"
                            : LEVEL[0],
                      )}
                    />
                  ))}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
