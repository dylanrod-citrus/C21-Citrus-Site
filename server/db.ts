import { getDatabase, type DatabaseConnection } from "@netlify/database";
import type { InsertUser, User } from "../drizzle/schema";
import { ENV } from "./_core/env";
import type { MdmListing } from "./mdmService";

let database: DatabaseConnection | null = null;

// Netlify Database exposes a tagged-template SQL client. Use it directly in
// Functions rather than routing Drizzle's prepared-query API through the
// tagged client, which is unsupported by the serverless database driver.
export async function getDb(): Promise<DatabaseConnection | null> {
  if (!database && process.env.NETLIFY_DB_URL) {
    try {
      database = getDatabase();
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      database = null;
    }
  }

  return database;
}

type DatabaseUser = Omit<User, "createdAt" | "updatedAt" | "lastSignedIn"> & {
  createdAt: Date | string;
  updatedAt: Date | string;
  lastSignedIn: Date | string;
};

function toUser(row: DatabaseUser): User {
  return {
    ...row,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    lastSignedIn: new Date(row.lastSignedIn),
  };
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

  const shouldSetRole = user.role !== undefined || user.openId === ENV.ownerOpenId;
  const role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  const lastSignedIn = user.lastSignedIn ?? new Date();

  try {
    await db.sql`
      INSERT INTO "users" ("openId", "name", "email", "loginMethod", "role", "lastSignedIn")
      VALUES (${user.openId}, ${user.name ?? null}, ${user.email ?? null}, ${user.loginMethod ?? null}, ${role}, ${lastSignedIn})
      ON CONFLICT ("openId") DO UPDATE SET
        "name" = CASE WHEN ${user.name !== undefined} THEN EXCLUDED."name" ELSE "users"."name" END,
        "email" = CASE WHEN ${user.email !== undefined} THEN EXCLUDED."email" ELSE "users"."email" END,
        "loginMethod" = CASE WHEN ${user.loginMethod !== undefined} THEN EXCLUDED."loginMethod" ELSE "users"."loginMethod" END,
        "role" = CASE WHEN ${shouldSetRole} THEN EXCLUDED."role" ELSE "users"."role" END,
        "lastSignedIn" = EXCLUDED."lastSignedIn",
        "updatedAt" = NOW();
    `;
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const rows = await db.sql<DatabaseUser>`
    SELECT "id", "openId", "name", "email", "loginMethod", "role", "createdAt", "updatedAt", "lastSignedIn"
    FROM "users"
    WHERE "openId" = ${openId}
    LIMIT 1;
  `;
  return rows[0] ? toUser(rows[0]) : undefined;
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
    await db.sql`
      INSERT INTO "privacy_requests" ("requestType", "requesterEmail", "requesterFirstName", "requesterLastName")
      VALUES (${input.requestType}, ${input.requesterEmail}, ${input.requesterFirstName}, ${input.requesterLastName});
    `;
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
    await db.sql`
      INSERT INTO "privacy_requests" ("requestType", "source")
      VALUES ("optout", ${source});
    `;
  } catch (error) {
    console.error("[PrivacyRequest] Failed to write opt-out audit record", error);
  }
}

const ACTIVE_LISTINGS_CACHE_KEY = "active_listings";

type CacheMetadataRow = { refreshedAt: Date | string };
type CachedListingRow = { payload: string };

export async function getCachedActiveListings(): Promise<{ listings: MdmListing[]; refreshedAt: Date } | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const metadata = await db.sql<CacheMetadataRow>`
      SELECT "refreshedAt"
      FROM "active_listing_cache_meta"
      WHERE "cacheKey" = ${ACTIVE_LISTINGS_CACHE_KEY}
      LIMIT 1;
    `;
    const meta = metadata[0];
    if (!meta) return null;

    const rows = await db.sql<CachedListingRow>`SELECT "payload" FROM "active_listing_cache";`;
    const listings = rows.flatMap((row) => {
      try {
        return [JSON.parse(row.payload) as MdmListing];
      } catch {
        return [];
      }
    });
    return listings.length > 0 ? { listings, refreshedAt: new Date(meta.refreshedAt) } : null;
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
  const rows = listings.map((listing) => [listing.listingId, JSON.stringify(listing), refreshedAt]);

  try {
    for (let start = 0; start < rows.length; start += 25) {
      const batch = rows.slice(start, start + 25);
      await db.sql`
        INSERT INTO "active_listing_cache" ("listingId", "payload", "refreshedAt")
        VALUES ${db.sql.values(batch)}
        ON CONFLICT ("listingId") DO UPDATE SET
          "payload" = EXCLUDED."payload",
          "refreshedAt" = EXCLUDED."refreshedAt";
      `;
    }
    await db.sql`
      DELETE FROM "active_listing_cache"
      WHERE "refreshedAt" IS DISTINCT FROM ${refreshedAt};
    `;
    await db.sql`
      INSERT INTO "active_listing_cache_meta" ("cacheKey", "refreshedAt", "listingCount")
      VALUES (${ACTIVE_LISTINGS_CACHE_KEY}, ${refreshedAt}, ${listings.length})
      ON CONFLICT ("cacheKey") DO UPDATE SET
        "refreshedAt" = EXCLUDED."refreshedAt",
        "listingCount" = EXCLUDED."listingCount";
    `;
  } catch (error) {
    console.error("[InventoryCache] Failed to persist active listings", error);
    throw error;
  }
}
