import { describe, expect, it } from "vitest";

describe("Cloudflare Turnstile public widget key", () => {
  it("loads the Cloudflare widget endpoint using the configured site key", async () => {
    const siteKey = process.env.VITE_TURNSTILE_SITE_KEY;

    expect(siteKey).toMatch(/^0x4[A-Za-z0-9_-]{18,}$/);

    const response = await fetch(
      `https://challenges.cloudflare.com/turnstile/v0/api.js?render=${encodeURIComponent(siteKey!)}`,
    );

    expect(response.ok).toBe(true);
    expect(response.headers.get("content-type")).toContain("javascript");
  }, 15_000);
});
