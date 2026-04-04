import BlogPostItem from "@/components/blog-post-item";
import BlurFade from "@/components/magicui/blur-fade";
import { posts } from "@/data/posts";
import { createFileRoute } from "@tanstack/react-router";

const BLUR_FADE_DELAY = 0.04;

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blogs | Chirag Aggarwal" },
      {
        name: "description",
        content:
          "Explore a curated list of my content-related work, including articles, research papers, and journals published across various platforms.",
      },
      {
        name: "keywords",
        content:
          "blogs, articles, research papers, content writing, journals, publications",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Blogs | Chirag Aggarwal" },
      {
        property: "og:description",
        content:
          "Explore a curated list of my content-related work, including articles, research papers, and journals published across various platforms.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.chiragaggarwal.tech/blog" }],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const postsByYear = [...posts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
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
              {postsByYear[year].map((post, index) => {
                delayIndex++;
                return (
                  <BlurFade
                    key={`${year}-${index}`}
                    delay={BLUR_FADE_DELAY * 2 + delayIndex * 0.05}
                  >
                    <BlogPostItem
                      title={post.title}
                      href={post.href}
                      slug={post.slug}
                      publishedAt={post.publishedAt}
                    />
                  </BlurFade>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <BlurFade delay={BLUR_FADE_DELAY * 2 + delayIndex * 0.05}>
        <p className="text-center my-8 text-sm text-muted-foreground">
          Follow me on{" "}
          <a
            className="underline text-foreground"
            href="https://dev.to/chiragagg5k"
          >
            dev.to
          </a>{" "}
          for more content!
        </p>
      </BlurFade>
    </section>
  );
}
