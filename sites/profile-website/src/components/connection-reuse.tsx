"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { Caption } from "@/components/mermaid-diagram";

const REQUESTS = 6;

// Schematic cost units, not milliseconds: a handshake is the expensive part and
// the request itself is cheap. Real numbers depend entirely on the RTT.
const HANDSHAKE = [
  { label: "DNS", units: 1 },
  { label: "TCP", units: 1.5 },
  { label: "TLS", units: 2.5 },
] as const;
const REQUEST_UNITS = 1;

type Segment = {
  key: string;
  label: string;
  start: number;
  units: number;
  handshake: boolean;
};

const lane = (reuse: boolean): Segment[] => {
  const segments: Segment[] = [];
  let cursor = 0;

  for (let index = 0; index < REQUESTS; index++) {
    if (!reuse || index === 0) {
      for (const part of HANDSHAKE) {
        segments.push({
          key: `${index}-${part.label}`,
          label: part.label,
          start: cursor,
          units: part.units,
          handshake: true,
        });
        cursor += part.units;
      }
    }

    segments.push({
      key: `${index}-req`,
      label: `#${index + 1}`,
      start: cursor,
      units: REQUEST_UNITS,
      handshake: false,
    });
    cursor += REQUEST_UNITS;
  }

  return segments;
};

const fresh = lane(false);
const reused = lane(true);
const total = (segments: Segment[]) =>
  segments[segments.length - 1].start + segments[segments.length - 1].units;
const scale = total(fresh);

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
    <div className="relative h-7 w-full rounded bg-gray-100 dark:bg-neutral-900">
      {segments.map((segment) => (
        <motion.div
          key={`${run}-${segment.key}`}
          // initial is only read at mount, and at mount the figure is usually
          // still below the fold. Keep the hidden state unconditional and let
          // inView drive the target, or it snaps to full and never plays.
          initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
          animate={
            reduceMotion || inView
              ? { scaleX: 1, opacity: 1 }
              : { scaleX: 0, opacity: 0 }
          }
          transition={{
            duration: (segment.units / scale) * 3.4,
            delay: (segment.start / scale) * 3.4,
            ease: "linear",
          }}
          style={{
            left: `${(segment.start / scale) * 100}%`,
            width: `${(segment.units / scale) * 100}%`,
            originX: 0,
          }}
          className={`absolute inset-y-0 flex items-center justify-center overflow-hidden rounded-[2px] border-r border-white text-[9px] dark:border-neutral-950 ${
            segment.handshake
              ? "bg-gray-300 text-gray-700 dark:bg-neutral-700 dark:text-gray-200"
              : "bg-[#2a78d6] font-medium text-white dark:bg-[#3987e5]"
          }`}
        >
          {segment.units >= 1 ? segment.label : ""}
        </motion.div>
      ))}
    </div>
  </div>
);

export const ConnectionReuse = () => {
  const [run, setRun] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion() ?? false;

  const saved = Math.round((1 - total(reused) / total(fresh)) * 100);

  return (
    <figure className="my-10" ref={ref}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-black dark:text-gray-200">
          Six calls to the same origin
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
        <div className="min-w-[460px] space-y-4">
          <Lane
            title="new Client() per call"
            detail={`${REQUESTS} handshakes`}
            segments={fresh}
            run={run}
            inView={inView}
            reduceMotion={reduceMotion}
          />
          <Lane
            title="->withConnectionReuse()"
            detail="1 handshake"
            segments={reused}
            run={run}
            inView={inView}
            reduceMotion={reduceMotion}
          />

          <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-neutral-800 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-gray-300 dark:bg-neutral-700" />
              connection setup
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-[#2a78d6] dark:bg-[#3987e5]" />
              the actual request
            </span>
            <span className="ml-auto text-black dark:text-white">
              {saved}% less wall clock
            </span>
          </div>
        </div>
      </div>

      <Caption>
        Handshake cost is schematic — the point is the ratio. Reuse is per
        origin: a request to a different host transparently dials a new
        connection.
      </Caption>
    </figure>
  );
};
