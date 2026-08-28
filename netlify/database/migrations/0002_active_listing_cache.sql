CREATE TABLE "active_listing_cache" (
  "listingId" VARCHAR(64) PRIMARY KEY,
  "payload" TEXT NOT NULL,
  "refreshedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "active_listing_cache_meta" (
  "cacheKey" VARCHAR(64) PRIMARY KEY,
  "refreshedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "listingCount" INTEGER NOT NULL
);
