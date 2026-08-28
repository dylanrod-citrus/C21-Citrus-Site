import { describe, expect, it } from "vitest";

const liveIt = process.env.RUN_LIVE_INTEGRATION_TESTS === "true" ? it : it.skip;

describe("office-owned Umami tracker configuration", () => {
  liveIt("uses a configured Umami Cloud website identifier and reachable tracker script", async () => {
    const endpoint = process.env.VITE_UMAMI_ENDPOINT;
    const websiteId = process.env.VITE_UMAMI_WEBSITE_ID;

    expect(endpoint, "VITE_UMAMI_ENDPOINT must be configured").toBeTruthy();
    expect(websiteId, "VITE_UMAMI_WEBSITE_ID must be configured").toMatch(/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i);

    const response = await fetch(`${endpoint!.replace(/\/$/, "")}/script.js`, { method: "HEAD" });
    expect(response.ok, "Umami tracker script must be reachable").toBe(true);
  }, 15_000);
});
