import { type Express, Router } from "express";
import { normalizeLocationSuggestions, type GooglePlacePrediction, type LocationSuggestion } from "@shared/locationSearch";
import { makeRequest } from "./_core/map";
import { getActiveListings } from "./mdmRoute";

interface GoogleAutocompleteResponse {
  predictions?: GooglePlacePrediction[];
  status?: string;
  error_message?: string;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { expiresAt: number; suggestions: LocationSuggestion[] }>();

export function buildInventoryLocationSuggestions(
  listings: Array<{ city?: string | null; state?: string | null; zip?: string | null }>,
  query: string,
): LocationSuggestion[] {
  const needle = query.toLowerCase();
  const looksLikeZip = /^\d/.test(query);
  const seen = new Set<string>();

  return listings.flatMap((listing) => {
    const city = listing.city?.trim();
    const state = listing.state?.trim() || "CA";
    const zip = listing.zip?.trim();
    if (!city || !zip) return [];
    if (!city.toLowerCase().includes(needle) && !zip.startsWith(query)) return [];

    const type = looksLikeZip || zip.startsWith(query) ? "zip" as const : "city" as const;
    const key = type === "zip" ? `zip:${zip}` : `city:${city.toLowerCase()}:${state.toLowerCase()}`;
    if (seen.has(key)) return [];
    seen.add(key);

    return [{
      id: `inventory-${key}`,
      label: type === "zip" ? `${zip}, ${city}, ${state}` : `${city}, ${state}`,
      query: type === "zip" ? zip : city,
      type,
    }];
  }).slice(0, 5);
}

export function normalizeAutocompleteQuery(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const query = value.trim().replace(/\s+/g, " ");
  if (query.length < 2 || query.length > 80) return null;
  return query;
}

export function registerGooglePlacesRoutes(app: Express): void {
  const router = Router();

  router.get("/api/maps/autocomplete", async (req, res) => {
    const query = normalizeAutocompleteQuery(req.query.q);
    if (!query) return res.status(400).json({ error: "Enter at least two characters." });

    const cacheKey = query.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return res.json({ suggestions: cached.suggestions, provider: "cache" });
    }

    try {
      const response = await makeRequest<GoogleAutocompleteResponse>("/maps/api/place/autocomplete/json", {
        input: query,
        components: "country:us",
        types: "(regions)",
        location: "34.08,-117.85",
        radius: 250000,
        language: "en",
      });

      if (response.status && response.status !== "OK" && response.status !== "ZERO_RESULTS") {
        throw new Error(`Places autocomplete returned ${response.status}`);
      }

      const suggestions = normalizeLocationSuggestions(response.predictions || []).slice(0, 5);
      cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, suggestions });
      return res.json({ suggestions, provider: "google" });
    } catch (error) {
      console.warn("[Google Places] Autocomplete unavailable", error instanceof Error ? error.message : error);
      try {
        const listings = await getActiveListings();
        const suggestions = buildInventoryLocationSuggestions(listings, query);
        cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, suggestions });
        return res.json({ suggestions, provider: "inventory" });
      } catch {
        return res.status(503).json({ error: "Location suggestions are temporarily unavailable.", suggestions: [] });
      }
    }
  });

  app.use(router);
}
