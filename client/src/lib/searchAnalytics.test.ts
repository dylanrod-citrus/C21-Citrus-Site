import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ hasAnalyticsConsent: vi.fn() }));
vi.mock("@/components/CookieConsent", () => ({ hasAnalyticsConsent: mocks.hasAnalyticsConsent }));

import { trackSelectedLocation } from "./searchAnalytics";

afterEach(() => vi.unstubAllGlobals());

describe("location search analytics", () => {
  it("does not send an event without optional analytics consent", () => {
    mocks.hasAnalyticsConsent.mockReturnValue(false);
    const track = vi.fn();
    vi.stubGlobal("window", { umami: { track } });

    expect(trackSelectedLocation({ id: "city-san-dimas", label: "San Dimas, CA", query: "San Dimas", type: "city" })).toBe(false);
    expect(track).not.toHaveBeenCalled();
  });

  it("sends only a completed selected city or ZIP after consent", () => {
    mocks.hasAnalyticsConsent.mockReturnValue(true);
    const track = vi.fn();
    vi.stubGlobal("window", { umami: { track } });

    expect(trackSelectedLocation({ id: "zip-91773", label: "91773, San Dimas, CA", query: "91773", type: "zip" })).toBe(true);
    expect(track).toHaveBeenCalledWith("property_search_location", { location: "91773", location_type: "zip" });
  });
});
