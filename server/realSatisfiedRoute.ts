import { Router, type Request, type Response } from "express";

export interface RealSatisfiedTestimonial {
  id: string;
  quote: string;
  author: string;
  agentName: string | null;
  rating: number | null;
  date: string | null;
  profileUrl: string | null;
}

interface CacheEntry { data: RealSatisfiedTestimonial[]; fetchedAt: number; }
let cache: CacheEntry | null = null;
const cacheTtl = 60 * 60 * 1_000;
const officeVanityKey = process.env.REALSATISFIED_VANITY_KEY || "Century-21-Citrus-Realty";

function extractTag(xml: string, tag: string): string | null {
  const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, "i");
  const standard = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  return xml.match(cdata)?.[1]?.trim() ?? xml.match(standard)?.[1]?.trim() ?? null;
}

function decode(value: string): string {
  return value.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}

export function parseRealSatisfiedFeed(xml: string): RealSatisfiedTestimonial[] {
  const testimonials: RealSatisfiedTestimonial[] = [];
  const expression = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = expression.exec(xml)) !== null) {
    const item = match[1];
    const quote = decode(extractTag(item, "description") ?? "");
    if (quote.length > 10) {
      const published = extractTag(item, "pubDate");
      const ratingValue = extractTag(item, "rs:overallRating") ?? extractTag(item, "overallRating") ?? extractTag(item, "rating");
      testimonials.push({
        id: extractTag(item, "guid") ?? `rs-${index}`,
        quote,
        author: extractTag(item, "title") ?? "Verified Client",
        agentName: extractTag(item, "realsatisfied:display_name"),
        rating: ratingValue && Number.isFinite(Number(ratingValue)) ? Math.round(Number(ratingValue) * 10) / 10 : null,
        date: published ? new Date(published).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : null,
        profileUrl: extractTag(item, "link"),
      });
    }
    index += 1;
  }
  return testimonials;
}

export async function fetchRealSatisfiedTestimonials(): Promise<RealSatisfiedTestimonial[]> {
  const response = await fetch(`https://rss.realsatisfied.com/rss/office/${encodeURIComponent(officeVanityKey)}`, {
    headers: { "User-Agent": "C21CitrusRealty/1.0 (testimonials-feed)" }, signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`RealSatisfied RSS responded ${response.status}`);
  return parseRealSatisfiedFeed(await response.text());
}

export const realSatisfiedRouter = Router();
realSatisfiedRouter.get("/testimonials", async (_req: Request, res: Response) => {
  try {
    if (cache && Date.now() - cache.fetchedAt < cacheTtl) return res.json({ testimonials: cache.data, cached: true });
    const testimonials = await fetchRealSatisfiedTestimonials();
    cache = { data: testimonials, fetchedAt: Date.now() };
    return res.json({ testimonials, cached: false });
  } catch (error) {
    console.error("[RealSatisfied] feed fetch error", error);
    return res.status(502).json({ testimonials: cache?.data ?? [], cached: Boolean(cache), error: "Unable to fetch testimonials feed" });
  }
});
