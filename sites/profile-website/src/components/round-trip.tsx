"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { Caption, Mono } from "@/components/mermaid-diagram";

// Schematic units, not seconds. The ratio is the point: the user takes as long
// as the user takes, and the old design paid for that time with an open socket.
const SCALE = 9;
const PLAY_SECONDS = 3.6;

type Kind = "message" | "held" | "idle";

type Segment = {
  key: string;
  label: string;
  start: number;
  units: number;
  kind: Kind;
};

const build = (parts: readonly [string, number, Kind][]): Segment[] => {
  let cursor = 0;

  return parts.map(([label, units, kind]) => {
    const segment = { key: label, label, start: cursor, units, kind };
    cursor += units;

    return segment;
  });
};

const held = build([
  ["tools/call", 0.9, "message"],
  [
    "SSE stream held open — this instance, for as long as the user takes",
    7.2,
    "held",
  ],
  ["result", 0.9, "message"],
]);

const roundTrip = build([
  ["tools/call", 0.9, "message"],
  ["InputRequiredResult", 1.3, "message"],
  ["nothing open, nothing pinned", 4.9, "idle"],
  ["inputResponses + requestState", 1, "message"],
  ["result", 0.9, "message"],
]);

const Lane = ({
  title,
  detail,
  segments,
  run,
  inView,
  reduceMotion,
}: {
  title: string;
  detail: string;
  segments: Segment[];
  run: number;
  inView: boolean;
  reduceMotion: boolean;
}) => (
  <div>
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <code className="text-xs text-black dark:text-gray-200">{title}</code>
      <span className="text-xs text-gray-500 dark:text-gray-400">{detail}</span>
    </div>
    <div className="relative h-8 w-full rounded bg-gray-100 dark:bg-neutral-900">
      {segments.map((segment) => (
        <motion.div
          key={`${run}-${segment.key}`}
          // initial is read once at mount, and at mount the figure is usually
          // below the fold — inView has to drive the target or it never plays.
          initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
          animate={
            reduceMotion || inView
              ? { scaleX: 1, opacity: 1 }
              : { scaleX: 0, opacity: 0 }
          }
          transition={{
            duration: (segment.units / SCALE) * PLAY_SECONDS,
            delay: (segment.start / SCALE) * PLAY_SECONDS,
            ease: "linear",
          }}
          style={{
            left: `${(segment.start / SCALE) * 100}%`,
            width: `${(segment.units / SCALE) * 100}%`,
            originX: 0,
          }}
          className={`absolute inset-y-0 flex items-center justify-center overflow-hidden rounded-[2px] px-1 text-center text-[9px] leading-tight ${
            segment.kind === "message"
              ? "border-r border-white bg-[#2a78d6] font-medium text-white dark:border-neutral-950 dark:bg-[#3987e5]"
              : segment.kind === "held"
                ? "bg-gray-300 text-gray-700 dark:bg-neutral-700 dark:text-gray-200"
                : "border border-dashed border-gray-300 text-gray-400 dark:border-neutral-700 dark:text-gray-500"
          }`}
        >
          {segment.units >= 0.85 ? segment.label : ""}
        </motion.div>
      ))}
    </div>
  </div>
);

export const RoundTrip = () => {
  const [run, setRun] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <figure className="my-10" ref={ref}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-black dark:text-gray-200">
          A tool that has to stop and ask the user something
        </p>
        <button
          type="button"
          onClick={() => setRun((value) => value + 1)}
          className="rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-500 transition-colors hover:text-black dark:border-neutral-800 dark:text-gray-400 dark:hover:text-white"
        >
          Replay
        </button>
      </div>

      <div className="space-y-4 overflow-x-auto rounded-lg border border-gray-200 p-4 dark:border-neutral-800">
        <div className="min-w-[480px] space-y-4">
          <Lane
            title="2025-11-25 — elicitation/create"
            detail="1 instance pinned"
            segments={held}
            run={run}
            inView={inView}
            reduceMotion={reduceMotion}
          />
          <Lane
            title="2026-07-28 — multi round-trip"
            detail="0 instances pinned"
            segments={roundTrip}
            run={run}
            inView={inView}
            reduceMotion={reduceMotion}
          />

          <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-neutral-800 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-[#2a78d6] dark:bg-[#3987e5]" />
              a request or a response
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-gray-300 dark:bg-neutral-700" />
              a connection you are paying to keep open
            </span>
          </div>
        </div>
      </div>

      <Caption>
        The bottom lane is four ordinary request/response pairs. The state that
        used to live in the open stream is now a <Mono>requestState</Mono> blob
        the client hands back, so the follow-up can land on any instance — or on
        an instance that did not exist when the question was asked.
      </Caption>
    </figure>
  );
};
