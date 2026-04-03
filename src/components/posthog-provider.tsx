"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize PostHog in production with a valid key
    if (typeof window === "undefined") return;

    const key = import.meta.env.VITE_POSTHOG_KEY;
    const isProduction = import.meta.env.PROD;

    if (key && isProduction) {
      posthog.init(key, {
        api_host:
          import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
        ui_host: "https://us.posthog.com",
        defaults: "2025-05-24",
        capture_exceptions: true,
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
