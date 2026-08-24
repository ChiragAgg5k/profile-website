import { describe, expect, test } from "bun:test";
import {
  hasFileExtension,
  markdownAssetPath,
  markdownHeaders,
  normalizePathname,
  NOT_FOUND_MARKDOWN,
} from "./agent-content";

describe("markdownAssetPath", () => {
  test("maps canonical pages to sibling markdown", () => {
    expect(markdownAssetPath("/")).toBe("/index.md");
    expect(markdownAssetPath("/blog")).toBe("/blog.md");
    expect(markdownAssetPath("/blog/")).toBe("/blog.md");
    expect(markdownAssetPath("/developers")).toBe("/developers.md");
    expect(markdownAssetPath("/trends")).toBe("/trends.md");
    expect(markdownAssetPath("/blog/mcp-2-0-the-release-that-deleted-the-handshake")).toBe(
      "/blog/mcp-2-0-the-release-that-deleted-the-handshake.txt",
    );
  });

  test("returns null for unknown paths", () => {
    expect(markdownAssetPath("/some-path-that-does-not-exist")).toBeNull();
  });
});

describe("path helpers", () => {
  test("normalizePathname strips trailing slashes", () => {
    expect(normalizePathname("/blog/")).toBe("/blog");
    expect(normalizePathname("/")).toBe("/");
  });

  test("hasFileExtension ignores directory paths", () => {
    expect(hasFileExtension("/index.md")).toBe(true);
    expect(hasFileExtension("/blog/slug.txt")).toBe(true);
    expect(hasFileExtension("/blog/slug")).toBe(false);
    expect(hasFileExtension("/")).toBe(false);
  });
});

describe("404 markdown", () => {
  test("points agents at sitemap, llms.txt, and developer resources", () => {
    expect(NOT_FOUND_MARKDOWN).toContain("# Page not found");
    expect(NOT_FOUND_MARKDOWN).toContain("/sitemap.xml");
    expect(NOT_FOUND_MARKDOWN).toContain("/llms.txt");
    expect(NOT_FOUND_MARKDOWN).toContain("/developers");
  });

  test("markdownHeaders set Content-Type and Vary: Accept", () => {
    const headers = markdownHeaders();
    expect(headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
    expect(headers.get("Vary")?.toLowerCase()).toContain("accept");
  });
});
