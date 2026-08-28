import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("hosted decorative asset markup", () => {
  it("does not request legacy project-scoped decorative image URLs", async () => {
    const [home, footer, school] = await Promise.all([
      readFile(new URL("./pages/Home.tsx", import.meta.url), "utf8"),
      readFile(new URL("./components/SiteComplianceFooter.tsx", import.meta.url), "utf8"),
      readFile(new URL("./pages/RealEstateSchool.tsx", import.meta.url), "utf8"),
    ]);

    expect(home).not.toContain("c21-seal-transparent_a00d7088.png");
    expect(footer).not.toContain("eho-logo_945dfdbe.png");
    expect(school).not.toContain("c21-seal-black_a202c272.png");
  });
});
