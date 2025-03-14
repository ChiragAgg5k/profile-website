"use client";
import { posts } from "@/data/posts";
import { ArrowUpIcon } from "lucide-react";
import { useState } from "react";

export const BlogTitle = ({ slug }: { slug: string }) => {
  const [upvotes, setUpvotes] = useState(0);
  const post = posts.find((post) => post.slug === slug);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleUpvote = () => {
    setUpvotes((prev) => prev + 1);
    // Add API call here to persist upvotes
  };

  return (
    <div className="flex flex-col gap-2 mb-8">
      <p className="text-lg text-gray-500 font-bold dark:text-gray-400">
        {"Chirag's Blog"}
      </p>
      <div className="flex items-center gap-6 justify-between">
        <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold">
          {post?.title}
        </h1>
        <button
          className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-muted transition-colors"
          onClick={handleUpvote}
        >
          <ArrowUpIcon className="w-5 h-5 text-muted-foreground" />
          {upvotes > 0 && (
            <span className="text-muted-foreground">{upvotes}</span>
          )}
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {post?.publishedAt ? formatDate(post.publishedAt) : ""}
      </p>
    </div>
  );
};
