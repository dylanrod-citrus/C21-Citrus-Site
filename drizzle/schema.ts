import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Data-minimized staff audit trail for privacy requests. Form narratives and
 * phone numbers are intentionally not persisted here; staff receive them by
 * secure office email as part of the existing request workflow.
 */
export const privacyRequests = mysqlTable("privacy_requests", {
  id: int("id").autoincrement().primaryKey(),
  requestType: varchar("requestType", { length: 32 }).notNull(),
  requesterEmail: varchar("requesterEmail", { length: 320 }),
  requesterFirstName: varchar("requesterFirstName", { length: 100 }),
  requesterLastName: varchar("requesterLastName", { length: 100 }),
  source: varchar("source", { length: 32 }).notNull().default("privacy_request"),
  status: mysqlEnum("status", ["received", "processing", "completed", "closed"]).default("received").notNull(),
  receivedAt: timestamp("receivedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  requesterEmailIndex: index("privacy_request_requester_email_idx").on(table.requesterEmail),
  statusReceivedIndex: index("privacy_request_status_received_idx").on(table.status, table.receivedAt),
}));

export type PrivacyRequest = typeof privacyRequests.$inferSelect;
export type InsertPrivacyRequest = typeof privacyRequests.$inferInsert;
