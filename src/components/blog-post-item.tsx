"use client";

import { formatDate, upvoteBlog } from "@/lib/utils";
import { ArrowRightIcon, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import BlurFade from "./magicui/blur-fade";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface BlogPostItemProps {
  title: string;
  href?: string;
  slug?: string;
  publishedAt: string;
  delay: number;
  votes: number;
}

export default function BlogPostItem({
  title,
  href,
  slug,
  publishedAt,
  delay,
  votes,
}: BlogPostItemProps) {
  const [upvotes, setUpvotes] = useState(votes);

  const handleUpvote = async () => {
    setUpvotes((prev) => prev + 1);
    const success = await upvoteBlog(slug || "");
    if (!success) {
      toast.error("Failed to upvote blog", {
        description: "Seems like you have already upvoted this one!",
      });
      setUpvotes((prev) => prev - 1);
    } else {
      toast.success("Upvoted blog", {
        description: "You have upvoted this blog successfully!",
      });
    }
  };

  return (
    <BlurFade delay={delay}>
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <Link href={href ? href : `/blog/${slug}`}>
            <div className="group/title">
              <div className="flex items-center justify-start gap-4">
                <h1>{title}</h1>
                {href ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover/title:scale-110 transition-all duration-500 ease-out" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>External link - opens in new tab</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <ArrowRightIcon className="w-4 h-4 opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all duration-500 ease-out" />
                )}
              </div>
            </div>
          </Link>
          {/* <button
            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm hover:bg-muted transition-colors"
            onClick={handleUpvote}
          >
            <ArrowUpIcon className="w-3 h-3 text-muted-foreground" />
            {upvotes > 0 && (
              <span className="text-muted-foreground">{upvotes}</span>
            )}
          </button> */}
        </div>
        <p className="text-sm text-muted-foreground">
          {formatDate(publishedAt)}
        </p>
      </div>
    </BlurFade>
  );
}
