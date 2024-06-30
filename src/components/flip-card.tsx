function CardFront() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex h-full w-full items-center justify-center bg-background transition-all delay-200 duration-100 hover:opacity-0"></div>
  );
}

function CardBack() {
  return (
    <div className="card-back absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-background transition-all"></div>
  );
}

export default function FlipCard() {
  return (
    <div className="card relative  overflow-hidden rounded-xl border border-foreground/50 text-white transition-all duration-1000">
      <CardFront />
      <CardBack />
    </div>
  );
}
