import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dir, "../..");

const read = (relativePath: string) =>
  readFileSync(path.join(root, relativePath), "utf8");

const requiredAgents = [
  "ChatGPT-User",
  "ClaudeBot",
  "Google-Extended",
  "DeepSeekBot",
  "GPTBot",
  "PerplexityBot",
];

beforeAll(async () => {
  const scripts = [
    "scripts/generate-llms-txt.cjs",
    "scripts/generate-agent-markdown.cjs",
    "scripts/generate-sitemap.cjs",
  ];
  for (const script of scripts) {
    const result = Bun.spawnSync({
      cmd: ["node", script],
      cwd: root,
      stdout: "pipe",
      stderr: "pipe",
    });
    if (result.exitCode !== 0) {
      throw new Error(
        `${script} failed:\n${new TextDecoder().decode(result.stderr)}`,
      );
    }
  }
});

describe("robots.txt", () => {
  const robots = read("public/robots.txt");

  test("explicitly allows major agent User-Agents", () => {
    for (const agent of requiredAgents) {
      expect(robots).toContain(`User-agent: ${agent}`);
      const block = robots.split(`User-agent: ${agent}`)[1]?.split("User-agent:")[0];
      expect(block).toContain("Allow: /");
      expect(block).not.toContain("Disallow: /");
    }
  });

  test("does not hide agent files from crawlers", () => {
    expect(robots).not.toContain("Disallow: /llms.txt");
    expect(robots).not.toContain("Disallow: /llms-full.txt");
    expect(robots).not.toContain("Disallow: /blog/*.txt");
  });
});

describe("machine-readable discovery files", () => {
  test("llms.txt names chiragaggarwal.tech developer resources", () => {
    const llms = read("public/llms.txt");
    expect(llms).toContain("# Chirag Aggarwal");
    expect(llms).toContain("## Developer resources");
    expect(llms.toLowerCase()).toContain("chiragaggarwal.tech");
    expect(llms).toContain("/developers");
  });

  test("sitemap includes /developers", () => {
    expect(read("public/sitemap.xml")).toContain(
      "https://www.chiragaggarwal.tech/developers",
    );
  });

  test("404.html and 404.md include recovery links", () => {
    const html = read("public/404.html");
    const markdown = read("public/404.md");
    for (const body of [html, markdown]) {
      expect(body).toContain("/sitemap.xml");
      expect(body).toContain("/llms.txt");
      expect(body).toContain("/developers");
    }
  });

  test("negotiable markdown siblings exist for key pages", () => {
    expect(read("public/index.md")).toContain("Chirag Aggarwal");
    expect(read("public/developers.md")).toContain(
      "Chirag Aggarwal developer resources",
    );
    expect(read("public/blog.md")).toContain("Blog");
  });
});

describe("vercel.json", () => {
  test("HTML routes Vary on Accept", () => {
    const config = JSON.parse(read("vercel.json")) as {
      headers: { source: string; headers: { key: string; value: string }[] }[];
    };
    const varySources = config.headers
      .filter((entry) =>
        entry.headers.some(
          (header) =>
            header.key === "Vary" && header.value.includes("Accept"),
        ),
      )
      .map((entry) => entry.source);

    expect(varySources).toContain("/");
    expect(varySources).toContain("/blog/:slug");
    expect(varySources).toContain("/developers");
  });

  test("rewrites markdown Accept to sibling files", () => {
    const config = JSON.parse(read("vercel.json")) as {
      rewrites?: { source: string; destination: string; has?: { value: string }[] }[];
    };
    const destinations = (config.rewrites ?? []).map((entry) => entry.destination);
    expect(destinations).toContain("/index.md");
    expect(destinations).toContain("/developers.md");
    expect(
      (config.rewrites ?? []).every((entry) =>
        entry.has?.some((condition) => condition.value.includes("text/markdown")),
      ),
    ).toBe(true);
  });
});
