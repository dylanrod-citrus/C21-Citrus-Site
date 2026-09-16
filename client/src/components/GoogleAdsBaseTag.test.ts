import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  GOOGLE_ADS_LEAD_CONVERSION_DESTINATION,
  GOOGLE_ADS_TAG_ID,
  GOOGLE_TAG_MANAGER_CONTAINER_ID,
  isGoogleTagManagerContainerId,
} from "./GoogleAdsBaseTag";

describe("GoogleTagManager", () => {
  it("uses the PPC-provided GTM container and Google Ads tag ID", () => {
    expect(GOOGLE_TAG_MANAGER_CONTAINER_ID).toBe("GTM-T42K949T");
    expect(GOOGLE_ADS_TAG_ID).toBe("AW-1066815413");
    expect(isGoogleTagManagerContainerId("GTM-T42K949T")).toBe(true);
    expect(isGoogleTagManagerContainerId("AW-1066815413")).toBe(false);
    expect(isGoogleTagManagerContainerId(undefined)).toBe(false);
  });

  it("emits a server-success trigger for GTM without loading a duplicate direct Ads tag", () => {
    const source = readFileSync(new URL("./GoogleAdsBaseTag.tsx", import.meta.url), "utf8");

    expect(GOOGLE_ADS_LEAD_CONVERSION_DESTINATION).toBe("AW-1066815413/mo1kCOqUwMkZELWf2fwD");
    expect(source).toContain("https://www.googletagmanager.com/gtm.js?id=");
    expect(source).toContain('event: FREE_INFO_SESSION_CONFIRMED_EVENT');
    expect(source).toContain("google_ads_send_to: GOOGLE_ADS_LEAD_CONVERSION_DESTINATION");
    expect(source).not.toContain("gtag/js?id=");
  });
});
