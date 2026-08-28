import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("PrivacyPolicy analytics disclosure", () => {
  it("distinguishes opt-in Umami from server-side Netlify analytics", async () => {
    const source = await readFile(new URL("./PrivacyPolicy.tsx", import.meta.url), "utf8");

    expect(source).toContain("No optional browser-based analytics script is loaded");
    expect(source).toMatch(/Umami and the associated property-search\s+location event remain disabled/);
    expect(source).toContain("Hosting and Server-Side Analytics");
    expect(source).toContain("server-side request-log analytics");
    expect(source).toMatch(/does not\s+switch off Netlify’s server-side hosting analytics/);
  });
});
