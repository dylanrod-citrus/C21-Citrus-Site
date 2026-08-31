import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("public asset release guard", () => {
  it("runs after every production build and protects active browser source", async () => {
    const [packageJson, guard] = await Promise.all([
      readFile(new URL("../../package.json", import.meta.url), "utf8"),
      readFile(new URL("../../scripts/verify-public-assets.mjs", import.meta.url), "utf8"),
    ]);

    expect(packageJson).toContain("pnpm verify:public-assets");
    expect(guard).toContain("session_file");
    expect(guard).toContain('path.join(projectRoot, "dist", "public")');
    expect(guard).toContain("skipTests: true");
  });
});
