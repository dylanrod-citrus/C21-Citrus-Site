import type { Request } from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import { allowPrivacyOptOutAttempt, resetFormSecurityRateLimitsForTest, validateEmailFormSubmission } from "./formSecurity";

const originalNodeEnv = process.env.NODE_ENV;
const originalTurnstileSecret = process.env.TURNSTILE_SECRET_KEY;

function request(body: Record<string, unknown> = {}, headers: Record<string, string> = {}): Request {
  return {
    body,
    headers: { "x-nf-client-connection-ip": "203.0.113.7", ...headers },
    ip: "203.0.113.7",
  } as unknown as Request;
}

function restoreEnvironment() {
  process.env.NODE_ENV = originalNodeEnv;
  if (originalTurnstileSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
  else process.env.TURNSTILE_SECRET_KEY = originalTurnstileSecret;
}

afterEach(() => {
  vi.unstubAllGlobals();
  resetFormSecurityRateLimitsForTest();
  restoreEnvironment();
});

describe("public email form protection", () => {
  it("rejects a missing token in production before any email route can proceed", async () => {
    process.env.NODE_ENV = "production";
    process.env.TURNSTILE_SECRET_KEY = "test-secret";

    await expect(validateEmailFormSubmission(request(), "contact")).resolves.toEqual({
      allowed: false,
      trap: false,
      status: 400,
      error: "Please complete the verification and try again.",
    });
  });

  it("accepts only a successful token issued for a configured C21 domain", async () => {
    process.env.NODE_ENV = "production";
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, hostname: "www.c21citrus.com" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(validateEmailFormSubmission(request({ turnstileToken: "dummy-token" }), "contact")).resolves.toEqual({ allowed: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("rejects a token that is not issued for a C21 production hostname", async () => {
    process.env.NODE_ENV = "production";
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, hostname: "attacker.example" }), { status: 200 })));

    await expect(validateEmailFormSubmission(request({ turnstileToken: "dummy-token" }), "privacy-request")).resolves.toMatchObject({
      allowed: false,
      error: "Please complete the verification and try again.",
    });
  });

  it("silently traps a filled honeypot without contacting the verification service", async () => {
    process.env.NODE_ENV = "production";
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(validateEmailFormSubmission(request({ website: "https://spam.example" }), "contact")).resolves.toEqual({ allowed: false, trap: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an oversized request before verification", async () => {
    process.env.NODE_ENV = "production";
    process.env.TURNSTILE_SECRET_KEY = "test-secret";

    await expect(validateEmailFormSubmission(request({}, { "content-length": String(24 * 1024 + 1) }), "contact")).resolves.toMatchObject({
      allowed: false,
      status: 413,
    });
  });

  it("throttles repeated contact attempts even during local development", async () => {
    process.env.NODE_ENV = "test";
    delete process.env.TURNSTILE_SECRET_KEY;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await expect(validateEmailFormSubmission(request(), "contact")).resolves.toEqual({ allowed: true });
    }
    await expect(validateEmailFormSubmission(request(), "contact")).resolves.toMatchObject({ allowed: false, status: 429 });
  });

  it("keeps direct privacy opt-outs accessible while limiting repeated automated writes", () => {
    for (let attempt = 0; attempt < 10; attempt += 1) expect(allowPrivacyOptOutAttempt(request())).toBe(true);
    expect(allowPrivacyOptOutAttempt(request())).toBe(false);
  });
});
