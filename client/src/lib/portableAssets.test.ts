import { describe, expect, it } from "vitest";
import { portableAssetFor, replacePortableAssetPath } from "./portableAssets";

describe("portable Netlify assets", () => {
  it("replaces the uploaded source hero path with a public CDN URL", () => {
    expect(replacePortableAssetPath("/manus-storage/hero-luxury-home_04c4fbf5.jpg")).toContain("files.manuscdn.com");
  });

  it("provides the supplied C21 wordmark for both known logo paths", () => {
    expect(portableAssetFor("/manus-storage/century21-citrus-realty-gold-logo_f3913815.png")).toContain("files.manuscdn.com");
    expect(portableAssetFor("/manus-storage/c21-citrus-realty-gold-logo_c9c0b17e.png")).toContain("files.manuscdn.com");
  });
});
