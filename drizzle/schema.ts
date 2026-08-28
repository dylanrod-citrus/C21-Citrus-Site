import { index, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Core user table backing the existing session flow.
 */
export const userRole = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Data-minimized staff audit trail for privacy requests. Form narratives and
 * phone numbers remain in the secure office email workflow rather than here.
 */
export const privacyRequestStatus = pgEnum("privacy_request_status", ["received", "processing", "completed", "closed"]);

export const privacyRequests = pgTable("privacy_requests", {
  id: serial("id").primaryKey(),
  requestType: varchar("requestType", { length: 32 }).notNull(),
  requesterEmail: varchar("requesterEmail", { length: 320 }),
  requesterFirstName: varchar("requesterFirstName", { length: 100 }),
  requesterLastName: varchar("requesterLastName", { length: 100 }),
  source: varchar("source", { length: 32 }).notNull().default("privacy_request"),
  status: privacyRequestStatus("status").default("received").notNull(),
  receivedAt: timestamp("receivedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  requesterEmailIndex: index("privacy_request_requester_email_idx").on(table.requesterEmail),
  statusReceivedIndex: index("privacy_request_status_received_idx").on(table.status, table.receivedAt),
}));

export type PrivacyRequest = typeof privacyRequests.$inferSelect;
export type InsertPrivacyRequest = typeof privacyRequests.$inferInsert;

/**
 * Current provider-backed inventory only. This cache prevents a newly started
 * serverless function from making a full provider traversal before responding
 * to a visitor. It contains no visitor or search-query data.
 */
export const activeListingCache = pgTable("active_listing_cache", {
  listingId: varchar("listingId", { length: 64 }).primaryKey(),
  payload: text("payload").notNull(),
  refreshedAt: timestamp("refreshedAt").defaultNow().notNull(),
});

export const activeListingCacheMeta = pgTable("active_listing_cache_meta", {
  cacheKey: varchar("cacheKey", { length: 64 }).primaryKey(),
  refreshedAt: timestamp("refreshedAt").defaultNow().notNull(),
  listingCount: integer("listingCount").notNull(),
});
