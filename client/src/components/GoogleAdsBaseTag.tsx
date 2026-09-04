import { useEffect } from "react";

/**
 * The public Google Ads account tag supplied by the C21 PPC provider. This
 * base tag is intentionally separate from a completed-form conversion event.
 */
export const GOOGLE_ADS_TAG_ID = "AW-1066815413";
export const GOOGLE_ADS_LEAD_CONVERSION_DESTINATION =
  "AW-1066815413/A3eGCMLtl-wCELWf2fwD";

type GoogleAdsWindow = Window & {
  dataLayer?: unknown[][];
  gtag?: (...args: unknown[]) => void;
};

export function isGoogleAdsTagId(value: string | undefined): value is string {
  return /^AW-\d+$/.test(value?.trim() ?? "");
}

function installGoogleAdsBaseTag(tagId: string): void {
  const googleWindow = window as GoogleAdsWindow;
  const existing = document.querySelector(`script[data-google-ads-tag="${tagId}"]`);

  if (existing) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tagId)}`;
  script.dataset.googleAdsTag = tagId;
  document.head.appendChild(script);

  googleWindow.dataLayer ??= [];
  googleWindow.gtag ??= (...args: unknown[]) => {
    googleWindow.dataLayer?.push(args);
  };
  googleWindow.gtag("js", new Date());
  googleWindow.gtag("config", tagId);
}

/**
 * Reports the PPC team's lead conversion only after the calling form has
 * received a successful response from the C21 server. The base-tag component
 * creates the queueing `gtag` function before this helper can run.
 */
export function trackGoogleAdsLeadConversion(): void {
  const googleWindow = window as GoogleAdsWindow;

  if (typeof googleWindow.gtag !== "function") return;

  googleWindow.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_LEAD_CONVERSION_DESTINATION,
  });
}

/** Loads the approved Google Ads base tag across the public website. */
export function GoogleAdsBaseTag() {
  useEffect(() => {
    installGoogleAdsBaseTag(GOOGLE_ADS_TAG_ID);
  }, []);

  return null;
}
