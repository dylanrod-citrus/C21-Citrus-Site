import { describe, expect, it } from "vitest";
import { fetchCitrusAgents, fetchCitrusRecentSales } from "./mdmService";

const tokenUrl = "https://realogy.okta.com/oauth2/aus7i8b1taFyPOEGc1t7/v1/token";
const scope = "https://dataservices.eap.com/eaplistingsapi";

describe("Anywhere MDM credentials", () => {
  it("obtains a short-lived access token for the original MDM scope", async () => {
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
  }, 30_000);

  it("returns live C21 Citrus agents and active MLS listings with property images", async () => {
    const agents = await fetchCitrusAgents();
    expect(agents.length, "MDM agent service must return the office directory").toBeGreaterThan(0);
    expect(agents[0]?.agentMasterId).toBeTruthy();

    const listings = await fetchCitrusRecentSales();
    expect(listings.length, "MLS service must return active C21 Citrus listings").toBeGreaterThan(0);
    for (const listing of listings) {
      expect(listing.listingId).toBeTruthy();
      expect(listing.status.toLowerCase()).toBe("active");
    }
    expect(
      listings.some((listing) => Boolean(listing.photoUrl) || listing.photos.length > 0),
      "MLS search must return at least one provider-backed property image"
    ).toBe(true);
  }, 90_000);
});
