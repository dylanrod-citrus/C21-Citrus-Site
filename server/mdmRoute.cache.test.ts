import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { MdmListing } from "./mdmService";

const getCachedActiveListings = vi.fn();
const replaceCachedActiveListings = vi.fn();
const fetchCitrusRecentSales = vi.fn();

vi.mock("./db", () => ({ getCachedActiveListings, replaceCachedActiveListings }));
vi.mock("./mdmService", () => ({ fetchCitrusAgents: vi.fn(), fetchCitrusRecentSales }));

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

describe("Netlify active listing cache", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.NETLIFY_DB_URL = "postgresql://managed-by-netlify";
  });

  afterAll(() => {
    if (originalNetlifyDbUrl === undefined) delete process.env.NETLIFY_DB_URL;
    else process.env.NETLIFY_DB_URL = originalNetlifyDbUrl;
  });

  it("returns persisted inventory without traversing the MDM provider", async () => {
    getCachedActiveListings.mockResolvedValue({ listings: [listing], refreshedAt: new Date() });
    const { getActiveListings } = await import("./mdmRoute");

    await expect(getActiveListings()).resolves.toEqual([listing]);
    expect(fetchCitrusRecentSales).not.toHaveBeenCalled();
  });

  it("refuses an unprimed Netlify request without traversing the MDM provider", async () => {
    getCachedActiveListings.mockResolvedValue(null);
    const { getActiveListings } = await import("./mdmRoute");

    await expect(getActiveListings()).rejects.toThrow("Active listing cache is not ready");
    expect(fetchCitrusRecentSales).not.toHaveBeenCalled();
  });

  it("persists current provider inventory when the scheduled refresh runs", async () => {
    fetchCitrusRecentSales.mockResolvedValue([listing]);
    const { refreshActiveListingCache } = await import("./mdmRoute");

    await expect(refreshActiveListingCache()).resolves.toMatchObject({ listingCount: 1 });
    expect(replaceCachedActiveListings).toHaveBeenCalledWith([listing]);
  });
});
