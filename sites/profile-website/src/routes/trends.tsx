import { GitHubActivity } from "@/components/github-activity";
import { UsageDashboard } from "@/components/usage-dashboard";
import { DATA } from "@/data/resume";
import { usage } from "@/data/usage";
import { createFileRoute } from "@tanstack/react-router";

const TRENDS_URL = `${DATA.url}/trends`;
const TRENDS_DESCRIPTION =
  "API-rate token usage across Claude Code, Codex, and other coding agents I run locally.";

export const Route = createFileRoute("/trends")({
  head: () => ({
    meta: [
      { title: "My agentic trends | Chirag Aggarwal" },
      { name: "description", content: TRENDS_DESCRIPTION },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "My agentic trends | Chirag Aggarwal" },
      { property: "og:description", content: TRENDS_DESCRIPTION },
      { property: "og:url", content: TRENDS_URL },
      { name: "twitter:title", content: "My agentic trends | Chirag Aggarwal" },
      { name: "twitter:description", content: TRENDS_DESCRIPTION },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: `${DATA.name}'s agentic trends`,
          url: TRENDS_URL,
          description: TRENDS_DESCRIPTION,
          creator: { "@type": "Person", name: DATA.name, url: DATA.url },
          dateModified: usage.generatedAt,
        },
      },
    ],
    links: [{ rel: "canonical", href: TRENDS_URL }],
  }),
  component: TrendsPage,
});

function TrendsPage() {
  return (
    <section className="fixed inset-0 z-10 overflow-x-clip overflow-y-auto bg-background">
      <div className="mx-auto w-full max-w-[68rem] px-6 pb-24 pt-8">
        <div className="flex min-h-[calc(100svh-6rem)] flex-col justify-center">
          <UsageDashboard />
        </div>
        <GitHubActivity
          username="ChiragAgg5k"
          profileUrl={DATA.contact.social.GitHub.url}
        />
      </div>
    </section>
  );
}
