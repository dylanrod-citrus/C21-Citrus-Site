import { useEffect } from "react";

/**
 * PPC-provided GTM container. Google Ads and CallRail configuration now live
 * in this container, rather than as duplicate direct browser tags.
 */
export const GOOGLE_TAG_MANAGER_CONTAINER_ID = "GTM-T42K949T";
export const GOOGLE_ADS_TAG_ID = "AW-1066815413";
export const GOOGLE_ADS_LEAD_CONVERSION_DESTINATION =
  "AW-1066815413/mo1kCOqUwMkZELWf2fwD";
export const FREE_INFO_SESSION_CONFIRMED_EVENT = "c21_free_info_session_confirmed";

type GoogleTagManagerWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

export function isGoogleTagManagerContainerId(value: string | undefined): value is string {
  return /^GTM-[A-Z0-9]+$/.test(value?.trim() ?? "");
}

function getDataLayer(): Array<Record<string, unknown>> {
  const googleWindow = window as GoogleTagManagerWindow;
  googleWindow.dataLayer ??= [];
  return googleWindow.dataLayer;
}

function installGoogleTagManager(containerId: string): void {
  const existing = document.querySelector(`script[data-google-tag-manager="${containerId}"]`);
  if (existing) return;

  getDataLayer().push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;
  script.dataset.googleTagManager = containerId;
  document.head.appendChild(script);
}

/**
 * Gives PPC a deterministic GTM trigger only after the C21 server accepts a
 * Free Info Session request. The GTM container owns the corresponding Google
 * Ads conversion tag and destination, preventing a duplicate direct hit.
 */
export function trackGtmConfirmedLead(): void {
  getDataLayer().push({
    event: FREE_INFO_SESSION_CONFIRMED_EVENT,
    google_ads_send_to: GOOGLE_ADS_LEAD_CONVERSION_DESTINATION,
    lead_form: "free_info_session",
  });
}

/** Loads the PPC-provided Google Tag Manager container once across the site. */
export function GoogleTagManager() {
  useEffect(() => {
    installGoogleTagManager(GOOGLE_TAG_MANAGER_CONTAINER_ID);
  }, []);

  return null;
}
