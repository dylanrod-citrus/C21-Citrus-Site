import { useEffect } from "react";

/**
 * The public Google Ads account tag supplied by the C21 PPC provider. This
 * base tag is intentionally separate from a completed-form conversion event.
 */
export const GOOGLE_ADS_TAG_ID = "AW-1066815413";

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

/** Loads the approved Google Ads base tag only; no conversion event is emitted. */
export function GoogleAdsBaseTag() {
  useEffect(() => {
    installGoogleAdsBaseTag(GOOGLE_ADS_TAG_ID);
  }, []);

  return null;
}
