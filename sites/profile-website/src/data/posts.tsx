import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

type MdxPostComponent = ComponentType<{
  components?: MDXComponents;
}>;

type BlogPost = {
  title: string;
  publishedAt: string;
  slug?: string;
  href?: string;
  // Plain-text excerpt (~155 chars) used for meta/OG/Twitter descriptions and
  // BlogPosting structured data. Required for internal (slug) posts so each
  // page gets a unique, descriptive SERP snippet.
  description?: string;
};

const mdxModules = import.meta.glob<{ default: MdxPostComponent }>(
  "../app/blog/**/page.mdx",
  { eager: true },
);

const basePosts: BlogPost[] = [
  {
    title: "My Journey in Authorization with OPAL",
    slug: "my-journey-in-authorization-with-opal",
    publishedAt: "2024-06-23",
    description:
      "A beginner-friendly walkthrough of authorization and how OPAL (Open Policy Administration Layer) manages real-time, fine-grained access control.",
  },
  {
    title: "Mastering npm: A Comprehensive Guide to Package Management",
    slug: "mastering-npm-a-comprehensive-guide-to-package-management",
    publishedAt: "2024-07-05",
    description:
      "A comprehensive guide to npm for web developers: packages, scripts, semantic versioning, and the workflows that make Node's package manager click.",
  },
  {
    title: "From Kubernetes Chaos to Calm: A Cyclops Adventure",
    slug: "from-kubernetes-chaos-to-calm-a-cyclops-adventure",
    publishedAt: "2024-07-30",
    description:
      "How Cyclops turns the chaos of managing Kubernetes clusters into a calm, UI-driven experience, with a hands-on walkthrough of the tool.",
  },
  {
    title: "Conditional Dependency Management Using Maven Profiles",
    slug: "conditional-dependency-management-using-maven-profiles",
    publishedAt: "2024-08-06",
    description:
      "Using Maven profiles to manage conditional dependencies so your Java builds pull exactly the right libraries for each environment.",
  },
  {
    title:
      "Neon T3 Starter Kit: Supercharging Web Development with Serverless Postgres",
    slug: "neon-t3-starter-kit-supercharging-web-development-with-serverless-postgres",
    publishedAt: "2024-08-28",
    description:
      "A tour of the Neon T3 Starter Kit: the open-source T3 stack paired with Neon's serverless Postgres for fast, modern full-stack development.",
  },
  {
    title: "How to Register Users in Django REST Framework?",
    slug: "how-to-register-users-in-django-rest-framework",
    publishedAt: "2024-10-01",
    description:
      "A step-by-step guide to implementing user registration in Django REST Framework, one of the most common requirements when building web APIs.",
  },
  {
    title:
      "My Hacktoberfest 2024 Experience with Cal Buddy, Your Smart Calendar Assistant",
    slug: "my-hacktoberfest-2024-experience-with-cal-buddy-your-smart-calendar-assistant",
    publishedAt: "2024-11-01",
    description:
      "My Hacktoberfest 2024 experience building Cal Buddy, a smart calendar assistant, and what I learned as an open-source contributor.",
  },
  {
    title:
      "My Hackfrost Journey: Navigating Development Challenges with Daytona",
    slug: "my-hackfrost-journey-navigating-development-challenges-with-daytona",
    publishedAt: "2024-12-05",
    description:
      "My journey through Hackfrost, the WeMakeDevs hackathon, and how Daytona's dev environments helped me navigate the development challenges.",
  },
  {
    title: "Architecture Patterns for Beginners: MVC, MVP, and MVVM",
    slug: "architecture-patterns-for-beginners-mvc-mvp-and-mvvm",
    publishedAt: "2024-12-28",
    description:
      "A beginner's guide to the MVC, MVP, and MVVM architecture patterns: what they are, how they differ, and when to reach for each one.",
  },
  {
    title:
      "Writing Event-Driven Serverless Code to Build Scalable Applications",
    slug: "writing-event-driven-serverless-code-to-build-scalable-applications",
    publishedAt: "2025-01-26",
    description:
      "How event-driven, serverless code rewrites the way software scales, with patterns for building resilient and scalable applications.",
  },
  {
    title: "Self-hosting Appwrite with Coolify",
    href: "https://appwrite.io/blog/post/self-hosting-appwrite-with-coolify",
    publishedAt: "2025-02-28",
  },
  {
    title: "Debugging with Source Maps: A Comprehensive Guide",
    slug: "debugging-with-source-maps-a-comprehensive-guide",
    publishedAt: "2025-03-09",
    description:
      "A comprehensive guide to debugging production issues with source maps: how they work and how to use them to trace minified code back to source.",
  },
  {
    title: "Focus on the product, not the tech stack",
    slug: "focus-on-the-product-not-the-tech-stack",
    publishedAt: "2025-05-14",
    description:
      "Why obsessing over your tech stack can hold you back, and how focusing on the product you're building leads to better outcomes.",
  },
  {
    title: "Announcing Dev Keys: faster local development without rate limits",
    href: "https://appwrite.io/blog/post/announcing-dev-keys",
    publishedAt: "2025-05-21",
  },
  {
    title: "Vibe coding an Email Ticket Automater using Postmark",
    slug: "vibe-coding-an-email-ticket-automater-using-postmark",
    publishedAt: "2025-06-01",
    description:
      "Vibe coding an email ticket automater with Postmark for the Inbox Innovators challenge, turning inbound email into actionable tickets.",
  },
  {
    title: "Automate anything - Making research analysis effortless",
    slug: "automate-anything-making-research-analysis-effortless",
    publishedAt: "2025-06-14",
    description:
      "How to make research analysis effortless by automating the overwhelming parts of starting and running a research project.",
  },
  {
    title: "From student to full-time Platform Engineer at Appwrite",
    slug: "from-student-to-full-time-platform-engineer-at-appwrite",
    publishedAt: "2025-06-21",
    description:
      "My journey from university student to full-time Platform Engineer at Appwrite: the internship, the work I owned, and the lessons along the way.",
  },
  {
    title:
      "Introducing Type generation: Automate your type definitions with Appwrite",
    href: "https://appwrite.io/blog/post/announcing-type-generation-feature",
    publishedAt: "2025-06-24",
  },
  {
    title:
      "JStack + Appwrite: A Match Made in Heaven for Modern Web Development",
    slug: "jstack-appwrite-a-match-made-in-heaven-for-modern-web-development",
    publishedAt: "2025-07-06",
    description:
      "Why JStack and Appwrite are a match made in heaven for modern web development, pairing a type-safe stack with a powerful open-source backend.",
  },
  {
    title: "How we solved logging at Appwrite",
    slug: "how-we-solved-logging-at-appwrite",
    publishedAt: "2026-04-18",
    description:
      "How we rethought and solved logging at Appwrite: the problems with traditional logging and the approach we landed on to fix them.",
  },
  {
    title: "Managing multiple Docker Hub accounts using docker-use",
    slug: "managing-multiple-docker-hub-accounts-using-docker-use",
    publishedAt: "2026-05-25",
    description:
      "Managing multiple Docker Hub accounts cleanly with docker-use, so you can switch between accounts without the usual login juggling.",
  },
];

export const posts = [...basePosts];

export type { BlogPost };

const postComponentsBySlug = Object.fromEntries(
  Object.entries(mdxModules).flatMap(([path, module]) => {
    const match = path.match(/\.\.\/app\/blog\/([^/]+)\/page\.mdx$/);
    if (!match) {
      return [];
    }
    return [[match[1], module.default] as const];
  }),
) as Record<string, MdxPostComponent | undefined>;

if (import.meta.env.DEV) {
  const missingSlugs = basePosts
    .filter((post) => post.slug && !postComponentsBySlug[post.slug])
    .map((post) => post.slug);

  if (missingSlugs.length > 0) {
    console.warn(
      `[posts] Missing MDX components for slugs: ${missingSlugs.join(", ")}`,
    );
  }
}

export function getPostComponent(slug: string) {
  return postComponentsBySlug[slug] ?? null;
}

export function getInternalPosts() {
  return posts.filter((post): post is BlogPost & { slug: string } =>
    Boolean(post.slug),
  );
}

export function getLatestPosts(limit = 3) {
  return [...getInternalPosts()]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, limit);
}

export function getRelatedPosts(currentSlug: string, limit = 3) {
  return [...getInternalPosts()]
    .filter((post) => post.slug !== currentSlug)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, limit);
}
