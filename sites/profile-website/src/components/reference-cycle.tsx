"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Caption, Mono } from "@/components/mermaid-diagram";
import { Segmented } from "@/components/ui/segmented";

// Measured in utopia-php/fetch#22: a bound closure keeps the handle alive, and
// every request from a fresh client strands 2 fds and ~1MB of native TLS
// buffers until the cycle collector happens to run.
const FDS_PER_REQUEST = 2;
const MB_PER_REQUEST = 1.2;
const BASELINE_FDS = 9;
const MAX_REQUESTS = 14;
const TICK_MS = 700;

const modes = [
  { value: "bound", label: "function () { … }" },
  { value: "static", label: "static function () { … }" },
] as const;

type Mode = (typeof modes)[number]["value"];

// adapter → handle → callback → adapter. The third edge is the one `static`
// removes, and with it the cycle.
const EDGES = [
  { d: "M 190 47 L 296 47", closesCycle: false },
  { d: "M 375 70 L 344 105", closesCycle: false },
  { d: "M 225 130 L 154 74", closesCycle: true },
] as const;

const Node = ({
  x,
  y,
  title,
  subtitle,
  dimmed = false,
}: {
  x: number;
  y: number;
  title: string;
  subtitle?: string;
  dimmed?: boolean;
}) => (
  <motion.g
    // initial={false} starts at the target instead of animating in on mount,
    // which also gives opacity a defined value to animate from on toggle.
    initial={false}
    animate={{ opacity: dimmed ? 0.35 : 1 }}
    transition={{ duration: 0.35 }}
  >
    <rect
      x={x}
      y={y}
      width={150}
      height={subtitle ? 46 : 34}
      rx={6}
      className="fill-gray-100 stroke-gray-300 dark:fill-neutral-800 dark:stroke-neutral-700"
      strokeWidth={1}
    />
    <text
      x={x + 75}
      y={y + (subtitle ? 20 : 22)}
      textAnchor="middle"
      className="fill-black text-[11px] font-medium dark:fill-white"
    >
      {title}
    </text>
    {subtitle ? (
      <text
        x={x + 75}
        y={y + 35}
        textAnchor="middle"
        className="fill-gray-500 text-[10px] dark:fill-gray-400"
      >
        {subtitle}
      </text>
    ) : null}
  </motion.g>
);

export const ReferenceCycle = () => {
  const [mode, setMode] = useState<Mode>("bound");
  const [requests, setRequests] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setRequests(0);
  }, [mode]);

  useEffect(() => {
    if (!inView) {
      return;
    }

    const timer = setInterval(() => {
      setRequests((count) => (count >= MAX_REQUESTS ? 0 : count + 1));
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [inView, mode]);

  const leaking = mode === "bound";
  const fds = leaking
    ? BASELINE_FDS + requests * FDS_PER_REQUEST
    : BASELINE_FDS;
  const native = leaking ? (requests * MB_PER_REQUEST).toFixed(1) : "0.0";

  return (
    <figure className="my-10" ref={ref}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-black dark:text-gray-200">
          Who is holding the cURL handle?
        </p>
        <Segmented
          label="Closure binding"
          options={modes}
          value={mode}
          onChange={setMode}
        />
      </div>

      <div className="rounded-lg border border-gray-200 p-4 dark:border-neutral-800">
        {/* Below ~440px the labels stop being readable, so scroll instead of shrink. */}
        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 480 190"
            className="w-full min-w-[440px]"
            role="img"
            aria-label={
              leaking
                ? "The adapter holds the cURL handle, the handle holds the write callback, and the callback holds the adapter back — a closed cycle that keeps the handle alive."
                : "The adapter holds the cURL handle and the handle holds the write callback, but a static callback holds nothing back, so the chain has an end and the handle is freed."
            }
          >
            {EDGES.map((edge) => {
              const severed = edge.closesCycle && !leaking;

              return (
                <g key={edge.d}>
                  <path
                    d={edge.d}
                    fill="none"
                    strokeWidth={1.5}
                    markerEnd="url(#cycle-arrow)"
                    className="stroke-gray-400 dark:stroke-neutral-500"
                    opacity={severed ? 0.2 : 1}
                    strokeDasharray={severed ? "4 4" : undefined}
                  />
                  {leaking && !reduceMotion ? (
                    <motion.path
                      d={edge.d}
                      fill="none"
                      strokeWidth={4}
                      strokeLinecap="round"
                      className="stroke-[#2a78d6] dark:stroke-[#3987e5]"
                      strokeDasharray="9 27"
                      animate={{ strokeDashoffset: [0, -36] }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      opacity={0.6}
                    />
                  ) : null}
                </g>
              );
            })}

            <defs>
              <marker
                id="cycle-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path
                  d="M 0 0 L 10 5 L 0 10 z"
                  className="fill-gray-400 dark:fill-neutral-500"
                />
              </marker>
            </defs>

            <Node x={40} y={24} title="Client adapter" subtitle="$this" />
            <Node
              x={300}
              y={24}
              title="CurlHandle"
              subtitle="socket + TLS buffers"
              dimmed={!leaking}
            />
            <Node x={225} y={113} title="write callback" />

            <text
              x={243}
              y={40}
              textAnchor="middle"
              className="fill-gray-500 text-[10px] dark:fill-gray-400"
            >
              holds
            </text>
            <text
              x={384}
              y={94}
              className="fill-gray-500 text-[10px] dark:fill-gray-400"
            >
              curl_setopt stores
            </text>
            <motion.text
              x={110}
              y={112}
              className="text-[10px]"
              initial={false}
              animate={{ opacity: leaking ? 1 : 0.35 }}
            >
              <tspan
                className={
                  leaking
                    ? "fill-[#2a78d6] dark:fill-[#3987e5]"
                    : "fill-gray-500 dark:fill-gray-400"
                }
              >
                {leaking ? "binds $this" : "binds nothing"}
              </tspan>
            </motion.text>
          </svg>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-3 border-t border-gray-200 pt-3 text-xs dark:border-neutral-800">
          <div>
            <span className="text-gray-500 dark:text-gray-400">requests</span>
            <div className="font-mono text-sm text-black dark:text-white">
              {requests}
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              open file descriptors
            </span>
            <div
              className={`font-mono text-sm ${leaking ? "text-[#2a78d6] dark:text-[#3987e5]" : "text-black dark:text-white"}`}
            >
              {fds}
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              native memory
            </span>
            <div
              className={`font-mono text-sm ${leaking ? "text-[#2a78d6] dark:text-[#3987e5]" : "text-black dark:text-white"}`}
            >
              {native} MB
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          PHP heap: 6.0 MB, flat, in both modes. <Mono>memory_limit</Mono> only
          governs that heap, never the native memory underneath it.
        </p>
      </div>

      <Caption>
        A closure declared inside an instance method captures <Mono>$this</Mono>
        . <Mono>curl_setopt</Mono> stores it on the handle the adapter itself
        holds, so the three of them keep each other alive until PHP&apos;s cycle
        collector fires — by default after 10,000 roots pile up.
      </Caption>
    </figure>
  );
};
