const portableAssets: Record<string, string> = {
  "century21-citrus-realty-gold-logo_f3913815.png": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663548398310/FmgRAuAhcizSMKMD.png",
  "c21-citrus-realty-gold-logo_c9c0b17e.png": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663548398310/FmgRAuAhcizSMKMD.png",
  "hero-luxury-home_04c4fbf5.jpg": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663548398310/COjBDqaHYGjcBfxs.jpg",
  "c21-citrus-hero-estate_b43f73af.jpg": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663548398310/COjBDqaHYGjcBfxs.jpg",
  "hero-luxury-interior_f79432c6.jpg": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663548398310/wAwfaynGKbCwrahM.jpg",
  "c21-citrus-interior_dc2ded1c.jpg": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663548398310/wAwfaynGKbCwrahM.jpg",
  "hero-neighborhood_4a38234b.jpg": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663548398310/awRuRdBCjkpdTSMp.jpg",
  "c21-citrus-neighbourhood_881ec5cd.jpg": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663548398310/awRuRdBCjkpdTSMp.jpg",
};

export function replacePortableAssetPath(value: string): string {
  const match = Object.entries(portableAssets).find(([sourceKey]) => value.includes(sourceKey));
  return match ? value.replace(match[0], match[1]) : value;
}

export function portableAssetFor(value: string): string | undefined {
  return Object.entries(portableAssets).find(([sourceKey]) => value.includes(sourceKey))?.[1];
}
