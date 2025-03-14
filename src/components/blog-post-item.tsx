"use client";

import { ArrowRightIcon, ArrowUpIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BlurFade from "./magicui/blur-fade";

interface BlogPostItemProps {
  title: string;
  slug: string;
  publishedAt: string;
  delay: number;
}

const timeToHowLongAgo = (date: string) => {
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

export default function BlogPostItem({
  title,
  slug,
  publishedAt,
  delay,
}: BlogPostItemProps) {
  const [upvotes, setUpvotes] = useState(0);

  const handleUpvote = () => {
    setUpvotes((prev) => prev + 1);
    // Add API call here to persist upvotes
  };

  return (
    <BlurFade delay={delay}>
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <Link href={`/blog/${slug}`}>
            <div className="group">
              <div className="flex items-center justify-start gap-4">
                <h1>{title}</h1>
                <ArrowRightIcon className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out" />
              </div>
            </div>
          </Link>
          <button
            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm hover:bg-muted transition-colors"
            onClick={handleUpvote}
          >
            <ArrowUpIcon className="w-3 h-3 text-muted-foreground" />
            {upvotes > 0 && (
              <span className="text-muted-foreground">{upvotes}</span>
            )}
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          {timeToHowLongAgo(publishedAt)}
        </p>
      </div>
    </BlurFade>
  );
}
