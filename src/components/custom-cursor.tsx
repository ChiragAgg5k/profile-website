"use client";

import React, { useState, useEffect } from "react";

function CustomCursor() {
  const [position, setPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent,
  ) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed left-0 top-0 hidden h-[30px] w-[30px] rounded-full border border-foreground sm:block`}
      style={{
        transform: `translate(${position.x - 14}px, ${position.y - 14}px)`,
      }}
    />
  );
}

export default CustomCursor;
