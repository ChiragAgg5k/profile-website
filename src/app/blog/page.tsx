import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";

export const metadata = {
  title: "Blogs",
  description:
    "A list of all my content related work published on various sites.",
};

const posts = [
  {
    title: "Mastering npm: A Comprehensive Guide to Package Management",
    thumbnail: "/blog/npm-guide.png",
    icon: "📦",
    href: "https://dev.to/chiragagg5k/mastering-npm-a-comprehensive-guide-to-package-management-3h0m",
    publishedAt: "2024-07-05",
    tags: ["npm", "javascript", "guide"],
    description:
      "A comprehensive guide to npm, covering everything from installation to publishing packages.",
    links: [
      {
        icon: "💻",
        type: " dev.to",
        href: "https://dev.to/chiragagg5k/mastering-npm-a-comprehensive-guide-to-package-management-3h0m",
      },
    ],
  },
  {
    title: "Conditional Dependency Management Using Maven Profiles",
    thumbnail: "/blog/conditional-maven.png",
    icon: "📦",
    href: "https://www.geeksforgeeks.org/conditional-dependency-management-using-maven-profiles/?itm_source=auth&itm_medium=contributions&itm_campaign=articles",
    publishedAt: "2024-08-06",
    tags: ["maven", "java", "guide"],
    description:
      "Introduction to Maven profiles and how to use them to conditionally manage dependencies in a Maven project.",
    links: [
      {
        icon: "🟩",
        type: " geeksforgeeks",
        href: "https://www.geeksforgeeks.org/conditional-dependency-management-using-maven-profiles/?itm_source=auth&itm_medium=contributions&itm_campaign=articles",
      },
    ],
  },
  {
    title: "Neon T3 Starter Kit: Supercharging Web Development with Serverless Postgres",
    thumbnail: "/blog/neon-starter.png",
    icon: "💻",
    href: "https://dev.to/chiragagg5k/neon-t3-starter-kit-supercharging-web-development-with-serverless-postgres-13fg",
    publishedAt: "2024-08-28",
    tags: ["neon", "typescript", "guide"],
    description:
      "A starter kit that uses Neon database and T3 stack to build a full-stack web application with TypeScript.",
    links: [
      {
        icon: "💻",
        type: " dev.to",
        href: "https://dev.to/chiragagg5k/neon-t3-starter-kit-supercharging-web-development-with-serverless-postgres-13fg",
      },
    ],
  },
  {
    title: "From Kubernetes Chaos to Calm: A Cyclops Adventure",
    thumbnail: "/blog/cyclops.png",
    icon: "💻",
    href: "https://dev.to/chiragagg5k/from-kubernetes-chaos-to-calm-a-cyclops-adventure-1b5m",
    publishedAt: "2024-07-30",
    tags: ["kubernetes", "cyclops", "guide"],
    description:
      "A guide to understanding and managing Kubernetes Chaos, and how to use it to improve the reliability of your applications.",
    links: [
      {
        icon: "💻",
        type: " dev.to",
        href: "https://dev.to/chiragagg5k/from-kubernetes-chaos-to-calm-a-cyclops-adventure-1b5m",
      },
    ],
  },
  {
    title: "My Journey in Authorization with OPAL",
    thumbnail: "/blog/opal.png",
    icon: "💻",
    href: "https://dev.to/chiragagg5k/my-journey-in-authorization-with-opal-1072",
    publishedAt: "2024-06-23",
    tags: ["opal", "authorization", "guide"],
    description:
      "Understanding the basics of authorization and how to implement it using OPAL, a powerful authorization library.",
    links: [
      {
        icon: "💻",
        type: " dev.to",
        href: "https://dev.to/chiragagg5k/my-journey-in-authorization-with-opal-1072",
      },
    ],
  },
];

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

  if(months > 12){
    return years === 1 ? `${years} year ago` : `${years} years ago`;
  }

  if(months > 0){
    return months === 1 ? `${months} month ago` : `${months} months ago`;
  }

  if(days > 0){
    return days === 1 ? `${days} day ago` : `${days} days ago`;
  }

  if(hours > 0){
    return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
  }

  if(minutes > 0){
    return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
  }

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
                links={post.links}
              />
            </BlurFade>
          ))}
      </div>
    </section>
  );
}
