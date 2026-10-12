import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const readSource = (relativePath: string) =>
  readFileSync(resolve(root, relativePath), "utf8");

describe("staging small repair batch", () => {
  it("uses the working internal MLS page for every former legacy search CTA", () => {
    const files = [
      "client/src/components/SiteNav.tsx",
      "client/src/pages/About.tsx",
      "client/src/pages/Agents.tsx",
      "client/src/pages/Careers.tsx",
      "client/src/pages/Contact.tsx",
      "client/src/pages/ContactAgent.tsx",
      "client/src/pages/Home.tsx",
      "client/src/pages/HomeBuyingProcess.tsx",
      "client/src/pages/HomeSellingProcess.tsx",
      "client/src/pages/HomeValue.tsx",
      "client/src/pages/OurListings.tsx",
    ];

    for (const file of files) {
      const source = readSource(file);
      expect(source).toContain('const idxSearchUrl = "/mls-search";');
      expect(source).not.toContain("https://c21citrus.com/search/");
    }
  });

  it("redirects the legacy search URL to the canonical MLS page", () => {
    const source = readSource("client/src/App.tsx");

    expect(source).toContain('import { Redirect, Route, Switch } from "wouter";');
    expect(source).toContain('<Route path="/search" component={() => <Redirect to="/mls-search" replace />} />');
    expect(source).toContain('<Route path="/search/" component={() => <Redirect to="/mls-search" replace />} />');
  });

  it("does not require map geocoding before city listing cards can render", () => {
    const source = readSource("client/src/pages/MLSSearch.tsx");

    expect(source).toContain("function ListingCard({ listing }: { listing: ApiListing })");
    expect(source).toContain("selectedCity ? listings.filter((listing) => listing.city === selectedCity) : []");
    expect(source).toContain("const displayCount = listings.filter((listing) => listing.city === city).length;");
  });

  it("uses a matching gold-and-black square frame for initials-only cards", () => {
    const source = readSource("client/src/pages/Agents.tsx");

    expect(source).toContain('aspectRatio: "1 / 1", minHeight: "200px", background: "var(--c21-black)"');
    expect(source).toContain('color: "var(--c21-gold)"');
    expect(source).not.toContain('height: "120px", display: "flex", alignItems: "center", justifyContent: "center"');
  });

  it("declares and publishes the approved C21 favicon set", () => {
    const documentHead = readSource("client/index.html");

    expect(documentHead).toContain('rel="icon" href="/c21-favicon-v1.png"');
    expect(documentHead).toContain('rel="alternate icon" href="/favicon.ico"');
    expect(documentHead).toContain('rel="apple-touch-icon" href="/c21-apple-touch-icon-v1.png"');
    expect(existsSync(resolve(root, "client/public/c21-favicon-v1.png"))).toBe(true);
    expect(existsSync(resolve(root, "client/public/c21-apple-touch-icon-v1.png"))).toBe(true);
    expect(existsSync(resolve(root, "client/public/favicon.ico"))).toBe(true);
  });
});
