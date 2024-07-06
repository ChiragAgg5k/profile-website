"use client";

import React, { ReactNode, useEffect, useState } from "react";

interface MouseTrackerProps {
  children: ReactNode;
  offset: {
    x: number;
    y: number;
  };
  show: boolean;
}

interface Position {
  x: number;
  y: number;
}

const MouseTracker: React.FC<MouseTrackerProps> = ({
  children,
  offset,
  show,
}) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX + offset.x, y: e.clientY + offset.y });
    };

    if (show) {
      window.addEventListener("mousemove", updatePosition);
    }

    return () => {
      window.removeEventListener("mousemove", updatePosition);
    };
  }, [show, offset]);

  if (!show) return null;

  return (
    <div
      className={`rounded-full border bg-background px-4 py-2`}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {children}
    </div>
  );
};

export default MouseTracker;
