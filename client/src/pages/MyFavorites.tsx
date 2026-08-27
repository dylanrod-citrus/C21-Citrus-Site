/*
  C21 Century 21 Citrus Realty - My Favorites Page
  Design: Mediterranean Luxury - Warm Ivory + C21 Gold + Near-Black
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
  Rule: Never write "Century 21" in visible copy - always use the logo image
*/
import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Heart,
  Layers,
  Loader2,
  MapPin,
  Search,
  Square,
  Trash2,
  X,
} from "lucide-react";
import SiteNav from "../components/SiteNav";

const contactUrl = "/contact";
const fallbackListingImg = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80";

// ── API types ──────────────────────────────────────────────────────────────────
interface MlsListing {
  listingId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  status: string;
  propertyType: string;
  photoUrl: string | null;
  listingUrl: string | null;
  agentName: string | null;
}

type ListingType = "Residential" | "Multi-Unit" | "Commercial" | "Land" | "Condo" | "Mobile Home" | "Rental";

function mapPropertyType(raw: string): ListingType {
  const t = (raw || "").toUpperCase();
  if (t.includes("COMMERCIAL") || t.includes("BUSINESS")) return "Commercial";
  if (t.includes("MULTI") || t.includes("INCOME") || t.includes("RESIDENTIAL_INCOME")) return "Multi-Unit";
  if (t.includes("LAND") || t.includes("LOT")) return "Land";
  if (t.includes("CONDO") || t.includes("TOWNHOUSE")) return "Condo";
  if (t.includes("MOBILE") || t.includes("MANUFACTURED")) return "Mobile Home";
  if (t.includes("RENTAL") || t.includes("LEASE")) return "Rental";
  return "Residential";
}

function formatPrice(price: number, type: ListingType): string {
  if (type === "Rental") return `$${price.toLocaleString()}/mo.`;
  if (price >= 1000000) return `$${(price / 1000000).toFixed(price % 100000 === 0 ? 1 : 2).replace(/\.?0+$/, "")}M`;
  return `$${price.toLocaleString()}`;
}

function buildListingHref(listing: MlsListing): string {
  const slug = `${listing.address} ${listing.city} ${listing.state} ${listing.zip}`
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .replace(/\s+/g, "-");
  return `/listing/${listing.listingId}`;
}

const typeColors: Record<ListingType, string> = {
  Residential: "#4a7c59",
  "Multi-Unit": "#6b5b95",
  Commercial: "#BEAF88",
  Land: "#8b6914",
  Condo: "#2e7d9e",
  "Mobile Home": "#b05e3a",
  Rental: "#5a7a3a",
};

export default function MyFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("c21-favorites");
      return stored ? (JSON.parse(stored) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [removedId, setRemovedId] = useState<string | null>(null);

  // All live listings from the API — used to resolve saved IDs to full listing data
  const [allListings, setAllListings] = useState<MlsListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  // Fetch live listings on mount so favorites can show real photos
  useEffect(() => {
    fetch("/api/mdm/recent-sales")
      .then((r) => r.json())
      .then((data: { listings?: MlsListing[] }) => {
        setAllListings(data.listings || []);
      })
      .catch(() => {})
      .finally(() => setListingsLoading(false));
  }, []);

  // Sync to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem("c21-favorites", JSON.stringify(favoriteIds));
    } catch {}
  }, [favoriteIds]);

  const removeFavorite = (id: string) => {
    setRemovedId(id);
    setTimeout(() => {
      setFavoriteIds((prev) => prev.filter((fid) => fid !== id));
      setRemovedId(null);
    }, 300);
  };

  const clearAll = () => {
    setFavoriteIds([]);
    try { localStorage.removeItem("c21-favorites"); } catch {}
  };

  // Build a map from live data for fast lookup
  const listingMap = new Map<string, MlsListing>(allListings.map((l) => [l.listingId, l]));

  // Resolve saved IDs against live data
  const favorites = favoriteIds
    .map((id) => listingMap.get(id))
    .filter((l): l is MlsListing => l !== undefined);

  return (
    <div style={{ minHeight: "100vh", background: "var(--c21-off-white)", fontFamily: "'Lato', sans-serif" }}>
      <SiteNav activeTab="" />

      {/* Page Header */}
      <section style={{
        background: "var(--c21-black)",
        padding: "4rem 2rem 3rem",
        borderBottom: "3px solid var(--c21-gold)",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.5rem" }}>
            Your Saved Properties
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: 0 }}>
                My Favorites
              </h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                {listingsLoading
                  ? "Loading your saved properties…"
                  : favorites.length === 0
                  ? "No saved properties yet"
                  : `${favorites.length} saved propert${favorites.length === 1 ? "y" : "ies"}`}
              </p>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={clearAll}
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "#fff", background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.25)", borderRadius: "2px",
                  padding: "0.6rem 1.2rem", cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              >
                <Trash2 size={13} /> Clear All
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Listings Grid or Empty State */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>

        {/* Loading */}
        {listingsLoading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "4rem 0", color: "#888" }}>
            <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem" }}>Loading your saved properties…</span>
          </div>
        )}

        {!listingsLoading && favorites.length === 0 ? (
          /* Empty State */
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "6rem 2rem", textAlign: "center",
          }}>
            <div style={{
              width: "5rem", height: "5rem", borderRadius: "50%",
              background: "rgba(190,175,136,0.1)", display: "flex",
              alignItems: "center", justifyContent: "center", marginBottom: "1.5rem",
            }}>
              <Heart size={32} stroke="var(--c21-gold)" fill="none" strokeWidth={1.5} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.75rem" }}>
              No saved properties yet
            </h2>
            <p style={{ color: "#777", fontSize: "0.95rem", maxWidth: "400px", lineHeight: 1.7, marginBottom: "2rem" }}>
              Browse our listings and click the heart icon on any property to save it here for easy access later.
            </p>
            <Link
              href="/our-listings"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 800,
                letterSpacing: "0.1em", textTransform: "uppercase",
                background: "var(--c21-gold)", color: "var(--c21-black)",
                padding: "0.85rem 2rem", borderRadius: "2px", textDecoration: "none",
                transition: "opacity 0.2s",
              }}
            >
              <Search size={14} /> Browse Listings
            </Link>
          </div>
        ) : !listingsLoading && (
          <>
            {/* Summary bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <p style={{ fontSize: "0.85rem", color: "#888" }}>
                Click the <Heart size={12} style={{ display: "inline", verticalAlign: "middle" }} stroke="#BEAF88" fill="none" /> icon on a card to remove it from your favorites.
              </p>
              <Link
                href="/our-listings"
                style={{
                  fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "var(--c21-gold-dark)", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: "0.35rem",
                }}
              >
                <Search size={12} /> Browse More Listings
              </Link>
            </div>

            {/* Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
              {favorites.map((listing) => {
                const type = mapPropertyType(listing.propertyType);
                const priceDisplay = formatPrice(listing.price, type);
                const href = buildListingHref(listing);
                return (
                  <article
                    key={listing.listingId}
                    className="c21-listing-card"
                    style={{
                      opacity: removedId === listing.listingId ? 0 : 1,
                      transform: removedId === listing.listingId ? "scale(0.95)" : "scale(1)",
                      transition: "opacity 0.3s, transform 0.3s",
                    }}
                  >
                    <div className="c21-listing-card-media">
                      <img
                        src={listing.photoUrl || fallbackListingImg}
                        alt={`${listing.address}, ${listing.city}`}
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = fallbackListingImg; }}
                      />
                      {/* Remove from favorites */}
                      <button
                        onClick={() => removeFavorite(listing.listingId)}
                        aria-label="Remove from favorites"
                        title="Remove from favorites"
                        style={{
                          position: "absolute", top: "0.75rem", left: "0.75rem", zIndex: 3,
                          background: "rgba(190,175,136,0.95)",
                          border: "none", borderRadius: "50%",
                          width: "2.1rem", height: "2.1rem",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          transition: "background 0.2s, transform 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.12)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      >
                        <X size={14} stroke="#121212" strokeWidth={2.5} />
                      </button>
                      <span className="c21-listing-type-badge" style={{ background: typeColors[type] }}>
                        {type === "Residential" && <BedDouble size={11} />}
                        {type === "Multi-Unit" && <Building2 size={11} />}
                        {type === "Commercial" && <Layers size={11} />}
                        {type === "Land" && <MapPin size={11} />}
                        {type}
                      </span>
                      <span className="c21-listing-status-badge">Active</span>
                    </div>
                    <div className="c21-listing-card-body">
                      <div className="c21-listing-price">{priceDisplay}</div>
                      <h3 className="c21-listing-address">{listing.address}</h3>
                      <p className="c21-listing-city"><MapPin size={12} /> {listing.city}, {listing.state} {listing.zip}</p>
                      {((listing.beds !== null && listing.beds > 0) || (listing.baths !== null && listing.baths > 0) || listing.sqft !== null) && (
                        <div className="c21-listing-stats">
                          {listing.beds !== null && listing.beds > 0 && <span><BedDouble size={13} /> {listing.beds} bd</span>}
                          {listing.baths !== null && listing.baths > 0 && <span><Bath size={13} /> {listing.baths} ba</span>}
                          {listing.sqft !== null && <span><Square size={13} /> {listing.sqft.toLocaleString()} sqft</span>}
                        </div>
                      )}
                      <p className="c21-listing-mls">MLS# {listing.listingId}</p>
                      <div className="c21-listing-actions">
                        <a href={href} target="_blank" rel="noopener noreferrer" className="c21-listing-view-btn">View Details</a>
                        <a href={`/listing/${listing.listingId}`} className="c21-listing-schedule-btn"><CalendarDays size={13} /> Schedule Showing</a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Footer */}
    </div>
  );
}
