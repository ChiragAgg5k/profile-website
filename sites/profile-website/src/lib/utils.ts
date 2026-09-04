import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const displayDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

// Keep dates deterministic between the prerendered HTML and browser hydration.
// Relative labels drift after deployment and cause React hydration mismatches.
export const formatDate = (date: string) =>
  displayDate.format(new Date(`${date}T00:00:00Z`));
