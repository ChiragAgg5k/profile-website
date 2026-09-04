import { useMDXComponents } from "@/mdx-components";
import RelatedPosts from "@/components/related-posts";
import { getPostComponent, getRelatedPosts, posts } from "@/data/posts";
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

    const entry = post as BlogRoutePost;

    return {
      post: entry,
      relatedPosts: getRelatedPosts(entry.slug),
    };
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
    const image = post?.slug
      ? `${DATA.url}/og/${post.slug}.png`
      : `${DATA.url}/preview.png`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        {
          property: "og:image:alt",
          content: post ? post.title : title,
        },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
        ...(post
          ? [
              { property: "article:published_time", content: post.publishedAt },
              {
                property: "article:modified_time",
                content: post.updatedAt ?? post.publishedAt,
              },
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
                  dateModified: post.updatedAt ?? post.publishedAt,
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
            {
              rel: "alternate",
              type: "text/markdown",
              href: `${DATA.url}/blog/${post.slug}.txt`,
            },
          ]
        : [],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post, relatedPosts } = Route.useLoaderData();
  const Content = getPostComponent(post.slug)!;

  return (
    <article className="pb-16">
      <Content components={useMDXComponents({})} />
      <div className="px-6">
        <RelatedPosts posts={relatedPosts} />
      </div>
    </article>
  );
}
