import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchRealSatisfiedTestimonials } from "./realSatisfiedRoute";

describe("C21 Citrus RealSatisfied feed", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns no testimonial content when the authentic provider is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("provider unavailable", { status: 503 })));

    await expect(fetchRealSatisfiedTestimonials()).rejects.toThrow("RealSatisfied RSS responded 503");
  });
});
