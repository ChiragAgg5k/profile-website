function CardFront() {
  return (
    <div className="absolute inset-0 z-20 flex h-full w-full items-center justify-center bg-background transition-all delay-200 duration-100 hover:opacity-0"></div>
  );
}

function CardBack({ backgroundText }: { backgroundText?: string }) {
  return (
    <div className="card-back absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-background transition-all">
      {backgroundText ?? "BACK OF CARD"}
    </div>
  );
}

export default function FlipCard({
  backgroundText,
}: {
  backgroundText?: string;
}) {
  return (
    <div className="card relative overflow-hidden rounded-xl border border-foreground/20 text-white transition-all duration-1000">
      <CardFront />
      <CardBack backgroundText={backgroundText} />
    </div>
  );
}
