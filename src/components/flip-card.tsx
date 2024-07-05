"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MouseTracker = dynamic(() => import("@/components/mouse-tracker"), {
  ssr: false,
});

function CardFront({ front }: { front?: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 flex h-full w-full items-center justify-center bg-background transition-all delay-200 duration-100 hover:opacity-0">
      {front}
    </div>
  );
}

function CardBack({ back }: { back?: React.ReactNode }) {
  return (
    <div className="card-back absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-background transition-all">
      {back}
    </div>
  );
}

export default function FlipCard({
  front = <div></div>,
  back = <div></div>,
  mouseText = "",
}: {
  front?: React.ReactNode;
  back?: React.ReactNode;
  mouseText?: string;
}) {
  const [showMouseTracker, setShowMouseTracker] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <MouseTracker
          offset={{
            x: 12,
            y: 12,
          }}
          show={showMouseTracker}
        >
          <div>{mouseText}</div>
        </MouseTracker>
      )}
      <div
        onMouseEnter={() => setShowMouseTracker(true)}
        onMouseLeave={() => setShowMouseTracker(false)}
        className={`min-h-54 w-full`}
      >
        <div className="card relative h-full w-full overflow-hidden rounded-xl border border-foreground/20 text-2xl text-white transition-all duration-1000">
          <CardFront front={front} />
          <CardBack back={back} />
        </div>
      </div>
    </>
  );
}
