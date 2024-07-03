"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const MouseTracker = ({
  children,
  offset = { x: 0, y: 0 },
  show = true,
}: {
  children: React.ReactNode;
  offset?: { x: number; y: number };
  show?: boolean;
}) => {
  const element = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handler(
      e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) {
      if (element.current) {
        const x = e.clientX + offset.x,
          y = e.clientY + offset.y;
        element.current.style.transform = `translate(${x}px, ${y}px)`;
        element.current.style.visibility = "visible";
      }
    }
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, [offset.x, offset.y]);

  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={`pointer-events-none invisible fixed z-50 rounded-full border bg-background px-4 py-2 ${show ? "block" : "hidden"}`}
      ref={element}
    >
      {children}
    </div>,
    document.body,
  );
};

export default MouseTracker;
