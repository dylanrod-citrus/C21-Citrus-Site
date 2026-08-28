import { describe, expect, it } from "vitest";
const tokenUrl = "https://realogy.okta.com/oauth2/aus7i8b1taFyPOEGc1t7/v1/token";
const scope = "https://dataservices.eap.com/eaplistingsapi";
const liveIt = process.env.RUN_LIVE_INTEGRATION_TESTS === "true" ? it : it.skip;

describe("Anywhere MDM credentials", () => {
  liveIt("obtains a short-lived access token for the original MDM scope", async () => {
    const clientId = process.env.MDM_CLIENT_ID;
    const clientSecret = process.env.MDM_CLIENT_SECRET;
    const apiKey = process.env.MDM_API_KEY;

    expect(clientId, "MDM_CLIENT_ID must be configured").toBeTruthy();
    expect(clientSecret, "MDM_CLIENT_SECRET must be configured").toBeTruthy();
    expect(apiKey, "MDM_API_KEY must be configured").toBeTruthy();

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "client_credentials", scope }).toString(),
    });

    expect(response.status, "Anywhere MDM OAuth token request must succeed").toBe(200);
    const payload = await response.json() as { access_token?: string; expires_in?: number };
    expect(payload.access_token, "OAuth response must include an access token").toBeTruthy();
    expect(payload.expires_in, "OAuth response must include token expiry").toBeGreaterThan(0);
  }, 15_000);

});
