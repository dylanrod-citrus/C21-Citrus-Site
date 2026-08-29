import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("CookieConsent disclosure", () => {
  it("uses neutral optional-analytics wording and explains necessary logs and performance measurement", async () => {
    const source = await readFile(new URL("./CookieConsent.tsx", import.meta.url), "utf8");

    expect(source).toContain("optional analytics service off");
    expect(source).toContain("Necessary server-side");
    expect(source).toContain("Necessary server-side logs and performance measurements");
    expect(source).toMatch(/may still be processed to\s+operate, secure, and improve this site/);
    expect(source).not.toContain("location-selection events off");
    expect(source).not.toContain("Umami and location-selection events off");
  });
});
