import FlipCard from "@/components/flip-card";
import Laptop from "@/components/Laptop";

export default async function Home() {
  return (
    <div className={`flex flex-1 flex-col`}>
      <div className={`mb-1 grid h-2/3 grid-cols-1 gap-1 md:grid-cols-2`}>
        <div className={`rounded-xl border border-foreground/20`}></div>
        <div className={`rounded-xl border border-foreground/20`}>
          <Laptop />
        </div>
      </div>
      <div className={`grid h-1/3 grid-cols-2 gap-1 md:grid-cols-4`}>
        <FlipCard />
        <FlipCard />
        <FlipCard />
        <FlipCard />
      </div>
    </div>
  );
}
