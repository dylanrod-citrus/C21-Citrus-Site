import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * Uploaded source asset URLs were scoped to its original project and no longer
 * resolve in this managed project. Preserve the original component references,
 * while substituting an equivalent available project asset only on image error.
 */
const uploadedAssetFallbacks: Record<string, string> = {
  "century21-citrus-realty-gold-logo_f3913815.png": "/manus-storage/c21-citrus-symbol_9bf476c2.png",
  "c21-seal-black_a202c272.png": "/manus-storage/c21-citrus-symbol_9bf476c2.png",
  "c21-seal-transparent_a00d7088.png": "/manus-storage/c21-citrus-symbol_9bf476c2.png",
  "eho-logo_945dfdbe.png": "/manus-storage/c21-citrus-symbol_9bf476c2.png",
  "hero-luxury-home_04c4fbf5.jpg": "/manus-storage/c21-citrus-hero-estate_b43f73af.jpg",
  "hero-luxury-interior_f79432c6.jpg": "/manus-storage/c21-citrus-interior_dc2ded1c.jpg",
  "hero-neighborhood_4a38234b.jpg": "/manus-storage/c21-citrus-neighbourhood_881ec5cd.jpg",
  "aaronrivasoriginal_d403a339.webp": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85",
  "andrew-mendez_8a9071ac.png": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85&sat=-20",
  "denise-new_3aa49996.png": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=85",
  "gabby_sandoval_012c04db.webp": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85",
  "janeth_new_8ac788c9.png": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=85",
  "kimberlyoblrich_40b3d6d9.webp": "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=700&q=85",
  "michelle-new_3c2868f9.png": "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=700&q=85",
  "mireya-new_bdc7844f.png": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "sharyn_jung_head_d5cb895b.jpg": "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?auto=format&fit=crop&w=700&q=85",
  "stella_0ecefb99.webp": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=85",
};

document.addEventListener("error", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLImageElement)) return;
  const originalKey = Object.keys(uploadedAssetFallbacks).find((key) => target.src.includes(key));
  const fallback = originalKey ? uploadedAssetFallbacks[originalKey] : undefined;
  if (fallback && target.src !== fallback) target.src = fallback;
}, true);

createRoot(document.getElementById("root")!).render(<App />);
