import BlurFade from "@/components/magicui/blur-fade";

export const metadata = {
  title: "Blogs",
  description:
    "A list of all my content related work published on various sites.",
};

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage() {
  return (
    <section>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-medium text-2xl mb-8 tracking-tighter">Blogs ✏️</h1>
        <p>
          So... I not only like to read long and boring documentations, research
          papers and journals, I also like to write them! Here you can find all
          my content related work published on various sites.
        </p>
      </BlurFade>
      {/* {posts
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post, id) => (
          <BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05} key={post.slug}>
            <Link
              className="flex flex-col space-y-1 mb-4"
              href={`/blog/${post.slug}`}
            >
              <div className="w-full flex flex-col">
                <p className="tracking-tight">{post.metadata.title}</p>
                <p className="h-6 text-xs text-muted-foreground">
                  {post.metadata.publishedAt}
                </p>
              </div>
            </Link>
          </BlurFade>
        ))} */}
    </section>
  );
}
