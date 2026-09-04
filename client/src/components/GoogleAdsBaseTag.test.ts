import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  GOOGLE_ADS_LEAD_CONVERSION_DESTINATION,
  GOOGLE_ADS_TAG_ID,
  isGoogleAdsTagId,
} from "./GoogleAdsBaseTag";

describe("GoogleAdsBaseTag", () => {
  it("uses the public Google Ads tag ID supplied by the PPC provider", () => {
    expect(GOOGLE_ADS_TAG_ID).toBe("AW-1066815413");
    expect(isGoogleAdsTagId("AW-1066815413")).toBe(true);
    expect(isGoogleAdsTagId("GTM-ABC123")).toBe(false);
    expect(isGoogleAdsTagId(undefined)).toBe(false);
  });

  it("keeps the PPC provider's base tag and lead-conversion destination distinct", () => {
    const source = readFileSync(new URL("./GoogleAdsBaseTag.tsx", import.meta.url), "utf8");

    expect(GOOGLE_ADS_LEAD_CONVERSION_DESTINATION).toBe("AW-1066815413/A3eGCMLtl-wCELWf2fwD");
    expect(source).toContain("https://www.googletagmanager.com/gtag/js?id=");
    expect(source).toMatch(/gtag\(\s*["']event["']\s*,\s*["']conversion["']/);
    expect(source).toContain("send_to: GOOGLE_ADS_LEAD_CONVERSION_DESTINATION");
  });
});
