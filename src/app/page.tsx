import FlipCard from "@/components/flip-card";
import Hero from "@/components/Hero";
import ResumeRotate from "@/components/resume-rotate";
import LaptopTile from "@/components/laptop-tile";

export default async function Home() {
  return (
    <div className={`flex flex-1 flex-col`}>
      <div className={`mb-1 grid grid-cols-1 gap-1 md:h-2/3 md:grid-cols-2`}>
        <Hero />
        <LaptopTile />
      </div>
      <div
        className={`grid h-[75vh] grid-cols-2 gap-1 md:h-1/3 md:grid-cols-4`}
      >
        <FlipCard back={`Projects`} />
        <FlipCard
          back={<ResumeRotate className={`opacity-70`} />}
          front={<ResumeRotate />}
          redirect={`/resume`}
          mouseText={`Resume 📄`}
        />
        <FlipCard back={`Skills`} />
        <FlipCard back={`Contact`} />
      </div>
    </div>
  );
}
