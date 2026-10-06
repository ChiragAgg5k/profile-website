"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Caption } from "@/components/mermaid-diagram";

type BlogFigureProps = {
  src: string;
  alt: string;
  caption?: string;
  /** Renders on a bordered card. Use for UI screenshots. */
  framed?: boolean;
  /** Caps the rendered width in pixels and centers the figure. */
  width?: number;
};

export const BlogFigure = ({
  src,
  alt,
  caption,
  framed = true,
  width,
}: BlogFigureProps) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <figure
      className="my-10 mx-auto"
      style={width ? { maxWidth: width } : undefined}
      ref={ref}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={
          framed
            ? "overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-800"
            : ""
        }
      >
        <img src={src} alt={alt} loading="lazy" className="w-full" />
      </motion.div>
      {caption ? <Caption>{caption}</Caption> : null}
    </figure>
  );
};
