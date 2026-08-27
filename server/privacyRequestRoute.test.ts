import { describe, expect, it } from "vitest";
import { validatePrivacyRequest } from "./privacyRequestRoute";

const baseRequest = { requestType: "know", firstName: "Taylor", lastName: "Consumer", email: "taylor@example.com" };

describe("privacy request validation", () => {
  it("allows an opt-out request without identity verification", () => {
    expect(validatePrivacyRequest({ ...baseRequest, requestType: "optout", verified: false })).toBeNull();
  });

  it("continues to require verification for a request to know", () => {
    expect(validatePrivacyRequest({ ...baseRequest, verified: false })).toBe("Identity verification checkbox is required.");
  });

  it("requires a valid requester email for all privacy request types", () => {
    expect(validatePrivacyRequest({ ...baseRequest, requestType: "optout", email: "not-an-email", verified: false })).toBe("Invalid email address.");
  });
});
