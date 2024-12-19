import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  icons: {
    icon: "/me.jpg",
    apple: "/me.jpg",
  },
  title: {
    default: `${DATA.name} | Engineering Intern @Appwrite`,
    template: `%s | ${DATA.name}`,
  },
  description: `${DATA.description} | ${DATA.summary}`,
  keywords:
    "software engineer, web developer, full stack developer, frontend developer, React developer, TypeScript, Next.js, portfolio, software development, programming",
  authors: [
    {
      name: "Chirag Aggarwal",
    },
  ],
  openGraph: {
    title: `${DATA.name}`,
    description: DATA.description,
    images: ["/previews/preview-1200-630.png"],
    url: "https://www.chiragaggarwal.tech",
    siteName: `${DATA.name}'s Portfolio`,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${DATA.name}`,
    card: "summary_large_image",
    images: [`${DATA.url}/previews/preview-1200-630.png`],
  },
  alternates: {
    canonical: `${DATA.url}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased max-w-4xl mx-auto py-12 sm:py-24",
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider delayDuration={0}>
            {children}
            <Navbar />
            <Analytics />
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
