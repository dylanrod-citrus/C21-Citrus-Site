import { describe, expect, it } from "vitest";
import { resolveConsentStatus } from "./CookieConsent";

describe("privacy consent decision", () => {
  it("honors Global Privacy Control by denying optional analytics", () => {
    expect(resolveConsentStatus("granted", true)).toBe("denied");
    expect(resolveConsentStatus(null, true)).toBe("denied");
  });

  it("preserves a visitor's explicit consent choice when no signal is present", () => {
    expect(resolveConsentStatus("granted", false)).toBe("granted");
    expect(resolveConsentStatus("denied", false)).toBe("denied");
  });
});
