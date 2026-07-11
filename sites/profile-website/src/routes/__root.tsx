import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { DATA } from "@/data/resume";
import {
  HeadContent,
  ScriptOnce,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import appCss from "@/app/globals.css?url";

const themeInitScript = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='system')?stored:'system';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='system'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);root.style.colorScheme=resolved;}catch(e){}})();`;
const umamiWebsiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
const umamiScriptSrc =
  import.meta.env.VITE_UMAMI_SRC || "https://cloud.umami.is/script.js";
const umamiHostUrl = import.meta.env.VITE_UMAMI_HOST_URL;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: DATA.name },
      {
        name: "description",
        content: DATA.seoDescription,
      },
      {
        name: "keywords",
        content:
          "software engineer, web developer, full stack developer, frontend developer, React developer, TypeScript, TanStack Start, portfolio, software development, programming",
      },
      { name: "author", content: DATA.name },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: DATA.name },
      { property: "og:description", content: DATA.seoDescription },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: `${DATA.name}'s Portfolio` },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: DATA.url },
      { property: "og:image", content: `${DATA.url}/preview.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "676" },
      { property: "og:image:alt", content: `${DATA.name} — ${DATA.jobTitle}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: DATA.twitterHandle },
      { name: "twitter:creator", content: DATA.twitterHandle },
      { name: "twitter:title", content: DATA.name },
      { name: "twitter:description", content: DATA.seoDescription },
      { name: "twitter:image", content: `${DATA.url}/preview.png` },
      {
        name: "googlebot",
        content:
          "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // NOTE: canonical is set per-route (index/blog/$slug) — TanStack flattens
      // link tags without dedup, so a root canonical would conflict with theirs.
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      { rel: "manifest", href: "/site.webmanifest" },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "Chirag Aggarwal — Blog RSS",
        href: "/feed.xml",
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ScriptOnce children={themeInitScript} />
        {/* theme-color is set statically (not via head() meta) because TanStack
            dedupes meta by name, which would collapse these two media variants. */}
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#0a0a0a"
          media="(prefers-color-scheme: dark)"
        />
        <HeadContent />
        {umamiWebsiteId ? (
          <script
            defer
            data-website-id={umamiWebsiteId}
            data-host-url={umamiHostUrl || undefined}
            src={umamiScriptSrc}
          />
        ) : null}
      </head>
      <body className="min-h-screen bg-background font-sans antialiased max-w-4xl mx-auto py-12 sm:py-24">
        <ThemeProvider attribute="class" defaultTheme="system">
          <TooltipProvider delayDuration={0}>
            {children}
            <Navbar />
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
        {import.meta.env.DEV ? (
          <TanStackDevtools
            config={{ position: "bottom-right" }}
            plugins={[
              {
                name: "TanStack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        ) : null}
        <Scripts />
      </body>
    </html>
  );
}
