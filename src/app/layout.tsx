import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/theme-provider"
import { TRPCReactProvider } from "@/trpc/react";
import React from 'react';

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
          >
          {children}
          </ThemeProvider>
          </TRPCReactProvider>
      </body>
    </html>
  );
}
