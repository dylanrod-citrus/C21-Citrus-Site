export interface LocationSuggestion {
  id: string;
  label: string;
  query: string;
  type: "city" | "zip";
}

export interface GooglePlacePrediction {
  description: string;
  place_id: string;
  types: string[];
  structured_formatting?: { main_text?: string };
}

export function normalizeLocationSuggestions(
  predictions: GooglePlacePrediction[],
): LocationSuggestion[] {
  return predictions.flatMap((prediction) => {
    const isPostalCode = prediction.types.includes("postal_code");
    const isCity = prediction.types.includes("locality");
    if (!isPostalCode && !isCity) return [];

    const label = prediction.description.replace(/,\s*USA$/i, "").trim();
    const primaryText = prediction.structured_formatting?.main_text?.trim() || label.split(",")[0]?.trim() || label;
    const zipMatch = label.match(/\b\d{5}(?:-\d{4})?\b/);

    return [{
      id: prediction.place_id,
      label,
      query: isPostalCode ? (zipMatch?.[0].slice(0, 5) || primaryText) : primaryText,
      type: isPostalCode ? "zip" : "city",
    }];
  });
}
