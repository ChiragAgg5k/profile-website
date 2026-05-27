import { useMDXComponents } from "@/mdx-components";
import { getPostComponent, posts } from "@/data/posts";
import { DATA } from "@/data/resume";
import { createFileRoute, notFound } from "@tanstack/react-router";

type BlogRoutePost = (typeof posts)[number] & { slug: string };

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = posts.find((entry) => entry.slug === params.slug);
    const component = post?.slug ? getPostComponent(post.slug) : null;

    if (!post || !component) {
      throw notFound();
    }

    return { post: post as BlogRoutePost };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    const title = post
      ? `${post.title} | Chirag Aggarwal`
      : "Blog | Chirag Aggarwal";
    const description =
      post?.description ??
      (post
        ? `Read ${post.title} by Chirag Aggarwal.`
        : "Read blog posts by Chirag Aggarwal.");
    const url = `${DATA.url}/blog/${post?.slug ?? ""}`;
    const image = `${DATA.url}/preview.png`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(post
          ? [
              { property: "article:published_time", content: post.publishedAt },
              { property: "article:author", content: DATA.name },
              { property: "article:section", content: "Technology" },
              {
                "script:ld+json": {
                  "@context": "https://schema.org",
                  "@type": "BlogPosting",
                  headline: post.title,
                  description,
                  image,
                  url,
                  mainEntityOfPage: { "@type": "WebPage", "@id": url },
                  datePublished: post.publishedAt,
                  dateModified: post.publishedAt,
                  author: {
                    "@type": "Person",
                    name: DATA.name,
                    url: DATA.url,
                  },
                  publisher: {
                    "@type": "Person",
                    name: DATA.name,
                    url: DATA.url,
                  },
                },
              },
              {
                "script:ld+json": {
                  "@context": "https://schema.org",
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: DATA.url,
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: "Blog",
                      item: `${DATA.url}/blog`,
                    },
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: post.title,
                      item: url,
                    },
                  ],
                },
              },
            ]
          : []),
      ],
      links: post
        ? [
            {
              rel: "canonical",
              href: url,
            },
          ]
        : [],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const Content = getPostComponent(post.slug)!;

  return (
    <article className="pb-16">
      <Content components={useMDXComponents({})} />
    </article>
  );
}
