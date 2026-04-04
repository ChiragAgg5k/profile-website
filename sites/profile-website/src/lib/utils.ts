import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string) => {
  const dateObject = new Date(date);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - dateObject.getTime();

  const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);

  if (months > 12)
    return years === 1 ? `${years} year ago` : `${years} years ago`;
  if (months > 0)
    return months === 1 ? `${months} month ago` : `${months} months ago`;
  if (days > 0) return days === 1 ? `${days} day ago` : `${days} days ago`;
  if (hours > 0)
    return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
  if (minutes > 0)
    return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;

  return "few seconds ago";
};
