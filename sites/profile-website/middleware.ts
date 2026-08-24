import { prefersMarkdown } from "./src/lib/accept";
import {
  AGENT_VARY,
  hasFileExtension,
  markdownAssetPath,
  markdownHeaders,
  NOT_FOUND_MARKDOWN,
} from "./src/lib/agent-content";

export const config = {
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};

export default async function middleware(request: Request) {
  const { pathname } = new URL(request.url);

  if (hasFileExtension(pathname)) {
    return;
  }

  if (!prefersMarkdown(request.headers.get("accept"))) {
    return;
  }

  const assetPath = markdownAssetPath(pathname);
  if (assetPath) {
    const upstream = await fetch(new URL(assetPath, request.url));
    if (upstream.ok) {
      return new Response(await upstream.text(), {
        status: 200,
        headers: markdownHeaders({
          "Cache-Control": "public, max-age=300",
        }),
      });
    }
  }

  return new Response(NOT_FOUND_MARKDOWN, {
    status: 404,
    headers: markdownHeaders({
      Vary: AGENT_VARY,
    }),
  });
}
