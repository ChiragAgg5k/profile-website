import Navbar from "@/components/navbar";
import { PostHogProvider } from "@/components/posthog-provider";
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

const themeInitScript = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='system')?stored:'light';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='system'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: DATA.name },
      {
        name: "description",
        content: `${DATA.description} | ${DATA.summary}`,
      },
      {
        name: "keywords",
        content:
          "software engineer, web developer, full stack developer, frontend developer, React developer, TypeScript, TanStack Start, portfolio, software development, programming",
      },
      { name: "author", content: DATA.name },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: DATA.name },
      { property: "og:description", content: DATA.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: DATA.url },
      { property: "og:site_name", content: `${DATA.name}'s Portfolio` },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: `${DATA.url}/preview.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: DATA.name },
      { name: "twitter:image", content: `${DATA.url}/preview.png` },
      {
        name: "googlebot",
        content:
          "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: DATA.url },
      { rel: "icon", href: "/me.png" },
      { rel: "apple-touch-icon", href: "/me.png" },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ScriptOnce children={themeInitScript} />
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased max-w-4xl mx-auto py-12 sm:py-24">
        <PostHogProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <TooltipProvider delayDuration={0}>
              {children}
              <Navbar />
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </PostHogProvider>
        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
