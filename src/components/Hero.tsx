"use client";

import TypingAnimation from "@/components/magicui/typing-animation";
import { VT323 } from "next/font/google";
import GitHubCalendar from "react-github-calendar";
import MouseTracker from "@/components/mouse-tracker";
import { useState } from "react";
import { useTheme } from "next-themes";

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Hero() {
  const [showMouseTracker, setShowMouseTracker] = useState<boolean>(false);
  const { theme } = useTheme();

  return (
    <>
      <MouseTracker
        offset={{
          x: 12,
          y: 12,
        }}
        show={showMouseTracker}
      >
        <p>About Me</p>
      </MouseTracker>
      <div
        className={`rounded-xl border border-foreground/20`}
        onMouseEnter={() => {
          setShowMouseTracker(true);
        }}
        onMouseLeave={() => {
          setShowMouseTracker(false);
        }}
      >
        <div className={`p-8`}>
          <h1 className={`mb-4 text-7xl text-foreground ${vt323.className}`}>
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
          <GitHubCalendar
            username="ChiragAgg5k"
            colorScheme={theme === "dark" ? "dark" : "light"}
          />
        </div>
      </div>
    </>
  );
}
