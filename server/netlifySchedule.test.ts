import { describe, expect, it } from "vitest";
import { config } from "../netlify/functions/refresh-inventory";

describe("Netlify inventory schedule", () => {
  it("refreshes the provider-backed inventory every fifteen minutes", () => {
    expect(config.schedule).toBe("*/15 * * * *");
  });
});
