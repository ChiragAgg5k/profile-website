import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/data/posts";

type RelatedPostsProps = {
  posts: (BlogPost & { slug: string })[];
};

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <aside className="mt-12 border-t pt-8">
      <h2 className="text-lg font-semibold tracking-tight mb-4">
        More from the blog
      </h2>
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <a
              href={`/blog/${post.slug}`}
              className="group block rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <h3 className="font-medium group-hover:underline">{post.title}</h3>
              {post.description ? (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {post.description}
                </p>
              ) : null}
              <p className="mt-2 text-xs text-muted-foreground">
                {formatDate(post.publishedAt)}
              </p>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted-foreground">
        <a href="/blog" className="underline text-foreground">
          View all posts
        </a>
      </p>
    </aside>
  );
}
