import { describe, expect, it } from "vitest";
import { createC21NetlifyApi } from "./netlifyApp";

describe("Netlify API adapter", () => {
  it("creates a listener-free Express app for serverless deployment", () => {
    const app = createC21NetlifyApi();
    expect(typeof app).toBe("function");
  });
});
