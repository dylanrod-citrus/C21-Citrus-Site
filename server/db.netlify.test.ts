import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { MdmListing } from "./mdmService";

const sql = vi.fn(async () => []);
Object.assign(sql, { values: vi.fn((rows: unknown[]) => ({ rows })) });
const getDatabase = vi.fn(() => ({ sql }));

vi.mock("@netlify/database", () => ({ getDatabase }));

const originalNetlifyDbUrl = process.env.NETLIFY_DB_URL;

const listing: MdmListing = {
  listingId: "CV26077738",
  address: "100 Citrus Lane",
  city: "San Dimas",
  state: "CA",
  zip: "91773",
  price: 950000,
  beds: 3,
  baths: 2,
  sqft: 1800,
  status: "Active",
  propertyType: "Single Family",
  photoUrl: null,
  photos: [],
  listingUrl: null,
  description: null,
  agentName: null,
  agentPhone: null,
  listingDate: null,
  yearBuilt: null,
  lotSize: null,
  garageSpaces: null,
  latitude: null,
  longitude: null,
};

describe("Netlify Database cache persistence", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.NETLIFY_DB_URL = "postgresql://managed-by-netlify";
  });

  afterAll(() => {
    if (originalNetlifyDbUrl === undefined) delete process.env.NETLIFY_DB_URL;
    else process.env.NETLIFY_DB_URL = originalNetlifyDbUrl;
  });

  it("uses Netlify's tagged SQL client for batch upsert, stale cleanup, and cache metadata", async () => {
    const { replaceCachedActiveListings } = await import("./db");

    await expect(replaceCachedActiveListings([listing])).resolves.toBeUndefined();

    expect(getDatabase).toHaveBeenCalledOnce();
    expect(sql.values).toHaveBeenCalledWith([
      [listing.listingId, JSON.stringify(listing), expect.any(Date)],
    ]);
    expect(sql).toHaveBeenCalledTimes(3);

    const statements = sql.mock.calls.map(([strings]) => Array.from(strings as TemplateStringsArray).join("?"));
    expect(statements[0]).toContain('INSERT INTO "active_listing_cache"');
    expect(statements[0]).toContain('ON CONFLICT ("listingId") DO UPDATE');
    expect(statements[0]).toContain('EXCLUDED."payload"');
    expect(statements[1]).toContain('DELETE FROM "active_listing_cache"');
    expect(statements[2]).toContain('INSERT INTO "active_listing_cache_meta"');
  });
});

