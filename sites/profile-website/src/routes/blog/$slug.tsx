import { useMDXComponents } from "@/mdx-components";
import { getPostComponent, posts } from "@/data/posts";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = posts.find((entry) => entry.slug === params.slug);
    const component = post?.slug ? getPostComponent(post.slug) : null;

    if (!post || !component) {
      throw notFound();
    }

    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    const title = post
      ? `${post.title} | Chirag Aggarwal`
      : "Blog | Chirag Aggarwal";
    const description = post
      ? `Read ${post.title} by Chirag Aggarwal.`
      : "Read blog posts by Chirag Aggarwal.";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
      links: post
        ? [
            {
              rel: "canonical",
              href: `https://www.chiragaggarwal.tech/blog/${post.slug}`,
            },
          ]
        : [],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const Content = post.slug ? getPostComponent(post.slug) : null;

  if (!Content) {
    throw notFound();
  }

  return (
    <article className="pb-16">
      <Content components={useMDXComponents({})} />
    </article>
  );
}
