import { Analytics, Client, Tracking } from "appwrite";

const endpoint = "https://sgp.cloud.appwrite.io/v1";
const project = "chirag-project-prod";
const property = "6ac8de220001e9d5753e";

export const TrackingEvent = {
  CodeCopied: "code_copied",
  ContactFormSubmitted: "contact_form_submitted",
  ThemeChanged: "theme_changed",
} as const;

export type TrackingEvent = (typeof TrackingEvent)[keyof typeof TrackingEvent];

let tracking: Tracking | undefined;

// The site is prerendered, so the tracker only exists once we are in a browser.
function getTracking(): Tracking | undefined {
  if (typeof window === "undefined") return undefined;
  if (!tracking) {
    const client = new Client().setEndpoint(endpoint).setProject(project);
    tracking = new Tracking(new Analytics(client), property);
  }
  return tracking;
}

// Pageviews follow TanStack Router's pushState navigation automatically.
export function startTracking(): void {
  const instance = getTracking();
  instance?.start();
  instance?.enableAutoDownloadTracking({ extensions: ["pdf"] });
}

export function track(
  event: TrackingEvent,
  props?: Record<string, unknown>,
): void {
  getTracking()?.track(event, props ? { props } : undefined);
}
