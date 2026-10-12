import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Agents illustrated portraits", () => {
  it("uses the planned durable release pattern and preserves a source-headshot fallback", () => {
    const source = readFileSync(new URL("./Agents.tsx", import.meta.url), "utf8");

    expect(source).toContain("c21-agent-portraits-20260915");
    expect(source).toContain("agent-portrait-${portraitSlug(agent.displayName)}-${agent.agentMasterId.slice(-8)}.webp");
    expect(source).toContain("/__c21-agent-portraits/${filename}");
    expect(source).toContain('data-original-photo={agent.photoUrl}');
    expect(source).toContain('image.src = originalPhoto');
    expect(source).toContain('loading="lazy"');
    expect(source).toContain('decoding="async"');
    expect(source).toContain('aspectRatio: "1 / 1"');
  });
});
