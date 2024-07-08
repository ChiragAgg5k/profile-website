"use client";

import Image from "next/legacy/image";
import { motion } from "framer-motion";

export default function ResumeRotate({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`flex w-full items-center justify-center ${className}`}>
      <motion.div
        className="relative h-56 w-48 border border-foreground/30 bg-white/90"
        animate={{
          rotate: [0, 1, -1, 0],
          translateX: [0, 2, -2, 0],
          translateY: [0, -2, 2, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Image
          src="/resume.png"
          alt="Resume"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          quality={100}
        />
      </motion.div>
    </div>
  );
}
