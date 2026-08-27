import { describe, expect, it } from "vitest";
import { normalizeLocationSuggestions, type GooglePlacePrediction } from "./locationSearch";

function suggestion(input: {
  placeId: string;
  label: string;
  mainText: string;
  types: string[];
}): GooglePlacePrediction {
  return {
    place_id: input.placeId,
    description: input.label,
    structured_formatting: { main_text: input.mainText },
    types: input.types,
  };
}

describe("Google location suggestion normalization", () => {
  it("uses a city name as the live MLS search query", () => {
    const result = normalizeLocationSuggestions([
      suggestion({ placeId: "city-1", label: "San Dimas, CA, USA", mainText: "San Dimas", types: ["locality", "political"] }),
    ]);
    expect(result).toEqual([{ id: "city-1", label: "San Dimas, CA", query: "San Dimas", type: "city" }]);
  });

  it("extracts a five-digit ZIP code for the live MLS search query", () => {
    const result = normalizeLocationSuggestions([
      suggestion({ placeId: "zip-1", label: "91773, San Dimas, CA, USA", mainText: "91773", types: ["postal_code"] }),
    ]);
    expect(result[0]).toMatchObject({ label: "91773, San Dimas, CA", query: "91773", type: "zip" });
  });

  it("ignores non-city and non-postal suggestions", () => {
    const result = normalizeLocationSuggestions([
      suggestion({ placeId: "poi-1", label: "Citrus Plaza, CA, USA", mainText: "Citrus Plaza", types: ["shopping_mall"] }),
    ]);
    expect(result).toEqual([]);
  });
});
