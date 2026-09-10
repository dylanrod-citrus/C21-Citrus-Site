import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("homepage performance safeguards", () => {
  it("splits non-home routes and avoids attaching the legacy asset observer during first render", async () => {
    const [app, main] = await Promise.all([
      readFile(new URL("./App.tsx", import.meta.url), "utf8"),
      readFile(new URL("./main.tsx", import.meta.url), "utf8"),
    ]);

    expect(app).toContain('lazy(() => import("./pages/Agents"))');
    expect(app).toContain("<Suspense fallback={<RouteLoadingFallback />}>");
    expect(main).toContain("window.addEventListener(\"load\", schedulePortableAssetFallback");
    expect(main).toContain("requestIdleCallback(startPortableAssetFallback");
  });

  it("prioritizes the LCP hero while deferring noncritical homepage work", async () => {
    const [home, html, css] = await Promise.all([
      readFile(new URL("./pages/Home.tsx", import.meta.url), "utf8"),
      readFile(new URL("../index.html", import.meta.url), "utf8"),
      readFile(new URL("./index.css", import.meta.url), "utf8"),
    ]);

    expect(home).toContain('fetchPriority="high"');
    expect(home).toContain("useNearViewport");
    expect(home).toContain("if (!listingsNear) return;");
    expect(home).toContain("shouldLoad={testimonialsNear}");
    expect(home.indexOf("if (!shouldLoad) {")).toBeGreaterThan(home.indexOf("if (testimonials.length < 2) return;"));
    expect(html).toContain('rel="preload"');
    expect(html).toContain("c21-citrus-hero-estate.jpg");
    expect(css).toContain("content-visibility: auto");
  });
});
