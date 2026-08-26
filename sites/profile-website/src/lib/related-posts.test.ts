import { describe, expect, test } from "bun:test";
import { rankRelatedPosts, tokenizeRelatedText } from "./related-posts";

const posts = [
  {
    slug: "hacktoberfest-cal-buddy",
    title: "My Hacktoberfest 2024 Experience with Cal Buddy",
    description: "Building an open-source calendar assistant during Hacktoberfest.",
    publishedAt: "2024-11-01",
  },
  {
    slug: "hackfrost-daytona",
    title: "My Hackfrost Journey with Daytona",
    description: "A hackathon weekend navigating development challenges.",
    publishedAt: "2024-12-05",
  },
  {
    slug: "mcp-handshake",
    title: "MCP 2.0: the release that deleted the handshake",
    description: "What changed in the MCP protocol revision.",
    publishedAt: "2026-08-10",
  },
  {
    slug: "will-mcp-replace-the-cli",
    title: "Will MCP replace the CLI?",
    description: "MCP tools versus the command line interface.",
    publishedAt: "2026-08-16",
  },
  {
    slug: "unrelated-postgres",
    title: "Serverless Postgres starter kit",
    description: "A tour of Neon and the T3 stack.",
    publishedAt: "2026-08-19",
  },
];

describe("tokenizeRelatedText", () => {
  test("maps hacktoberfest and hackfrost onto the same topic token", () => {
    const hacktoberfest = tokenizeRelatedText("Hacktoberfest 2024 calendar");
    const hackfrost = tokenizeRelatedText("Hackfrost hackathon weekend");

    expect(hacktoberfest.has("hackathon")).toBe(true);
    expect(hackfrost.has("hackathon")).toBe(true);
  });
});

describe("rankRelatedPosts", () => {
  test("prefers topical overlap over recency", () => {
    const related = rankRelatedPosts(posts, "hacktoberfest-cal-buddy", 2);

    expect(related[0]?.slug).toBe("hackfrost-daytona");
  });

  test("clusters MCP posts together", () => {
    const related = rankRelatedPosts(posts, "mcp-handshake", 2);
    expect(related.map((post) => post.slug)).toContain("will-mcp-replace-the-cli");
  });

  test("excludes the current post and respects the limit", () => {
    const related = rankRelatedPosts(posts, "will-mcp-replace-the-cli", 3);
    expect(related).toHaveLength(3);
    expect(related.some((post) => post.slug === "will-mcp-replace-the-cli")).toBe(
      false,
    );
  });
});
