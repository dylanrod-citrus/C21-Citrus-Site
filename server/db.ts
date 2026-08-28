import { eq, inArray, notInArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/netlify-db";
import { activeListingCache, activeListingCacheMeta, InsertUser, privacyRequests, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import type { MdmListing } from "./mdmService";

function createNetlifyDatabase() {
  return drizzle();
}

let _db: ReturnType<typeof createNetlifyDatabase> | null = null;

// Netlify Database injects NETLIFY_DB_URL and the adapter selects the optimal
// HTTP or persistent Postgres driver for its runtime. Local tooling may run
// without that variable, in which case persistence remains safely unavailable.
export async function getDb() {
  if (!_db && process.env.NETLIFY_DB_URL) {
    try {
      _db = createNetlifyDatabase();
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: { ...updateSet, updatedAt: new Date() },
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function recordPrivacyRequest(input: {
  requestType: string;
  requesterEmail: string;
  requesterFirstName: string;
  requesterLastName: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[PrivacyRequest] Audit record was not written because the database is unavailable");
    return;
  }

  try {
    await db.insert(privacyRequests).values(input);
  } catch (error) {
    console.error("[PrivacyRequest] Failed to write audit record", error);
  }
}

export async function recordPrivacyOptOut(source: "banner" | "footer" | "gpc"): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[PrivacyRequest] Opt-out audit record was not written because the database is unavailable");
    return;
  }

  try {
    await db.insert(privacyRequests).values({ requestType: "optout", source });
  } catch (error) {
    console.error("[PrivacyRequest] Failed to write opt-out audit record", error);
  }
}

const ACTIVE_LISTINGS_CACHE_KEY = "active_listings";

export async function getCachedActiveListings(): Promise<{ listings: MdmListing[]; refreshedAt: Date } | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const [meta] = await db.select().from(activeListingCacheMeta)
      .where(eq(activeListingCacheMeta.cacheKey, ACTIVE_LISTINGS_CACHE_KEY)).limit(1);
    if (!meta) return null;

    const rows = await db.select().from(activeListingCache);
    const listings = rows.flatMap((row) => {
      try {
        return [JSON.parse(row.payload) as MdmListing];
      } catch {
        return [];
      }
    });
    return listings.length > 0 ? { listings, refreshedAt: meta.refreshedAt } : null;
  } catch (error) {
    console.error("[InventoryCache] Failed to read cached listings", error);
    return null;
  }
}

export async function replaceCachedActiveListings(listings: MdmListing[]): Promise<void> {
  if (listings.length === 0) throw new Error("Refusing to replace the active listing cache with no listings");
  const db = await getDb();
  if (!db) throw new Error("Netlify Database is unavailable for the active listing cache");

  const refreshedAt = new Date();
  const listingIds = listings.map((listing) => listing.listingId);
  const rows = listings.map((listing) => ({
    listingId: listing.listingId,
    payload: JSON.stringify(listing),
    refreshedAt,
  }));

  try {
    for (let start = 0; start < rows.length; start += 25) {
      const batch = rows.slice(start, start + 25);
      await db.insert(activeListingCache).values(batch).onConflictDoUpdate({
        target: activeListingCache.listingId,
        set: {
          payload: sql`excluded."payload"`,
          refreshedAt: sql`excluded."refreshedAt"`,
        },
      });
    }
    await db.delete(activeListingCache).where(notInArray(activeListingCache.listingId, listingIds));
    await db.insert(activeListingCacheMeta).values({
      cacheKey: ACTIVE_LISTINGS_CACHE_KEY,
      refreshedAt,
      listingCount: listings.length,
    }).onConflictDoUpdate({
      target: activeListingCacheMeta.cacheKey,
      set: { refreshedAt, listingCount: listings.length },
    });
  } catch (error) {
    console.error("[InventoryCache] Failed to persist active listings", error);
    throw error;
  }
}
