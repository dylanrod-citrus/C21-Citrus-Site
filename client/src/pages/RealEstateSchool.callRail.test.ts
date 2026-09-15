import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("RealEstateSchool CallRail integration", () => {
  it("loads the PPC-supplied number-swapping script only from the Real Estate School route", async () => {
    const source = await readFile(new URL("./RealEstateSchool.tsx", import.meta.url), "utf8");

    expect(source).toContain(
      "https://cdn.callrail.com/companies/381101348/7855ac739bfadfa56926/12/swap.js",
    );
    expect(source).toContain("function CallRailRealEstateSchoolTracking()");
    expect(source).toContain('script.dataset.callrailC21RealEstateSchool = "true"');
    expect(source).toContain("document.body.appendChild(script)");
    expect(source).toContain("<CallRailRealEstateSchoolTracking />");
  });
});
