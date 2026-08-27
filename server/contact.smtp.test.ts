import { describe, expect, it } from "vitest";
import { verifyContactTransport } from "./contact";

describe("C21 Citrus contact SMTP configuration", () => {
  it("authenticates the configured sender mailbox without sending email", async () => {
    await expect(verifyContactTransport()).resolves.toBeUndefined();
  }, 30_000);
});
