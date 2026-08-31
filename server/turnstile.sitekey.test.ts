import { describe, expect, it } from "vitest";
import { TURNSTILE_SITE_KEY } from "../client/src/components/FormSpamGuard";

describe("Cloudflare Turnstile public widget key", () => {
  it("keeps the public site key in the browser widget while retaining server-only secret verification", async () => {
    expect(TURNSTILE_SITE_KEY).toMatch(/^0x4[A-Za-z0-9_-]{18,}$/);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
    );

    expect(response.ok).toBe(true);
    expect(response.headers.get("content-type")).toContain("javascript");
  }, 15_000);
});
