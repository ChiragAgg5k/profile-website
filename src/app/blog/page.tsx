import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
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

const timeToHowLongAgo = (date: string) => {
  const dateObject = new Date(date);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - dateObject.getTime();

  const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);

  if (months > 12)
    return years === 1 ? `${years} year ago` : `${years} years ago`;
  if (months > 0)
    return months === 1 ? `${months} month ago` : `${months} months ago`;
  if (days > 0) return days === 1 ? `${days} day ago` : `${days} days ago`;
  if (hours > 0)
    return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
  if (minutes > 0)
    return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;

  return "few seconds ago";
};

export default async function BlogPage() {
  return (
    <section>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-medium text-3xl font-semibold mb-8 tracking-tighter">
          Blogs ✏️
        </h1>
        <p className="mb-8">
          So... I not only like to read long and boring documentations, research
          papers and journals, I also like to write them! Here you can find some
          of my favourite content related work published on various sites.
        </p>
      </BlurFade>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mx-auto">
        {posts
          .sort((a, b) => {
            if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
              return -1;
            }
            return 1;
          })
          .map((post, id) => (
            <BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05} key={id}>
              <ProjectCard
                key={post.title}
                title={post.title}
                description={post.description}
                dates={timeToHowLongAgo(post.publishedAt)}
                tags={post.tags}
                href={post.href}
                image={post.thumbnail}
                links={[post.links[0]]}
              />
            </BlurFade>
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
