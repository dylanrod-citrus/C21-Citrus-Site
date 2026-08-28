CREATE TYPE "user_role" AS ENUM ('user', 'admin');
CREATE TYPE "privacy_request_status" AS ENUM ('received', 'processing', 'completed', 'closed');

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "openId" VARCHAR(64) NOT NULL UNIQUE,
  "name" TEXT,
  "email" VARCHAR(320),
  "loginMethod" VARCHAR(64),
  "role" "user_role" NOT NULL DEFAULT 'user',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "lastSignedIn" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "privacy_requests" (
  "id" SERIAL PRIMARY KEY,
  "requestType" VARCHAR(32) NOT NULL,
  "requesterEmail" VARCHAR(320),
  "requesterFirstName" VARCHAR(100),
  "requesterLastName" VARCHAR(100),
  "source" VARCHAR(32) NOT NULL DEFAULT 'privacy_request',
  "status" "privacy_request_status" NOT NULL DEFAULT 'received',
  "receivedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "privacy_request_requester_email_idx" ON "privacy_requests" ("requesterEmail");
CREATE INDEX "privacy_request_status_received_idx" ON "privacy_requests" ("status", "receivedAt");
