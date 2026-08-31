import { describe, expect, it } from "vitest";
import { C21_ASSET_PATHS, portableAssetFor, replacePortableAssetPath } from "./portableAssets";

describe("portable Netlify assets", () => {
  it("replaces the uploaded source hero path with the stable project asset", () => {
    expect(replacePortableAssetPath("/manus-storage/hero-luxury-home_04c4fbf5.jpg")).toBe(C21_ASSET_PATHS.homeHero);
  });

  it("provides the supplied C21 wordmark for both known logo paths", () => {
    expect(portableAssetFor("/manus-storage/century21-citrus-realty-gold-logo_f3913815.png")).toBe(C21_ASSET_PATHS.logo);
    expect(portableAssetFor("/manus-storage/c21-citrus-realty-gold-logo_c9c0b17e.png")).toBe(C21_ASSET_PATHS.logo);
  });

  it("uses stable project storage rather than the expired session image host", () => {
    expect(Object.values(C21_ASSET_PATHS).flatMap((asset) => typeof asset === "string" ? [asset] : Object.values(asset))).not.toContain(expect.stringContaining("files.manuscdn.com"));
  });
});
