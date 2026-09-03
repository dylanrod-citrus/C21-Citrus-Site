import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("CookieConsent disclosure", () => {
  it("uses neutral optional-analytics wording and accurately discloses advertising measurement", async () => {
    const source = await readFile(new URL("./CookieConsent.tsx", import.meta.url), "utf8");

    expect(source).toContain("optional analytics service off");
    expect(source).toContain("measure the\n              performance of our advertising");
    expect(source).toMatch(/Necessary server-side logs\s+and performance measurements may still be processed/);
    expect(source).not.toContain("location-selection events off");
    expect(source).not.toContain("Umami and location-selection events off");
  });
});
