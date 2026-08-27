import { describe, expect, it } from "vitest";
import { resolveContactRecipients } from "./contact";

describe("C21 Citrus contact-recipient routing", () => {
  it("preserves approved source-page overrides", () => {
    expect(resolveContactRecipients("janeth@c21citrus.com")).toEqual(["janeth@c21citrus.com"]);
    expect(resolveContactRecipients("andrew@c21citrus.com,janeth@c21citrus.com")).toEqual(["andrew@c21citrus.com", "janeth@c21citrus.com"]);
    expect(resolveContactRecipients("frontdesk@c21citrus.com")).toEqual(["frontdesk@c21citrus.com"]);
  });

  it("does not allow a visitor to send an override to arbitrary addresses", () => {
    expect(resolveContactRecipients("unknown@example.com")).not.toContain("unknown@example.com");
  });

  it("uses the securely configured default recipient list for general contact forms", () => {
    expect(resolveContactRecipients()).toContain("dylan@c21citrus.com");
  });
});
