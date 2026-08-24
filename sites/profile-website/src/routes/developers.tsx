import BlurFade from "@/components/magicui/blur-fade";
import { posts } from "@/data/posts";
import { DATA } from "@/data/resume";
import { createFileRoute } from "@tanstack/react-router";

const BLUR_FADE_DELAY = 0.04;
const PAGE_URL = `${DATA.url}/developers`;
const PAGE_TITLE = "Chirag Aggarwal developer resources | chiragaggarwal.tech";
const PAGE_DESCRIPTION =
  "Developer resources for chiragaggarwal.tech: machine-readable site files, MCP and Appwrite writing, and how agents should read this site.";

const developerPosts = posts.filter(
  (post) =>
    post.slug &&
    /mcp|appwrite|api|rest|authorization|logging|cli/i.test(post.title),
);

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      {
        name: "keywords",
        content:
          "chiragaggarwal.tech developer resources, Chirag Aggarwal, MCP, Appwrite, llms.txt, OpenAPI, API docs",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Chirag Aggarwal developer resources",
          url: PAGE_URL,
          description: PAGE_DESCRIPTION,
          isPartOf: {
            "@type": "WebSite",
            name: "chiragaggarwal.tech",
            url: DATA.url,
          },
          author: { "@type": "Person", name: DATA.name, url: DATA.url },
        },
      },
    ],
    links: [
      { rel: "canonical", href: PAGE_URL },
      {
        rel: "alternate",
        type: "text/markdown",
        href: `${DATA.url}/developers.md`,
      },
    ],
  }),
  component: DevelopersPage,
});

function DevelopersPage() {
  return (
    <section className="mx-8">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-medium text-3xl font-semibold mb-8 tracking-tighter">
          Chirag Aggarwal developer resources
        </h1>
        <p className="mb-8 text-muted-foreground text-sm">
          Developer resources for chiragaggarwal.tech. This is a personal site,
          not a hosted product API. Agents should start with the files below
          instead of scraping the HTML.
        </p>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <h2 className="text-lg font-semibold mb-3">Machine-readable files</h2>
        <ul className="mb-10 text-sm space-y-2">
          <li>
            <a className="underline" href="/llms.txt">
              llms.txt
            </a>{" "}
            — site index for agents
          </li>
          <li>
            <a className="underline" href="/llms-full.txt">
              llms-full.txt
            </a>{" "}
            — full-text posts
          </li>
          <li>
            <a className="underline" href="/sitemap.xml">
              sitemap.xml
            </a>
          </li>
          <li>
            <a className="underline" href="/feed.xml">
              feed.xml
            </a>
          </li>
          <li>
            Send <code>Accept: text/markdown</code> on any page URL to get the
            markdown representation.
          </li>
        </ul>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <h2 className="text-lg font-semibold mb-3">
          MCP and platform writing
        </h2>
        <ul className="mb-10 text-sm space-y-2">
          {developerPosts.map((post) => (
            <li key={post.slug}>
              <a className="underline" href={`/blog/${post.slug}`}>
                {post.title}
              </a>
            </li>
          ))}
        </ul>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 4}>
        <h2 className="text-lg font-semibold mb-3">Elsewhere</h2>
        <ul className="mb-8 text-sm space-y-2">
          <li>
            <a className="underline" href="https://appwrite.io/docs">
              Appwrite docs
            </a>
          </li>
          <li>
            <a className="underline" href="https://appwrite.io/docs/tooling/mcp">
              Appwrite MCP
            </a>
          </li>
          <li>
            <a className="underline" href="https://github.com/ChiragAgg5k">
              GitHub
            </a>
          </li>
          <li>
            <a className="underline" href="mailto:chiragaggarwal5k@gmail.com">
              chiragaggarwal5k@gmail.com
            </a>
          </li>
        </ul>
      </BlurFade>
    </section>
  );
}
