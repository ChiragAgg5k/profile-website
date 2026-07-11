import BlogPostItem from "@/components/blog-post-item";
import BlurFade from "@/components/magicui/blur-fade";
import { posts } from "@/data/posts";
import { DATA } from "@/data/resume";
import { createFileRoute } from "@tanstack/react-router";

const BLUR_FADE_DELAY = 0.04;

const BLOG_DESCRIPTION =
  "Explore a curated list of my content-related work, including articles, research papers, and journals published across various platforms.";
const BLOG_URL = `${DATA.url}/blog`;

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blogs | Chirag Aggarwal" },
      { name: "description", content: BLOG_DESCRIPTION },
      {
        name: "keywords",
        content:
          "blogs, articles, research papers, content writing, journals, publications",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Blogs | Chirag Aggarwal" },
      { property: "og:description", content: BLOG_DESCRIPTION },
      { property: "og:url", content: BLOG_URL },
      { name: "twitter:title", content: "Blogs | Chirag Aggarwal" },
      { name: "twitter:description", content: BLOG_DESCRIPTION },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${DATA.name}'s Blog`,
          url: BLOG_URL,
          description: BLOG_DESCRIPTION,
          author: { "@type": "Person", name: DATA.name, url: DATA.url },
          blogPost: posts
            .filter((post) => post.slug)
            .map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              url: `${BLOG_URL}/${post.slug}`,
              datePublished: post.publishedAt,
            })),
        },
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: DATA.url },
            { "@type": "ListItem", position: 2, name: "Blog", item: BLOG_URL },
          ],
        },
      },
    ],
    links: [{ rel: "canonical", href: BLOG_URL }],
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
          New posts are published here first. Subscribe via{" "}
          <a className="underline text-foreground" href="/feed.xml">
            RSS
          </a>
          .
        </p>
      </BlurFade>
    </section>
  );
}
