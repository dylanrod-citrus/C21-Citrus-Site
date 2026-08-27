import type { LocationSuggestion } from "@shared/locationSearch";
import { hasAnalyticsConsent } from "@/components/CookieConsent";

declare global {
  interface Window {
    umami?: { track?: (eventName: string, eventData?: Record<string, string>) => void };
  }
}

/**
 * Sends only a completed city or ZIP selection after the visitor opts in to
 * optional analytics. Raw keystrokes, IP addresses, and visitor identifiers
 * are deliberately not added by this application.
 */
export function trackSelectedLocation(suggestion: LocationSuggestion): boolean {
  if (!hasAnalyticsConsent() || typeof window === "undefined" || typeof window.umami?.track !== "function") {
    return false;
  }

  window.umami.track("property_search_location", {
    location: suggestion.query,
    location_type: suggestion.type,
  });
  return true;
}
