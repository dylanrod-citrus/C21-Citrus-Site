/*
  CENTURY 21 CITRUS REALTY - OUR LISTINGS PAGE
  Design: C21 brand-aligned luxury real estate portal
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
  Rule: Never write "Century 21" in visible copy - always use the logo image
*/
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Heart,
  Layers,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  Square,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import SiteNav from "../components/SiteNav";

const logoUrl = "/manus-storage/century21-citrus-realty-gold-logo_f3913815.png";
const heroImage = "/manus-storage/hero-luxury-home_04c4fbf5.jpg";

const idxSearchUrl = "https://c21citrus.com/search/";
const officeListingsUrl = "/our-listings";
const valuationUrl = "https://cloudattract.com/7442b3";
const contactUrl = "/contact";
const buyingProcessUrl = "/home-buying-process";
const sellingProcessUrl = "/home-selling-process";
const phoneUrl = "tel:19095928500";
const emailUrl = "mailto:oj@c21citrus.com";

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

// ── Derived types for the UI ───────────────────────────────────────────────────
type ListingType = "Residential" | "Multi-Unit" | "Commercial" | "Land" | "Condo" | "Mobile Home" | "Rental";

/** Map API propertyType → UI display type */
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

/** Format price — rentals show $/mo, sales show $ */
function formatPrice(price: number, type: ListingType): string {
  if (type === "Rental") return `$${price.toLocaleString()}/mo.`;
  if (price >= 1000000) return `$${(price / 1000000).toFixed(price % 100000 === 0 ? 1 : 2).replace(/\.?0+$/, "")}M`;
  return `$${price.toLocaleString()}`;
}

/** Build the c21citrus.com detail URL from address + MLS ID */
function buildListingHref(listing: MlsListing): string {
  const slug = `${listing.address} ${listing.city} ${listing.state} ${listing.zip}`
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .replace(/\s+/g, "-");
  return `/listing/${listing.listingId}`;
}

const typeFilters: Array<{ label: string; value: ListingType | "All" }> = [
  { label: "All Properties", value: "All" },
  { label: "Residential", value: "Residential" },
  { label: "Condo", value: "Condo" },
  { label: "Multi-Unit", value: "Multi-Unit" },
  { label: "Commercial", value: "Commercial" },
  { label: "Land", value: "Land" },
  { label: "Mobile Home", value: "Mobile Home" },
  { label: "Rental", value: "Rental" },
];

const typeColors: Record<ListingType, string> = {
  Residential: "#2d6a4f",
  "Multi-Unit": "#1d3557",
  Commercial: "#6b2737",
  Land: "#7b5e2a",
  Condo: "#4a4e69",
  "Mobile Home": "#5c4a3a",
  Rental: "#1a6b8a",
};

const typeIcons: Record<ListingType, React.ReactNode> = {
  Residential: <BedDouble size={11} />,
  "Multi-Unit": <UsersRound size={11} />,
  Commercial: <Building2 size={11} />,
  Land: <MapPin size={11} />,
  Condo: <Layers size={11} />,
  "Mobile Home": <MapPin size={11} />,
  Rental: <BedDouble size={11} />,
};

const MIN_PRICE = 0;
const MAX_PRICE = 7000000;

function formatPriceLabel(val: number): string {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)}M`;
  if (val >= 1000) return `$${Math.round(val / 1000)}K`;
  return `$${val.toLocaleString()}`;
}

export default function OurListings() {
  const [listings, setListings] = useState<MlsListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState(false);

  const [activeFilter, setActiveFilter] = useState<ListingType | "All">("All");
  const [sortBy, setSortBy] = useState<"price-desc" | "price-asc">("price-desc");
  const [priceMin, setPriceMin] = useState(MIN_PRICE);
  const [priceMax, setPriceMax] = useState(MAX_PRICE);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("c21-favorites");
      return stored ? new Set(JSON.parse(stored) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });

  // ── Fetch live listings from API ───────────────────────────────────────────
  useEffect(() => {
    fetch("/api/mdm/recent-sales")
      .then((r) => r.json())
      .then((data: { listings?: MlsListing[] }) => {
        setListings(data.listings || []);
      })
      .catch(() => setListingsError(true))
      .finally(() => setListingsLoading(false));
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try { localStorage.setItem("c21-favorites", JSON.stringify(Array.from(next))); } catch {}
      return next;
    });
  };
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercent = (val: number) => ((val - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  const handleSliderMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const rawVal = Math.round((pct * (MAX_PRICE - MIN_PRICE) + MIN_PRICE) / 50000) * 50000;
    if (dragging === "min") setPriceMin(Math.min(rawVal, priceMax - 50000));
    else setPriceMax(Math.max(rawVal, priceMin + 50000));
  }, [dragging, priceMin, priceMax]);

  const handleSliderTouchMove = useCallback((e: TouchEvent) => {
    if (!dragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
    const rawVal = Math.round((pct * (MAX_PRICE - MIN_PRICE) + MIN_PRICE) / 50000) * 50000;
    if (dragging === "min") setPriceMin(Math.min(rawVal, priceMax - 50000));
    else setPriceMax(Math.max(rawVal, priceMin + 50000));
  }, [dragging, priceMin, priceMax]);

  useEffect(() => {
    if (!dragging) return;
    const up = () => setDragging(null);
    window.addEventListener("mousemove", handleSliderMouseMove);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", handleSliderTouchMove);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", handleSliderMouseMove);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", handleSliderTouchMove);
      window.removeEventListener("touchend", up);
    };
  }, [dragging, handleSliderMouseMove, handleSliderTouchMove]);

  // ── Derived filtered/sorted list ───────────────────────────────────────────
  const priceFiltered = listings.filter((l) => l.price >= priceMin && l.price <= priceMax);
  const isPriceFiltered = priceMin > MIN_PRICE || priceMax < MAX_PRICE;

  const filtered = priceFiltered
    .filter((l) => activeFilter === "All" || mapPropertyType(l.propertyType) === activeFilter)
    .sort((a, b) => sortBy === "price-desc" ? b.price - a.price : a.price - b.price);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedListings = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ fontFamily: "'Lato', sans-serif", background: "var(--c21-off-white)" }}>
      <SiteNav activeTab="Our Listings" />

      <main id="main-content">
        {/* Hero */}
        <section style={{
          position: "relative",
          height: "320px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <img src={heroImage} alt="Our Listings" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45)" }} />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "#fff", padding: "0 1.5rem" }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
              Featured Listings
            </p>
            <p style={{ marginTop: "0.75rem", fontSize: "1.05rem", opacity: 0.88, maxWidth: "520px", margin: "0.75rem auto 0" }}>
              Active properties listed by our office - updated from the MLS in real time.
            </p>
          </div>
        </section>

        {/* Filter / Sort bar */}
        <section style={{ background: "#121212", padding: "1.25rem 2rem", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
            {/* Type filters */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", flex: 1 }}>
              {typeFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => { setActiveFilter(f.value); setCurrentPage(1); }}
                  style={{
                    padding: "0.35rem 0.85rem",
                    border: activeFilter === f.value ? "2px solid var(--c21-gold)" : "2px solid rgba(255,255,255,0.2)",
                    borderRadius: "2px",
                    background: activeFilter === f.value ? "var(--c21-gold)" : "transparent",
                    color: activeFilter === f.value ? "#121212" : "#fff",
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    letterSpacing: "0.03em",
                    transition: "all 0.2s",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as "price-desc" | "price-asc"); setCurrentPage(1); }}
              aria-label="Sort listings by"
              style={{
                padding: "0.35rem 0.75rem",
                border: "2px solid rgba(255,255,255,0.2)",
                borderRadius: "2px",
                background: "transparent",
                color: "#fff",
                fontFamily: "'Lato', sans-serif",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer",
              }}
            >
              <option value="price-desc" style={{ color: "#121212" }}>Price: High → Low</option>
              <option value="price-asc" style={{ color: "#121212" }}>Price: Low → High</option>
            </select>
          </div>

          {/* Price range slider */}
          <div style={{ maxWidth: "1280px", margin: "0.85rem auto 0", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Price Range</span>
            <div
              ref={sliderRef}
              style={{ position: "relative", flex: 1, minWidth: "200px", height: "4px", background: "rgba(255,255,255,0.15)", borderRadius: "2px", cursor: "pointer" }}
            >
              <div style={{
                position: "absolute",
                left: `${getPercent(priceMin)}%`,
                right: `${100 - getPercent(priceMax)}%`,
                height: "100%",
                background: "var(--c21-gold)",
                borderRadius: "2px",
              }} />
              {/* Min thumb */}
              <div
                onMouseDown={() => setDragging("min")}
                onTouchStart={() => setDragging("min")}
                style={{
                  position: "absolute",
                  left: `${getPercent(priceMin)}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "16px",
                  height: "16px",
                  background: "var(--c21-gold)",
                  borderRadius: "50%",
                  cursor: "grab",
                  zIndex: 2,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                }}
              />
              {/* Max thumb */}
              <div
                onMouseDown={() => setDragging("max")}
                onTouchStart={() => setDragging("max")}
                style={{
                  position: "absolute",
                  left: `${getPercent(priceMax)}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "16px",
                  height: "16px",
                  background: "var(--c21-gold)",
                  borderRadius: "2px",
                  cursor: "grab",
                  zIndex: 2,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                }}
              />
            </div>
            <span style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 700, minWidth: "160px", textAlign: "right" }}>
              {formatPriceLabel(priceMin)} - {formatPriceLabel(priceMax)}
            </span>
            {isPriceFiltered && (
              <button
                onClick={() => { setPriceMin(MIN_PRICE); setPriceMax(MAX_PRICE); setCurrentPage(1); }}
                style={{ color: "var(--c21-gold)", background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700 }}
              >Reset</button>
            )}
          </div>
        </section>

        {/* Listings Grid */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 2rem 4rem" }}>

          {/* Loading state */}
          {listingsLoading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "4rem 0", color: "#888" }}>
              <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem" }}>Loading listings…</span>
            </div>
          )}

          {/* Error state */}
          {!listingsLoading && listingsError && (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#888" }}>
              <p>Listings are temporarily unavailable. Please try again shortly.</p>
              <a href={idxSearchUrl} style={{ color: "var(--c21-gold-dark)", textDecoration: "none", fontWeight: 600 }}>Search the full MLS →</a>
            </div>
          )}

          {/* Empty state after filtering */}
          {!listingsLoading && !listingsError && filtered.length === 0 && listings.length > 0 && (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#888" }}>
              <p>No listings match your current filters.</p>
              <button onClick={() => { setActiveFilter("All"); setPriceMin(MIN_PRICE); setPriceMax(MAX_PRICE); }} style={{ color: "var(--c21-gold-dark)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "1rem" }}>Clear filters</button>
            </div>
          )}

          {/* Cards */}
          {!listingsLoading && !listingsError && paginatedListings.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
              {paginatedListings.map((listing) => {
                const type = mapPropertyType(listing.propertyType);
                const priceDisplay = formatPrice(listing.price, type);
                const href = buildListingHref(listing);
                return (
                  <article key={listing.listingId} className="c21-listing-card">
                    <div className="c21-listing-card-media">
                      <img
                        src={listing.photoUrl || fallbackListingImg}
                        alt={`${listing.address}, ${listing.city}`}
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = fallbackListingImg; }}
                      />
                      {/* Favorites heart - top-left */}
                      <button
                        onClick={() => toggleFavorite(listing.listingId)}
                        aria-label={favorites.has(listing.listingId) ? "Remove from favorites" : "Save to favorites"}
                        title={favorites.has(listing.listingId) ? "Remove from favorites" : "Save to favorites"}
                        style={{
                          position: "absolute",
                          top: "0.75rem",
                          left: "0.75rem",
                          zIndex: 3,
                          background: favorites.has(listing.listingId) ? "rgba(190,175,136,0.95)" : "rgba(255,255,255,0.92)",
                          border: "none",
                          borderRadius: "50%",
                          width: "2.1rem",
                          height: "2.1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          transition: "background 0.2s, transform 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.12)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      >
                        <Heart
                          size={15}
                          fill={favorites.has(listing.listingId) ? "#121212" : "none"}
                          stroke={favorites.has(listing.listingId) ? "#121212" : "#BEAF88"}
                          strokeWidth={2.2}
                        />
                      </button>
                      {/* Type badge - top-right */}
                      <span className="c21-listing-type-badge" style={{ background: typeColors[type] }}>
                        {typeIcons[type]}
                        {type}
                      </span>
                      {/* Status badge */}
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
          )}

          {/* Pagination */}
          {!listingsLoading && totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
              <button
                onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={currentPage === 1}
                style={{
                  padding: "0.5rem 1.1rem",
                  border: "2px solid #e0dbd0",
                  borderRadius: "2px",
                  background: "transparent",
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  color: currentPage === 1 ? "#bbb" : "#333",
                  transition: "all 0.2s",
                }}
              >← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  style={{
                    padding: "0.5rem 0.9rem",
                    border: page === currentPage ? "2px solid var(--c21-gold)" : "2px solid #e0dbd0",
                    borderRadius: "2px",
                    background: page === currentPage ? "var(--c21-gold)" : "transparent",
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    color: page === currentPage ? "#121212" : "#555",
                    minWidth: "2.2rem",
                    transition: "all 0.2s",
                  }}
                >{page}</button>
              ))}
              <button
                onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={currentPage === totalPages}
                style={{
                  padding: "0.5rem 1.1rem",
                  border: "2px solid #e0dbd0",
                  borderRadius: "2px",
                  background: "transparent",
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  color: currentPage === totalPages ? "#bbb" : "#333",
                  transition: "all 0.2s",
                }}
              >Next →</button>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="c21-cta-section">
          <div className="c21-cta-inner">
            <div className="c21-cta-text">
              <h2>Looking for More Homes?</h2>
              <p>The listings above represent the current Century 21 Citrus Realty office inventory. For the complete regional MLS, use the full search to browse all available homes.</p>
            </div>
            <div className="c21-cta-actions">
              <a href={idxSearchUrl} className="c21-btn-black"><Search size={15} /> Full MLS Search</a>
              <a href={valuationUrl} className="c21-btn-outline-black"><TrendingUp size={15} /> Home Value</a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
}
