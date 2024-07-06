"use client";

import React, { useEffect, useState } from "react";
import { VT323 } from "next/font/google";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const TypingAnimation = dynamic(
  () => import("@/components/magicui/typing-animation"),
  { ssr: false },
);
const GitHubCalendar = dynamic(() => import("react-github-calendar"), {
  ssr: false,
});

const MouseTracker = dynamic(() => import("@/components/mouse-tracker"), {
  ssr: false,
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
});

const Hero: React.FC = () => {
  const [showMouseTracker, setShowMouseTracker] = useState<boolean>(false);
  const { theme } = useTheme();
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
          <div>About Me</div>
        </MouseTracker>
      )}
      <div
        className={`rounded-xl border border-foreground/20`}
        onMouseEnter={() => setShowMouseTracker(true)}
        onMouseLeave={() => setShowMouseTracker(false)}
      >
        <div className={`p-8`}>
          <h1
            className={`mb-4 text-7xl
           text-foreground
           ${vt323.className}`}
          >
            Chirag
            <br />
            <div className={`mt-[-1rem]`}>Aggarwal</div>
          </h1>
          <TypingAnimation
            text={
              "> Hello there, I am a passionate computer science engineering student from India 🇮🇳"
            }
            duration={50}
          />
          <br />
          <TypingAnimation
            text={"> I like to learn new things and build stuff."}
            duration={50}
          />
        </div>
        <div className={`mx-8 mb-6 md:mb-0`}>
          {isClient && (
            <GitHubCalendar
              username="ChiragAgg5k"
              colorScheme={theme === "dark" ? "dark" : "light"}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Hero;
