/** Public REST routes preserved for the uploaded C21 Citrus frontend. */
import type { Express, Request, Response } from "express";
import { fetchCitrusAgents, fetchCitrusRecentSales } from "./mdmService";

interface CacheEntry<T> { data: T; cachedAt: number; }
const agentTtl = 15 * 60 * 1_000;
const listingsTtl = 30 * 60 * 1_000;
let agentCache: CacheEntry<Awaited<ReturnType<typeof fetchCitrusAgents>>> | null = null;
let listingCache: CacheEntry<Awaited<ReturnType<typeof fetchCitrusRecentSales>>> | null = null;
let listingFetch: Promise<Awaited<ReturnType<typeof fetchCitrusRecentSales>>> | null = null;

function apiError(res: Response, error: unknown, fallback: string) {
  console.error("[MDM]", error);
  return res.status(502).json({ error: fallback });
}

async function getActiveListings(): Promise<Awaited<ReturnType<typeof fetchCitrusRecentSales>>> {
  if (listingCache && Date.now() - listingCache.cachedAt < listingsTtl) return listingCache.data;
  if (!listingFetch) {
    listingFetch = fetchCitrusRecentSales()
      .then((listings) => {
        listingCache = { data: listings, cachedAt: Date.now() };
        return listings;
      })
      .finally(() => { listingFetch = null; });
  }
  return listingFetch;
}

export function registerMdmRoutes(app: Express): void {
  // Warm the source inventory after startup. This is intentionally non-blocking:
  // API routes remain available while the first refresh is in progress.
  void getActiveListings().catch((error) => console.warn("[MDM] initial listing warm-up failed", error));

  app.get("/api/mdm/agents", async (req: Request, res: Response) => {
    try {
      if (req.query.bust) agentCache = null;
      if (agentCache && Date.now() - agentCache.cachedAt < agentTtl) return res.json({ agents: agentCache.data, cached: true });
      const agents = await fetchCitrusAgents();
      agentCache = { data: agents, cachedAt: Date.now() };
      return res.json({ agents, cached: false });
    } catch (error) { return apiError(res, error, "Failed to fetch agents"); }
  });

  const recentSales = async (_req: Request, res: Response) => {
    try {
      if (listingCache && Date.now() - listingCache.cachedAt < listingsTtl) return res.json({ listings: listingCache.data, cached: true });
      const listings = await getActiveListings();
      return res.json({ listings, cached: false });
    } catch (error) { return apiError(res, error, "Failed to fetch listings"); }
  };
  app.get("/api/mdm/recent-sales", recentSales);
  app.get("/api/mdm/listings", recentSales);

  app.get("/api/mdm/listing/:mlsId", async (req: Request, res: Response) => {
    try {
      const listings = await getActiveListings();
      const listing = listings.find((item) => item.listingId === req.params.mlsId);
      return listing ? res.json({ listing }) : res.status(404).json({ error: "Listing not found" });
    } catch (error) { return apiError(res, error, "Failed to fetch listing"); }
  });

  app.get("/api/mdm/search", async (req: Request, res: Response) => {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (!query) return res.json({ listings: [], query: "" });
    try {
      const activeListings = await getActiveListings();
      const normalized = query.toLowerCase();
      const listings = activeListings.filter((listing) =>
        listing.address.toLowerCase().includes(normalized) ||
        listing.city.toLowerCase().includes(normalized) ||
        listing.zip.toLowerCase().includes(normalized) ||
        listing.listingId.toLowerCase().includes(normalized)
      );
      return res.json({ listings: listings.slice(0, 20), query });
    } catch (error) { return apiError(res, error, "Search failed"); }
  });
}
