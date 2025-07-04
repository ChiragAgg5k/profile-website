"use client";
import { posts } from "@/data/posts";

export const BlogTitle = ({ slug }: { slug: string }) => {
  const post = posts.find((post) => post.slug === slug);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
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
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {post?.publishedAt ? formatDate(post.publishedAt) : ""}
      </p>
    </div>
  );
};
