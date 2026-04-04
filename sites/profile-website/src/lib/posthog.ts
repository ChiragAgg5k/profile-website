import { PostHog } from "posthog-node";

export default function PostHogClient() {
  const posthogClient = new PostHog(process.env.VITE_POSTHOG_KEY!, {
    host: process.env.VITE_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}
