import { describe, expect, it } from "vitest";
import { buildInventoryLocationSuggestions, normalizeAutocompleteQuery, shouldTryGooglePlaces } from "./googlePlacesRoute";

describe("Google Places autocomplete route input", () => {
  it("normalizes city and ZIP queries", () => {
    expect(normalizeAutocompleteQuery("  San   Dimas ")).toBe("San Dimas");
    expect(normalizeAutocompleteQuery("91773")).toBe("91773");
  });

  it("rejects missing, one-character, and excessive queries", () => {
    expect(normalizeAutocompleteQuery(undefined)).toBeNull();
    expect(normalizeAutocompleteQuery("S")).toBeNull();
    expect(normalizeAutocompleteQuery("x".repeat(81))).toBeNull();
  });
});

describe("live-inventory location fallback", () => {
  const listings = [
    { city: "San Dimas", state: "CA", zip: "91773" },
    { city: "San Dimas", state: "CA", zip: "91773" },
    { city: "Los Angeles", state: "CA", zip: "90031" },
  ];

  it("returns a unique city suggestion", () => {
    expect(buildInventoryLocationSuggestions(listings, "san")).toEqual([
      { id: "inventory-city:san dimas:ca", label: "San Dimas, CA", query: "San Dimas", type: "city" },
    ]);
  });

  it("returns a unique ZIP suggestion", () => {
    expect(buildInventoryLocationSuggestions(listings, "917")).toEqual([
      { id: "inventory-zip:91773", label: "91773, San Dimas, CA", query: "91773", type: "zip" },
    ]);
  });
});

describe("Google Places quota circuit", () => {
  it("permits a provider lookup when no quota cooldown is active", () => {
    expect(shouldTryGooglePlaces(Date.now())).toBe(true);
  });
});
