import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GOOGLE_ADS_TAG_ENV, isGoogleAdsTagId } from "./GoogleAdsBaseTag";

describe("GoogleAdsBaseTag", () => {
  it("requires an explicitly configured Google Ads tag ID", () => {
    expect(GOOGLE_ADS_TAG_ENV).toBe("VITE_GOOGLE_ADS_TAG_ID");
    expect(isGoogleAdsTagId("AW-1066815413")).toBe(true);
    expect(isGoogleAdsTagId("GTM-ABC123")).toBe(false);
    expect(isGoogleAdsTagId(undefined)).toBe(false);
  });

  it("prepares only the base tag and does not emit a conversion before the label is supplied", () => {
    const source = readFileSync(new URL("./GoogleAdsBaseTag.tsx", import.meta.url), "utf8");

    expect(source).toContain("https://www.googletagmanager.com/gtag/js?id=");
    expect(source).not.toMatch(/gtag\(\s*["']event["']\s*,\s*["']conversion["']/);
  });
});
