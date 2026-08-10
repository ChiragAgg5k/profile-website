"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Caption, Mono } from "@/components/mermaid-diagram";
import { Segmented } from "@/components/ui/segmented";

const TICK_MS = 900;
const REPLICAS = 3;

const modes = [
  { value: "session", label: "2025-11-25" },
  { value: "stateless", label: "2026-07-28" },
] as const;

type Mode = (typeof modes)[number]["value"];

// Client → balancer → replica, as one polyline the request dot travels along.
// The last leg is the only part that depends on which replica answers.
const CLIENT_EXIT = 112;
const BALANCER_ENTRY = 156;
const BALANCER_EXIT = 274;
const REPLICA_ENTRY = 336;
const LANE_Y = 96;
const REPLICA_Y = [39, 96, 153] as const;

const Box = ({
  x,
  y,
  width,
  title,
  subtitle,
  active = true,
}: {
  x: number;
  y: number;
  width: number;
  title: string;
  subtitle?: string;
  active?: boolean;
}) => (
  <motion.g initial={false} animate={{ opacity: active ? 1 : 0.4 }}>
    <rect
      x={x}
      y={y}
      width={width}
      height={40}
      rx={6}
      className="fill-gray-100 stroke-gray-300 dark:fill-neutral-800 dark:stroke-neutral-700"
      strokeWidth={1}
    />
    <text
      x={x + width / 2}
      y={y + (subtitle ? 18 : 24)}
      textAnchor="middle"
      className="fill-black text-[11px] font-medium dark:fill-white"
    >
      {title}
    </text>
    {subtitle ? (
      <text
        x={x + width / 2}
        y={y + 31}
        textAnchor="middle"
        className="fill-gray-500 text-[9px] dark:fill-gray-400"
      >
        {subtitle}
      </text>
    ) : null}
  </motion.g>
);

export const SessionAffinity = () => {
  const [mode, setMode] = useState<Mode>("session");
  const [requests, setRequests] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    setRequests(0);
  }, [mode]);

  useEffect(() => {
    if (!inView) {
      return;
    }

    const timer = setInterval(() => {
      setRequests((count) => (count >= 12 ? 0 : count + 1));
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [inView, mode]);

  const pinned = mode === "session";
  // Sticky routing sends every request from this client to the replica that
  // holds its session. Without a session, the balancer is free to round-robin.
  const target = pinned ? 0 : requests % REPLICAS;
  const served = Array.from({ length: REPLICAS }, (_, index) =>
    pinned
      ? index === 0
        ? requests
        : 0
      : Math.floor(requests / REPLICAS) + (requests % REPLICAS > index ? 1 : 0),
  );

  return (
    <figure className="my-10" ref={ref}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-black dark:text-gray-200">
          One client, three replicas, twelve requests
        </p>
        <Segmented
          label="Protocol revision"
          options={modes}
          value={mode}
          onChange={setMode}
        />
      </div>

      <div className="rounded-lg border border-gray-200 p-4 dark:border-neutral-800">
        {/* Below ~460px the replica labels collide, so scroll instead of shrink. */}
        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 480 200"
            className="w-full min-w-[460px]"
            role="img"
            aria-label={
              pinned
                ? "Every request from the client carries a session id, so the load balancer must send all twelve to the one replica holding that session. The other two replicas stay idle."
                : "No request carries a session id, so the load balancer spreads the twelve requests evenly across all three replicas."
            }
          >
            <defs>
              <marker
                id="affinity-arrow"
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

            <path
              d={`M ${CLIENT_EXIT} ${LANE_Y} L ${BALANCER_ENTRY - 4} ${LANE_Y}`}
              fill="none"
              strokeWidth={1.5}
              markerEnd="url(#affinity-arrow)"
              className="stroke-gray-400 dark:stroke-neutral-500"
            />

            {REPLICA_Y.map((y, index) => {
              const live = !pinned || index === 0;

              return (
                <path
                  key={y}
                  d={`M ${BALANCER_EXIT} ${LANE_Y} L ${REPLICA_ENTRY - 4} ${y}`}
                  fill="none"
                  strokeWidth={1.5}
                  markerEnd="url(#affinity-arrow)"
                  className="stroke-gray-400 dark:stroke-neutral-500"
                  opacity={live ? 1 : 0.2}
                  strokeDasharray={live ? undefined : "4 4"}
                />
              );
            })}

            <Box
              x={8}
              y={LANE_Y - 20}
              width={104}
              title="MCP client"
              subtitle={pinned ? "Mcp-Session-Id" : "bearer token only"}
            />
            <Box
              x={156}
              y={LANE_Y - 20}
              width={118}
              title="load balancer"
              subtitle={pinned ? "sticky routing" : "round robin"}
            />

            {REPLICA_Y.map((y, index) => (
              <Box
                key={y}
                x={336}
                y={y - 20}
                width={136}
                title={`replica ${index + 1}`}
                subtitle={
                  pinned
                    ? index === 0
                      ? "holds the session"
                      : "cannot answer"
                    : "can answer anything"
                }
                active={!pinned || index === 0}
              />
            ))}

            {requests > 0 && !reduceMotion ? (
              <motion.circle
                key={`${mode}-${requests}`}
                r={5}
                className="fill-[#2a78d6] dark:fill-[#3987e5]"
                initial={{ cx: CLIENT_EXIT, cy: LANE_Y, opacity: 0 }}
                animate={{
                  cx: [
                    CLIENT_EXIT,
                    BALANCER_ENTRY,
                    BALANCER_EXIT,
                    REPLICA_ENTRY,
                  ],
                  cy: [LANE_Y, LANE_Y, LANE_Y, REPLICA_Y[target]],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{ duration: 0.8, times: [0, 0.3, 0.55, 1] }}
              />
            ) : null}
          </svg>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-3 border-t border-gray-200 pt-3 text-xs sm:grid-cols-4 dark:border-neutral-800">
          <div>
            <span className="text-gray-500 dark:text-gray-400">requests</span>
            <div className="font-mono text-sm text-black dark:text-white">
              {requests}
            </div>
          </div>
          {served.map((count, index) => (
            <div key={index}>
              <span className="text-gray-500 dark:text-gray-400">
                replica {index + 1}
              </span>
              <div
                className={`font-mono text-sm ${
                  count === 0
                    ? "text-gray-400 dark:text-gray-600"
                    : "text-[#2a78d6] dark:text-[#3987e5]"
                }`}
              >
                {count}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {pinned ? (
            <>
              Restart replica 1 and the session is gone: the client has to re-
              <Mono>initialize</Mono> before it can send anything else.
            </>
          ) : (
            <>
              Restart any replica mid-conversation and nothing notices. There is
              no state to lose.
            </>
          )}
        </p>
      </div>

      <Caption>
        The alternative to sticky routing was always a shared session store,
        which is the same problem with a Redis bill attached. Removing the
        session removes the choice.
      </Caption>
    </figure>
  );
};
