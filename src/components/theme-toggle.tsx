"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const switchTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <button
      className={` rounded-full p-2`}
      onClick={() => {
        // @ts-ignore
        if (!document.startViewTransition) switchTheme();
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        document.startViewTransition(switchTheme);
      }}
    >
      <Sun
        className={`
          	hidden h-[20px] w-[20px] transition-transform duration-300 hover:rotate-180 dark:block
          `}
      />
      <Moon
        className={`block h-[20px] w-[20px] transition-transform
           duration-300 hover:rotate-180 dark:hidden
          `}
      />
    </button>
  );
}
