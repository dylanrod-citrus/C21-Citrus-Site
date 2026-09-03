import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GOOGLE_ADS_TAG_ID, isGoogleAdsTagId } from "./GoogleAdsBaseTag";

describe("GoogleAdsBaseTag", () => {
  it("uses the public Google Ads tag ID supplied by the PPC provider", () => {
    expect(GOOGLE_ADS_TAG_ID).toBe("AW-1066815413");
    expect(isGoogleAdsTagId("AW-1066815413")).toBe(true);
    expect(isGoogleAdsTagId("GTM-ABC123")).toBe(false);
    expect(isGoogleAdsTagId(undefined)).toBe(false);
  });

  it("loads only the base tag and does not emit a conversion before the label is supplied", () => {
    const source = readFileSync(new URL("./GoogleAdsBaseTag.tsx", import.meta.url), "utf8");

    expect(source).toContain("https://www.googletagmanager.com/gtag/js?id=");
    expect(source).not.toMatch(/gtag\(\s*["']event["']\s*,\s*["']conversion["']/);
  });
});
