import { cn } from "@/lib/utils";

type ArrowDirection =
  | "down-right"
  | "down-left"
  | "up-right"
  | "up-left"
  | "right"
  | "left";

const ARROW_TRANSFORM: Record<ArrowDirection, string> = {
  "down-right": "",
  "down-left": "-scale-x-100",
  "up-right": "-scale-y-100",
  "up-left": "-scale-x-100 -scale-y-100",
  right: "-rotate-45",
  left: "rotate-[135deg]",
};

function Arrow({
  direction,
  className,
}: {
  direction: ArrowDirection;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-12", ARROW_TRANSFORM[direction], className)}
    >
      <path d="M5 7c14 2 27 11 35 25 2 4 4 9 5 15" />
      <path d="M45 47c-4-2-8-3-12-3" />
      <path d="M45 47c1-4 1-8 0-12" />
    </svg>
  );
}

export interface HandwrittenNoteProps {
  children: React.ReactNode;
  direction?: ArrowDirection;
  /** Stack the arrow before or after the text. */
  arrowPlacement?: "start" | "end";
  /** Lay the arrow beside the text instead of above/below it. */
  orientation?: "vertical" | "horizontal";
  className?: string;
  arrowClassName?: string;
  textClassName?: string;
}

export function HandwrittenNote({
  children,
  direction = "down-right",
  arrowPlacement = "end",
  orientation = "vertical",
  className,
  arrowClassName,
  textClassName,
}: HandwrittenNoteProps) {
  const arrow = <Arrow direction={direction} className={arrowClassName} />;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none flex text-muted-foreground/70",
        orientation === "vertical"
          ? "flex-col items-start gap-1"
          : "flex-row items-center gap-2",
        className,
      )}
    >
      {arrowPlacement === "start" ? arrow : null}
      <span
        className={cn(
          "font-handwriting text-xl leading-tight tracking-wide",
          textClassName,
        )}
      >
        {children}
      </span>
      {arrowPlacement === "end" ? arrow : null}
    </div>
  );
}

export default HandwrittenNote;
