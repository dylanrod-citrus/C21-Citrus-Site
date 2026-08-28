import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("CookieConsent disclosure", () => {
  it("uses neutral optional-analytics wording and explains necessary server logs", async () => {
    const source = await readFile(new URL("./CookieConsent.tsx", import.meta.url), "utf8");

    expect(source).toContain("optional analytics service and location-selection events off");
    expect(source).toContain("Necessary server-side");
    expect(source).toContain("logs may still be processed to operate and secure this site");
    expect(source).not.toContain("Umami and location-selection events off");
  });
});
