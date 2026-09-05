import fs from "node:fs";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin, ViteDevServer } from "vite";
import { prefersMarkdown } from "../src/lib/accept";
import {
  AGENT_VARY,
  hasFileExtension,
  markdownAssetPath,
  MARKDOWN_CONTENT_TYPE,
  NOT_FOUND_MARKDOWN,
} from "../src/lib/agent-content";

function sendMarkdown(
  res: ServerResponse,
  body: string,
  status = 200,
) {
  res.statusCode = status;
  res.setHeader("Content-Type", MARKDOWN_CONTENT_TYPE);
  res.setHeader("Vary", AGENT_VARY);
  res.end(body);
}

function readPublicAsset(root: string, assetPath: string): string | null {
  const relative = assetPath.replace(/^\/+/, "");
  const candidates = [
    path.join(root, "public", relative),
    path.join(root, "dist/client", relative),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return fs.readFileSync(candidate, "utf8");
    }
  }

  return null;
}

function agentMiddleware(root: string) {
  return (
    req: IncomingMessage,
    res: ServerResponse,
    next: (error?: unknown) => void,
  ) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const pathname = url.pathname;

    // Vite's extensionless runtime URLs (notably /@react-refresh) must
    // reach its own middleware, or the client cannot hydrate the page.
    if (pathname.startsWith("/@")) {
      next();
      return;
    }

    res.setHeader("Vary", AGENT_VARY);

    if (hasFileExtension(pathname)) {
      next();
      return;
    }

    const assetPath = markdownAssetPath(pathname);
    const markdownBody = assetPath ? readPublicAsset(root, assetPath) : null;
    const wantsMarkdown = prefersMarkdown(req.headers.accept);

    if (wantsMarkdown) {
      if (markdownBody != null) {
        sendMarkdown(res, markdownBody);
        return;
      }
      sendMarkdown(res, NOT_FOUND_MARKDOWN, 404);
      return;
    }

    if (markdownBody == null) {
      const html404 = readPublicAsset(root, "/404.html");
      if (html404 != null) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Vary", AGENT_VARY);
        res.end(html404);
        return;
      }
    }

    next();
  };
}

export function agentMarkdownPlugin(): Plugin {
  return {
    name: "agent-markdown-negotiation",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(agentMiddleware(server.config.root));
    },
    configurePreviewServer(server) {
      server.middlewares.use(agentMiddleware(server.config.root));
    },
  };
}
