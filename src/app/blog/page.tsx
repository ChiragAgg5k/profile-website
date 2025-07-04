import BlogPostItem from "@/components/blog-post-item";
import BlurFade from "@/components/magicui/blur-fade";
import { posts } from "@/data/posts";
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
  // Group posts by year
  const postsByYear = posts
    .sort((a, b) => {
      if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .reduce(
      (acc, post) => {
        const year = new Date(post.publishedAt).getFullYear();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(post);
        return acc;
      },
      {} as Record<number, typeof posts>,
    );

  // Get sorted years (newest first)
  const sortedYears = Object.keys(postsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  let delayIndex = 0;

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
      <div className="flex flex-col gap-6">
        {sortedYears.map((year) => (
          <div key={year} className="relative group">
            <BlurFade delay={BLUR_FADE_DELAY * 2 + delayIndex * 0.05}>
              <h2
                className="relative md:absolute top-0 right-0 md:top-0 md:right-0 text-3xl opacity-50 font-bold text-transparent group-hover:opacity-100 transition-all duration-300 pointer-events-auto z-10 mb-4 md:mb-0 text-right"
                style={{
                  WebkitTextStroke: "1px hsl(var(--muted-foreground))",
                }}
              >
                {year}
              </h2>
            </BlurFade>
            <div className="flex flex-col gap-4 mb-8">
              {postsByYear[year].map((post) => {
                delayIndex++;
                return (
                  <BlogPostItem
                    key={post.slug}
                    title={post.title}
                    href={post.href}
                    slug={post.slug}
                    publishedAt={post.publishedAt}
                    delay={BLUR_FADE_DELAY * 2 + delayIndex * 0.05}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <BlurFade delay={BLUR_FADE_DELAY * 2 + delayIndex * 0.05}>
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
