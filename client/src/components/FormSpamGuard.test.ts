import { describe, expect, it } from "vitest";
import { readTurnstileToken, TURNSTILE_SITE_KEY } from "./FormSpamGuard";

describe("FormSpamGuard", () => {
  it("uses the official C21 Turnstile public site key", () => {
    expect(TURNSTILE_SITE_KEY).toBe("0x4AAAAAAEjHiIqGr3Sk6b-o");
  });

  it("reads the configured response field after a completed challenge", () => {
    const data = new FormData();
    data.set("turnstileToken", "completed-token");

    expect(readTurnstileToken(data)).toBe("completed-token");
  });

  it("accepts Cloudflare's default response field while older deployments are replaced", () => {
    const data = new FormData();
    data.set("cf-turnstile-response", "completed-default-token");

    expect(readTurnstileToken(data)).toBe("completed-default-token");
  });
});
