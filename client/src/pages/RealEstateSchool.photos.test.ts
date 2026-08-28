import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("RealEstateSchool staff portraits", () => {
  it("uses all supplied portable portraits in the team stories and Janeth scholarship card", async () => {
    const source = await readFile(new URL("./RealEstateSchool.tsx", import.meta.url), "utf8");

    expect(source).toContain("const SCHOOL_PORTRAITS");
    expect(source).toContain("SCHOOL_PORTRAITS.mireya");
    expect(source).toContain("SCHOOL_PORTRAITS.denise");
    expect(source).toContain("SCHOOL_PORTRAITS.michelle");
    expect(source).toContain("SCHOOL_PORTRAITS.stella");
    expect(source).toContain("SCHOOL_PORTRAITS.sharyn");
    expect(source).toContain("SCHOOL_PORTRAITS.kimberly");
    expect(source).toContain("SCHOOL_PORTRAITS.gabriela");
    expect(source).toContain("SCHOOL_PORTRAITS.aaron");
    expect(source).toContain("SCHOOL_PORTRAITS.janeth");
    expect(source).toContain('aspectRatio: "4 / 5"');
    expect(source).toContain('objectPosition: "center 32%"');
  });
});
