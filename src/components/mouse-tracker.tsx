"use client";

import React, { ReactNode, useEffect } from "react";
import { create } from "zustand";

interface MouseTrackerProps {
  offset: {
    x: number;
    y: number;
  };
}

interface Position {
  x: number;
  y: number;
}

interface CursorStore {
  content: ReactNode;
  show: boolean;
  setContent: (content: ReactNode) => void;
  setShow: (show: boolean) => void;
}

const useCursorStore = create<CursorStore>((set) => ({
  content: null,
  show: true,
  setContent: (content: ReactNode) => set({ content }),
  setShow: (show: boolean) => set({ show }),
}));

const MouseTracker: React.FC<MouseTrackerProps> = ({ offset }) => {
  const { content, show } = useCursorStore();
  const [position, setPosition] = React.useState<Position>({ x: 0, y: 0 });

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
      {content}
    </div>
  );
};

export { MouseTracker, useCursorStore };
