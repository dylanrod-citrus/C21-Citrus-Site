import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("RealEstateSchool Google Ads lead conversion", () => {
  it("fires only after the Free Info Session server response succeeds", async () => {
    const source = await readFile(new URL("./RealEstateSchool.tsx", import.meta.url), "utf8");

    expect(source).toContain('import { trackGoogleAdsLeadConversion } from "../components/GoogleAdsBaseTag"');

    const successGuard = source.indexOf('if (!res.ok) throw new Error("Server error");');
    const conversion = source.indexOf("trackGoogleAdsLeadConversion();");
    const confirmation = source.indexOf("setSubmitted(true);");

    expect(successGuard).toBeGreaterThan(-1);
    expect(conversion).toBeGreaterThan(successGuard);
    expect(confirmation).toBeGreaterThan(conversion);
  });
});
