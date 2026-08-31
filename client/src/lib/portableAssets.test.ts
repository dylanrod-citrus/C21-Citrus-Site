import { describe, expect, it } from "vitest";
import { C21_ASSET_PATHS, portableAssetFor, replacePortableAssetPath } from "./portableAssets";

describe("portable C21 assets", () => {
  it("replaces the uploaded source hero path with the stable public asset", () => {
    expect(replacePortableAssetPath("/manus-storage/hero-luxury-home_04c4fbf5.jpg")).toBe(C21_ASSET_PATHS.homeHero);
  });

  it("provides the supplied C21 wordmark for both known logo paths", () => {
    expect(portableAssetFor("/manus-storage/century21-citrus-realty-gold-logo_f3913815.png")).toBe(C21_ASSET_PATHS.logo);
    expect(portableAssetFor("/manus-storage/c21-citrus-realty-gold-logo_c9c0b17e.png")).toBe(C21_ASSET_PATHS.logo);
  });

  it("uses the user-supplied official C21 seal rather than the unrelated circular symbol", () => {
    expect(C21_ASSET_PATHS.seal).toContain("c21citrus-official-c21-seal.png");
    expect(C21_ASSET_PATHS.seal).not.toContain("c21-citrus-symbol.png");
  });

  it("uses public release assets rather than the expired session host or internal Netlify path", () => {
    const assets = Object.values(C21_ASSET_PATHS).flatMap((asset) => typeof asset === "string" ? [asset] : Object.values(asset));
    expect(assets).toEqual(expect.arrayContaining([
      expect.stringContaining("github.com/dylanrod-citrus/C21-Citrus-Site/releases/download/c21-site-assets-20260831"),
    ]));
    expect(assets).not.toContain(expect.stringContaining("files.manuscdn.com"));
    expect(assets).not.toContain(expect.stringContaining("/manus-storage/"));
  });
});
