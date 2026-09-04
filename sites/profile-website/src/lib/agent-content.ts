export const SITE_URL = "https://www.chiragaggarwal.tech";

export const AGENT_VARY = "Accept, Accept-Encoding";
export const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

export const NOT_FOUND_MARKDOWN = `# Page not found

This path does not exist on chiragaggarwal.tech.

## Where to look next

- [Home](${SITE_URL}/)
- [Chirag Aggarwal developer resources](${SITE_URL}/developers)
- [Blog](${SITE_URL}/blog)
- [llms.txt](${SITE_URL}/llms.txt)
- [Sitemap](${SITE_URL}/sitemap.xml)
- [RSS feed](${SITE_URL}/feed.xml)
`;

const PAGE_MARKDOWN_ASSETS: Record<string, string> = {
  "/": "/index.md",
  "/blog": "/blog.md",
  "/developers": "/developers.md",
  "/resume": "/resume.md",
  "/trends": "/trends.md",
};

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.replace(/\/+$/, "") || "/";
}

export function hasFileExtension(pathname: string): boolean {
  const lastSegment = pathname.split("/").pop() ?? "";
  return /\.[A-Za-z0-9]+$/.test(lastSegment);
}

export function markdownAssetPath(pathname: string): string | null {
  const path = normalizePathname(pathname);
  if (PAGE_MARKDOWN_ASSETS[path]) {
    return PAGE_MARKDOWN_ASSETS[path];
  }

  const blogMatch = path.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    return `/blog/${blogMatch[1]}.txt`;
  }

  return null;
}

export function markdownHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra);
  headers.set("Content-Type", MARKDOWN_CONTENT_TYPE);
  headers.set("Vary", AGENT_VARY);
  return headers;
}
