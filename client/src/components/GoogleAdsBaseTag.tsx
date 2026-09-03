import { useEffect } from "react";

/**
 * Prepared Google Ads base-tag loader. It intentionally does not hardcode an
 * account ID and it intentionally does not emit a conversion event. A future
 * staging or production environment must explicitly set this public build
 * variable after the conversion label and disclosure treatment are approved.
 */
export const GOOGLE_ADS_TAG_ENV = "VITE_GOOGLE_ADS_TAG_ID";

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
 * Loads only the supplied Google Ads base tag. Conversion events are purposely
 * excluded until the PPC provider supplies the new conversion label and the
 * server-confirmed Get Licensed success flow is tested in staging.
 */
export function GoogleAdsBaseTag() {
  useEffect(() => {
    const tagId = import.meta.env.VITE_GOOGLE_ADS_TAG_ID?.trim();
    if (!isGoogleAdsTagId(tagId)) return;

    installGoogleAdsBaseTag(tagId);
  }, []);

  return null;
}
