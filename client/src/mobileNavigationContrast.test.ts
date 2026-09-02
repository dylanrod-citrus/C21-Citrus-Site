import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("mobile navigation contrast", () => {
  it("keeps every mobile drawer link readable before interaction", () => {
    expect(stylesheet).toContain(".c21-mobile-nav-links a {");
    expect(stylesheet).toContain("color: rgba(255,255,255,0.92);");
    expect(stylesheet).toContain("border-bottom: 1px solid rgba(255,255,255,0.72);");
  });

  it("keeps interactive and active mobile links visibly distinguishable", () => {
    expect(stylesheet).toContain(".c21-mobile-nav-links a:focus-visible");
    expect(stylesheet).toContain(".c21-mobile-nav-links a.active");
    expect(stylesheet).toContain("outline: 2px solid var(--c21-gold);");
  });
});
