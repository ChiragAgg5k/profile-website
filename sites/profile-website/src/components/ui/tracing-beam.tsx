"use client";
import { cn } from "@/lib/utils";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const gradientId = React.useId().replace(/:/g, "");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight);
    }
  }, []);

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]),
    {
      stiffness: 500,
      damping: 90,
    },
  );
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]),
    {
      stiffness: 500,
      damping: 90,
    },
  );
  const boxShadow = useTransform(
    scrollYProgress,
    [0, 0.001],
    ["rgba(0, 0, 0, 0.24) 0px 3px 8px", "none"],
  );
  const indicatorBackgroundColor = useTransform(
    scrollYProgress,
    [0, 0.001],
    ["var(--emerald-500)", "white"],
  );
  const indicatorBorderColor = useTransform(
    scrollYProgress,
    [0, 0.001],
    ["var(--emerald-600)", "white"],
  );

  return (
    <div className={cn("relative w-full max-w-4xl mx-auto h-full", className)}>
      <motion.div ref={ref} className="relative h-full w-full">
        <div className="absolute -left-4 md:-left-20 top-3 hidden md:block">
          <motion.div
            transition={{
              duration: 0.2,
              delay: 0.5,
            }}
            style={{ boxShadow }}
            className="ml-[27px] h-4 w-4 rounded-full border border-neutral-200 shadow-sm flex items-center justify-center"
          >
            <motion.div
              transition={{
                duration: 0.2,
                delay: 0.5,
              }}
              style={{
                backgroundColor: indicatorBackgroundColor,
                borderColor: indicatorBorderColor,
              }}
              className="h-2 w-2  rounded-full border border-neutral-300 bg-white"
            />
          </motion.div>
          <svg
            viewBox={`0 0 20 ${svgHeight}`}
            width="20"
            height={svgHeight}
            className=" ml-4 block"
            aria-hidden="true"
          >
            <motion.path
              d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
              fill="none"
              stroke="#9091A0"
              strokeOpacity="0.16"
              transition={{
                duration: 10,
              }}
            ></motion.path>
            <motion.path
              d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="1.25"
              className="motion-reduce:hidden"
              transition={{
                duration: 10,
              }}
            ></motion.path>
            <defs>
              <motion.linearGradient
                id={gradientId}
                gradientUnits="userSpaceOnUse"
                x1="0"
                x2="0"
                y1={y1}
                y2={y2}
              >
                <stop stopColor="#18CCFC" stopOpacity="0"></stop>
                <stop stopColor="#18CCFC"></stop>
                <stop offset="0.325" stopColor="#6344F5"></stop>
                <stop offset="1" stopColor="#AE48FF" stopOpacity="0"></stop>
              </motion.linearGradient>
            </defs>
          </svg>
        </div>
        <div ref={contentRef}>{children}</div>
      </motion.div>
    </div>
  );
};
