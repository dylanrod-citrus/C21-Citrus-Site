import { describe, expect, it } from "vitest";
import { fetchRealSatisfiedTestimonials } from "./realSatisfiedRoute";

describe("C21 Citrus RealSatisfied feed", () => {
  it("returns authentic office testimonials from the configured public feed", async () => {
    const testimonials = await fetchRealSatisfiedTestimonials();
    expect(testimonials.length).toBeGreaterThan(0);
    expect(testimonials.every((testimonial) => testimonial.quote.length > 10 && Boolean(testimonial.author))).toBe(true);
  }, 20_000);
});
