const C21_ASSET_RELEASE_BASE = "https://github.com/dylanrod-citrus/C21-Citrus-Site/releases/download/c21-site-assets-20260831";

export const C21_ASSET_PATHS = {
  logo: `${C21_ASSET_RELEASE_BASE}/c21-citrus-realty-gold-logo.png`,
  homeHero: `${C21_ASSET_RELEASE_BASE}/c21-citrus-hero-estate.jpg`,
  interiorHero: `${C21_ASSET_RELEASE_BASE}/c21-citrus-interior.jpg`,
  neighborhoodHero: `${C21_ASSET_RELEASE_BASE}/c21-citrus-neighborhood.jpg`,
  seal: `${C21_ASSET_RELEASE_BASE}/c21citrus-official-c21-seal.png`,
  schoolPortraits: {
    aaron: `${C21_ASSET_RELEASE_BASE}/aaron-school-portrait.webp`,
    denise: `${C21_ASSET_RELEASE_BASE}/denise-school-portrait.webp`,
    gabriela: `${C21_ASSET_RELEASE_BASE}/gabriela-school-portrait.webp`,
    janeth: `${C21_ASSET_RELEASE_BASE}/janeth-school-portrait.webp`,
    kimberly: `${C21_ASSET_RELEASE_BASE}/kimberly-school-portrait.webp`,
    michelle: `${C21_ASSET_RELEASE_BASE}/michelle-school-portrait.webp`,
    mireya: `${C21_ASSET_RELEASE_BASE}/mireya-school-portrait.webp`,
    sharyn: `${C21_ASSET_RELEASE_BASE}/sharyn-school-portrait.webp`,
    stella: `${C21_ASSET_RELEASE_BASE}/stella-school-portrait.webp`,
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
  return value.replace(`/manus-storage/${sourceKey}`, replacement);
}

export function portableAssetFor(value: string): string | undefined {
  return Object.entries(portableAssets).find(([sourceKey]) => value.includes(sourceKey))?.[1];
}
