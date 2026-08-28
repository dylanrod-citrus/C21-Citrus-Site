import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("active listing cache Postgres upsert", () => {
  it("uses incoming excluded values for refreshed provider payloads", async () => {
    const source = await readFile(new URL("./db.ts", import.meta.url), "utf8");

    expect(source).toContain('payload: sql`excluded."payload"`');
    expect(source).toContain('refreshedAt: sql`excluded."refreshedAt"`');
    expect(source).not.toContain("payload: activeListingCache.payload");
  });
});
