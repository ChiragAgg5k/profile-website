"use client";

import { useCursorStore } from "@/components/mouse-tracker";
import Link from "next/link";
import { motion } from "framer-motion";
import React, { useState } from "react";

function CardFront({
  front,
  isFlipped,
}: {
  front?: React.ReactNode;
  isFlipped: boolean;
}) {
  return (
    <motion.div
      className="absolute inset-0 z-20 flex h-full w-full items-center justify-center bg-background"
      initial={{
        opacity: 1,
        rotateY: 0,
      }}
      animate={{
        opacity: isFlipped ? 0 : 1,
        rotateY: isFlipped ? 180 : 0,
      }}
      transition={{ duration: 0.6 }}
      style={{ backfaceVisibility: "hidden" }}
    >
      {front}
    </motion.div>
  );
}

function CardBack({
  back,
  isFlipped,
}: {
  back?: React.ReactNode;
  isFlipped: boolean;
}) {
  return (
    <motion.div
      className="card-back absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-background"
      initial={{
        opacity: 0,
        rotateY: -180,
      }}
      animate={{
        opacity: isFlipped ? 1 : 0,
        rotateY: isFlipped ? 0 : -180,
      }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ rotateY: 180 }}
        animate={{ rotateY: 180 }}
        transition={{ duration: 0 }}
      >
        {back}
      </motion.div>
    </motion.div>
  );
}

export default function FlipCard({
  front = <div></div>,
  back = <div></div>,
  mouseText = "",
  redirect = "",
}: {
  front?: React.ReactNode;
  back?: React.ReactNode;
  mouseText?: string;
  redirect?: string;
}) {
  const { setContent } = useCursorStore();
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Link
      onMouseEnter={() => {
        setContent(mouseText);
        setIsFlipped(true);
      }}
      onMouseLeave={() => {
        setContent(null);
        setIsFlipped(false);
      }}
      className={`w-full`}
      href={redirect}
    >
      <motion.div
        className="card relative h-full w-full overflow-hidden rounded-xl border border-foreground/20 text-2xl text-white"
        initial={{ rotateY: 0 }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <CardFront front={front} isFlipped={isFlipped} />
        <CardBack back={back} isFlipped={isFlipped} />
      </motion.div>
    </Link>
  );
}
