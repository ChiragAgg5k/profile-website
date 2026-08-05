"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { Caption, Mono } from "@/components/mermaid-diagram";

const CLIENTS = 14;
const BASE_DELAY = 0.5;
const MULTIPLIER = 2;
const RETRIES = 3;
const WINDOW = 4.0;
const BUCKET = 0.1;

// Seeded so the server and the browser draw the same figure.
const random = (() => {
  let seed = 20260804;

  return (): number => {
    seed = (seed * 1103515245 + 12345) % 2147483648;

    return seed / 2147483648;
  };
})();

const ceiling = (attempt: number) => BASE_DELAY * MULTIPLIER ** attempt;

type Attempt = { client: number; attempt: number; at: number };

const schedule = (jitter: boolean): Attempt[] => {
  const attempts: Attempt[] = [];

  for (let client = 0; client < CLIENTS; client++) {
    let elapsed = 0;

    for (let attempt = 0; attempt < RETRIES; attempt++) {
      const window = ceiling(attempt);
      elapsed += jitter ? random() * window : window;
      attempts.push({ client, attempt, at: elapsed });
    }
  }

  return attempts;
};

const fixed = schedule(false);
const jittered = schedule(true);

const peak = (attempts: Attempt[]) => {
  const buckets = new Map<number, number>();

  for (const attempt of attempts) {
    const bucket = Math.floor(attempt.at / BUCKET);
    buckets.set(bucket, (buckets.get(bucket) ?? 0) + 1);
  }

  return Math.max(...buckets.values());
};

const WIDTH = 480;
const ROW = 8;
const TOP = 8;
const HEIGHT = TOP + CLIENTS * ROW + 22;

const Panel = ({
  title,
  attempts,
  run,
  inView,
  reduceMotion,
  emphasis,
}: {
  title: string;
  attempts: Attempt[];
  run: number;
  inView: boolean;
  reduceMotion: boolean;
  emphasis: boolean;
}) => (
  <div>
    <div className="mb-1 flex items-baseline justify-between gap-3">
      <span className="text-xs text-black dark:text-gray-200">{title}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        busiest {BUCKET * 1000}ms: {peak(attempts)} retries
      </span>
    </div>
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full"
      role="img"
      aria-label={`${title}: at most ${peak(attempts)} of the ${CLIENTS * RETRIES} retries land inside the same ${BUCKET * 1000} millisecond window.`}
    >
      {[0, 1, 2, 3, 4].map((second) => (
        <g key={second}>
          <line
            x1={(second / WINDOW) * WIDTH}
            y1={TOP - 4}
            x2={(second / WINDOW) * WIDTH}
            y2={TOP + CLIENTS * ROW}
            strokeWidth={1}
            className="stroke-gray-200 dark:stroke-neutral-800"
          />
          <text
            x={(second / WINDOW) * WIDTH + 3}
            y={HEIGHT - 6}
            className="fill-gray-500 text-[9px] dark:fill-gray-400"
          >
            {second}s
          </text>
        </g>
      ))}

      {attempts.map((attempt) => (
        <motion.rect
          key={`${run}-${attempt.client}-${attempt.attempt}`}
          x={(attempt.at / WINDOW) * WIDTH}
          y={TOP + attempt.client * ROW}
          width={3}
          height={ROW - 2.5}
          rx={1}
          className={
            emphasis
              ? "fill-[#2a78d6] dark:fill-[#3987e5]"
              : "fill-gray-400 dark:fill-neutral-500"
          }
          // Hidden unconditionally: initial is read at mount, long before the
          // figure scrolls into view, so inView has to drive the target.
          initial={reduceMotion ? false : { opacity: 0, scaleY: 0 }}
          animate={
            reduceMotion || inView
              ? { opacity: 1, scaleY: 1 }
              : { opacity: 0, scaleY: 0 }
          }
          transition={{ duration: 0.18, delay: (attempt.at / WINDOW) * 3.2 }}
          style={{ originY: 1 }}
        />
      ))}
    </svg>
  </div>
);

export const BackoffJitter = () => {
  const [run, setRun] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <figure className="my-10" ref={ref}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-black dark:text-gray-200">
          {CLIENTS} workers take a <Mono>503</Mono> at the same instant
        </p>
        <button
          type="button"
          onClick={() => setRun((value) => value + 1)}
          className="rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-500 transition-colors hover:text-black dark:border-neutral-800 dark:text-gray-400 dark:hover:text-white"
        >
          Replay
        </button>
      </div>

      <div className="space-y-5 overflow-x-auto rounded-lg border border-gray-200 p-4 dark:border-neutral-800">
        <div className="min-w-[420px] space-y-5">
          <Panel
            title="Exponential backoff, no jitter"
            attempts={fixed}
            run={run}
            inView={inView}
            reduceMotion={reduceMotion}
            emphasis={false}
          />
          <Panel
            title="Exponential backoff, full jitter"
            attempts={jittered}
            run={run}
            inView={inView}
            reduceMotion={reduceMotion}
            emphasis
          />
        </div>
      </div>

      <Caption>
        Each row is one worker, each mark one retry. Backing off without jitter
        keeps the fleet in lockstep, so an upstream that is already struggling
        gets the whole herd back at once.
      </Caption>
    </figure>
  );
};
