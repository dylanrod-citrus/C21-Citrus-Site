export const C21_ASSET_PATHS = {
  logo: "/manus-storage/c21-citrus-realty-gold-logo_7dd9a4fe.png",
  homeHero: "/manus-storage/c21-citrus-hero-estate_9b23cd39.jpg",
  interiorHero: "/manus-storage/c21-citrus-interior_f6c778e7.jpg",
  neighborhoodHero: "/manus-storage/c21-citrus-neighborhood_92dbaca3.jpg",
  seal: "/manus-storage/c21seal_9b224e88.png",
  schoolPortraits: {
    aaron: "/manus-storage/aaron-school-portrait_dc980a94.webp",
    denise: "/manus-storage/denise-school-portrait_adef250d.webp",
    gabriela: "/manus-storage/gabriela-school-portrait_12e5ebe6.webp",
    janeth: "/manus-storage/janeth-school-portrait_4a878c57.webp",
    kimberly: "/manus-storage/kimberly-school-portrait_cd1792b4.webp",
    michelle: "/manus-storage/michelle-school-portrait_134b141a.webp",
    mireya: "/manus-storage/mireya-school-portrait_2a84e0a1.webp",
    sharyn: "/manus-storage/sharyn-school-portrait_da4127e9.webp",
    stella: "/manus-storage/stella-school-portrait_bf327c9d.webp",
  },
} as const;

const portableAssets: Record<string, string> = {
  "century21-citrus-realty-gold-logo_f3913815.png": C21_ASSET_PATHS.logo,
  "c21-citrus-realty-gold-logo_c9c0b17e.png": C21_ASSET_PATHS.logo,
  "hero-luxury-home_04c4fbf5.jpg": C21_ASSET_PATHS.homeHero,
  "c21-citrus-hero-estate_b43f73af.jpg": C21_ASSET_PATHS.homeHero,
  "hero-luxury-interior_f79432c6.jpg": C21_ASSET_PATHS.interiorHero,
  "c21-citrus-interior_dc2ded1c.jpg": C21_ASSET_PATHS.interiorHero,
  "hero-neighborhood_4a38234b.jpg": C21_ASSET_PATHS.neighborhoodHero,
  "c21-citrus-neighbourhood_881ec5cd.jpg": C21_ASSET_PATHS.neighborhoodHero,
};

export function replacePortableAssetPath(value: string): string {
  const match = Object.entries(portableAssets).find(([sourceKey]) => value.includes(sourceKey));
  if (!match) return value;

  const [sourceKey, replacement] = match;
  return value.replace(sourceKey, replacement.replace("/manus-storage/", ""));
}

export function portableAssetFor(value: string): string | undefined {
  return Object.entries(portableAssets).find(([sourceKey]) => value.includes(sourceKey))?.[1];
}
