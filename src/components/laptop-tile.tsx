"use client";

import Laptop from "@/components/Laptop";
import Link from "next/link";
import { GoArrowDownRight } from "react-icons/go";
import { useCursorStore } from "@/components/mouse-tracker";

export default function LaptopTile() {
  const { setContent } = useCursorStore();

  return (
    <div
      onMouseEnter={() => setContent("Projects 💻")}
      onMouseLeave={() => setContent(null)}
      className={`relative min-h-96 rounded-xl border border-foreground/20`}
    >
      <Laptop />
      <Link href={`/projects`}>
        <div
          className={`absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full border border-foreground/60 text-xl transition-all duration-300 ease-in-out hover:scale-110 hover:bg-foreground hover:text-background`}
        >
          <GoArrowDownRight />
        </div>
      </Link>
    </div>
  );
}
