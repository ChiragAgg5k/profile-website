import FlipCard from "@/components/flip-card";
import Laptop from "@/components/Laptop";
import Hero from "@/components/Hero";
import Link from "next/link";
import { GoArrowDownRight } from "react-icons/go";
import ResumeRotate from "@/components/resume-rotate";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div className={`flex flex-1 flex-col`}>
      <div className={`mb-1 grid h-2/3 grid-cols-1 gap-1 md:grid-cols-2`}>
        <Hero />
        <div
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
      </div>
      <div className={`grid h-1/3 grid-cols-2 gap-1 md:grid-cols-4`}>
        <FlipCard back={`Projects`} />
        <FlipCard
          back={<ResumeRotate className={`opacity-70`} />}
          front={<ResumeRotate />}
          mouseText={`Experience`}
        />
        <FlipCard back={`Skills`} />
        <FlipCard back={`Contact`} />
      </div>
    </div>
  );
}
