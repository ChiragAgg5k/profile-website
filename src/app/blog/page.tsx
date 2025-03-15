import BlogPostItem from "@/components/blog-post-item";
import BlurFade from "@/components/magicui/blur-fade";
import { posts } from "@/data/posts";
import { getBlogVotes } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Blogs - My Content Related Work",
  description:
    "Explore a curated list of my content-related work, including articles, research papers, and journals published across various platforms. Discover insights and knowledge shared through my writing.",
  keywords:
    "blogs, articles, research papers, content writing, journals, publications",
  robots: "index, follow",
};

const BLUR_FADE_DELAY = 0.04;

export const revalidate = 3600;

export default async function BlogPage() {
  const blogVotes = await getBlogVotes();

  return (
    <section className="mx-8">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-medium text-3xl font-semibold mb-8 tracking-tighter">
          Blogs
        </h1>
        <p className="mb-8 text-muted-foreground text-sm">
          So... I not only like to read long and boring documentations, research
          papers and journals, I also like to write them! Here you can find some
          of my favourite content related work published on various sites.
        </p>
      </BlurFade>
      <div className="flex flex-col gap-4">
        {posts
          .sort((a, b) => {
            if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
              return -1;
            }
            return 1;
          })
          .map((post, id) => (
            <BlogPostItem
              key={id}
              title={post.title}
              slug={post.slug}
              publishedAt={post.publishedAt}
              delay={BLUR_FADE_DELAY * 2 + id * 0.05}
              votes={
                blogVotes.find((vote) => vote.slug === post.slug)?.count || 0
              }
            />
          ))}
      </div>
      <BlurFade delay={BLUR_FADE_DELAY * 2 + posts.length * 0.05}>
        <p className="text-center my-8 text-sm text-muted-foreground">
          Follow me on{" "}
          <Link
            className="underline text-foreground"
            href="https://dev.to/chiragagg5k"
          >
            dev.to
          </Link>{" "}
          for more content!
        </p>
      </BlurFade>
    </section>
  );
}
