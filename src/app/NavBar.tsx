"use client";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function NavBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  return (
    <nav className="mb-10 flex w-full items-center justify-between border-b-2 border-cyan-400 bg-cyan-100 p-8 dark:border-0 dark:bg-gray-800 md:absolute">
      <a
        href="https://chiragagg5k.vercel.app/"
        className="group text-lg text-gray-700 transition duration-300 dark:text-white sm:text-xl"
      >
        ChiragAgg5k
        <span className="block h-0.5 max-w-0 bg-gray-700 transition-all duration-500 group-hover:max-w-full dark:bg-white"></span>
      </a>
      <ul className="flex items-center">
        {
          // Only show dark mode toggle if mounted and can be toggled
          mounted && (
            <li>
              {theme === "dark" ? (
                <BsFillMoonStarsFill
                  title="Toggle Light Mode"
                  className="cursor-pointer text-xl  hover:text-cyan-600 dark:hover:text-cyan-500 sm:text-2xl"
                  onClick={() => setTheme("light")}
                />
              ) : (
                <BsFillSunFill
                  title="Toggle Dark Mode"
                  className="cursor-pointer text-xl text-gray-700  hover:text-cyan-600 dark:hover:text-cyan-500 sm:text-2xl"
                  onClick={() => setTheme("dark")}
                />
              )}
            </li>
          )
        }

        <li>
          <div className="ml-5 rounded bg-cyan-700 px-5 py-2  text-sm text-white sm:text-base">
            <a
              href="https://chirag-aggarwal-resume.tiiny.site/"
              className="group text-white transition duration-300"
              rel="noreferrer"
              target="_blank"
            >
              Resume
              <span className="block h-0.5 max-w-0 bg-white transition-all duration-500 group-hover:max-w-full"></span>
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
}
