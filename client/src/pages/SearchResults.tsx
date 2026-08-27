/*
  CENTURY 21 CITRUS REALTY - MLS SEARCH RESULTS PAGE
  Design: C21 brand-aligned, matches homepage/OurListings visual system
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
*/
import {
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  ChevronLeft,
  Layers,
  Loader2,
  MapPin,
  Search,
  Square,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import SiteNav from "../components/SiteNav";

/* ── External links ─────────────────────────────────────────────── */
const idxSearchUrl = "/mls-search";
const contactUrl = "/contact";
const heroImage = "/manus-storage/hero-luxury-home_04c4fbf5.jpg";

/* ── Types ───────────────────────────────────────────────────────── */
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
  propertyType?: string;
  photoUrl: string | null;
  agentName: string | null;
  listingDate: string | null;
}

const typeColors: Record<string, string> = {
  Residential: "#2d6a4f",
  Commercial: "#1d3557",
  Land: "#7b4f12",
  "Multi-Unit": "#5a189a",
  Other: "#555",
};

const fallbackImg =
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80";

function formatPrice(n: number) {
  if (!n || n <= 0) return "Price on Request";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2)}M`;
  if (n >= 10_000) return `$${(n / 1_000).toFixed(0)}K`;
  // Very low values (< $10K) are likely monthly rents or data anomalies — show as-is with label
  if (n < 10_000 && n > 0) return `$${n.toLocaleString()}/mo`;
  return `$${n.toLocaleString()}`;
}

/* ── Component ───────────────────────────────────────────────────── */
export default function SearchResults() {
  const [location, navigate] = useLocation();

  // Parse URL query params
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";
  const initialPrice = params.get("price") || "";
  const initialType = params.get("type") || "";

  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [priceFilter, setPriceFilter] = useState(initialPrice);
  const [typeFilter, setTypeFilter] = useState(initialType);

  const [results, setResults] = useState<MlsListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  // Fetch results whenever query/filters change
  useEffect(() => {
    if (!query.trim()) return;

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setHasSearched(true);

    const url = new URL("/api/mdm/search", window.location.origin);
    url.searchParams.set("q", query.trim());
    if (priceFilter) url.searchParams.set("price", priceFilter);
    if (typeFilter) url.searchParams.set("type", typeFilter);

    fetch(url.toString(), { signal: abortRef.current.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`API error ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setResults(data.listings || []);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError("Unable to load results. Please try again.");
          setResults([]);
        }
      })
      .finally(() => setLoading(false));
  }, [query, priceFilter, typeFilter]);

  // Update URL when query changes
  const updateUrl = (q: string, price: string, type: string) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (price) p.set("price", price);
    if (type) p.set("type", type);
    window.history.replaceState(null, "", `/search-results?${p.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    updateUrl(trimmed, priceFilter, typeFilter);
  };

  const handlePriceChange = (val: string) => {
    setPriceFilter(val);
    updateUrl(query, val, typeFilter);
  };

  const handleTypeChange = (val: string) => {
    setTypeFilter(val);
    updateUrl(query, priceFilter, val);
  };

  // Filter results client-side by price range
  const filtered = results.filter((l) => {
    if (!priceFilter) return true;
    if (priceFilter === "under500") return l.price < 500_000;
    if (priceFilter === "500to1m") return l.price >= 500_000 && l.price < 1_000_000;
    if (priceFilter === "1mto2m") return l.price >= 1_000_000 && l.price < 2_000_000;
    if (priceFilter === "over2m") return l.price >= 2_000_000;
    return true;
  }).filter((l) => {
    if (!typeFilter) return true;
    const pt = (l.propertyType || "").toLowerCase();
    if (typeFilter === "Residential") return pt.includes("residential") || pt.includes("single") || pt.includes("condo") || pt.includes("townhouse");
    if (typeFilter === "Commercial") return pt.includes("commercial");
    if (typeFilter === "Land") return pt.includes("land");
    if (typeFilter === "Multi-Unit") return pt.includes("multi") || pt.includes("duplex") || pt.includes("triplex");
    return true;
  });

  const typeFilters = [
    { label: "All Types", value: "" },
    { label: "Residential", value: "Residential" },
    { label: "Commercial", value: "Commercial" },
    { label: "Land", value: "Land" },
    { label: "Multi-Unit", value: "Multi-Unit" },
  ];

  const priceFilters = [
    { label: "Any Price", value: "" },
    { label: "Under $500K", value: "under500" },
    { label: "$500K - $1M", value: "500to1m" },
    { label: "$1M - $2M", value: "1mto2m" },
    { label: "$2M+", value: "over2m" },
  ];

  return (
    <div style={{ fontFamily: "'Lato', sans-serif", background: "var(--c21-off-white)", minHeight: "100vh" }}>
      <SiteNav activeTab="Home" />

      <main id="main-content">
        {/* ── Compact Header ──────────────────────────────────────── */}
        <section
          style={{
            position: "relative",
            background: "#121212",
            padding: "4rem 2rem 3rem",
            overflow: "hidden",
          }}
        >
          {/* Background image with heavy overlay */}
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.18,
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1, maxWidth: "860px", margin: "0 auto" }}>
            {/* Back link */}
            <button
              onClick={() => navigate("/")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                fontFamily: "'Lato', sans-serif",
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                padding: 0,
                marginBottom: "1.25rem",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c21-gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            >
              <ChevronLeft size={14} /> Back to Home
            </button>

            <p
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--c21-gold)",
                marginBottom: "0.5rem",
              }}
            >
              MLS Property Search
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                fontWeight: 700,
                color: "#fff",
                marginBottom: "1.5rem",
                lineHeight: 1.2,
              }}
            >
              {query ? `Results for "${query}"` : "Search Properties"}
            </h1>

            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "0.5rem", maxWidth: "640px" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: "0.85rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#aaa",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="City, ZIP code, or address"
                  style={{
                    width: "100%",
                    padding: "0.85rem 2.5rem 0.85rem 2.5rem",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "2px",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    fontFamily: "'Lato', sans-serif",
                    fontSize: "0.95rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => { setInputValue(""); setQuery(""); setResults([]); setHasSearched(false); }}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#aaa",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="c21-btn-gold"
                style={{ whiteSpace: "nowrap", padding: "0.85rem 1.5rem" }}
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {/* ── Filter Bar ──────────────────────────────────────────── */}
        <section
          style={{
            background: "#fff",
            borderBottom: "1px solid #e8e4dc",
            padding: "1rem 0",
            position: "sticky",
            top: "72px",
            zIndex: 40,
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 2rem",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.75rem",
              justifyContent: "space-between",
            }}
          >
            {/* Type filters */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {typeFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => handleTypeChange(f.value)}
                  style={{
                    padding: "0.4rem 1rem",
                    borderRadius: "2px",
                    border: typeFilter === f.value ? "2px solid var(--c21-gold)" : "2px solid #e0dbd0",
                    background: typeFilter === f.value ? "var(--c21-gold)" : "transparent",
                    color: typeFilter === f.value ? "#121212" : "#555",
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.77rem",
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Price + count */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <select
                value={priceFilter}
                onChange={(e) => handlePriceChange(e.target.value)}
                style={{
                  padding: "0.4rem 0.85rem",
                  border: "1px solid #e0dbd0",
                  borderRadius: "2px",
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.82rem",
                  color: "#333",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                {priceFilters.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              {hasSearched && !loading && (
                <span style={{ fontSize: "0.82rem", color: "#888" }}>
                  <strong style={{ color: "#121212" }}>{filtered.length}</strong> result{filtered.length !== 1 ? "s" : ""}
                  {query ? ` for "${query}"` : ""}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ── Results Grid ────────────────────────────────────────── */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>

          {/* Loading state */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 0", gap: "1rem" }}>
              <Loader2 size={36} style={{ color: "var(--c21-gold)", animation: "spin 1s linear infinite" }} />
              <p style={{ fontFamily: "'Lato', sans-serif", color: "#888", fontSize: "0.95rem" }}>
                Searching the MLS for <strong style={{ color: "#121212" }}>{query}</strong>…
              </p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "#fff",
                border: "1px solid #e8e4dc",
                borderRadius: "4px",
              }}
            >
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#121212", marginBottom: "0.5rem" }}>
                Something went wrong
              </p>
              <p style={{ fontFamily: "'Lato', sans-serif", color: "#888", marginBottom: "1.5rem" }}>{error}</p>
              <button
                onClick={() => setQuery(inputValue.trim())}
                className="c21-btn-gold"
                style={{ padding: "0.7rem 1.5rem" }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state - no query yet */}
          {!loading && !error && !hasSearched && (
            <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
              <Search size={48} style={{ color: "#d4c9a8", marginBottom: "1rem" }} />
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#121212", marginBottom: "0.5rem" }}>
                Enter a city or ZIP code to begin
              </p>
              <p style={{ fontFamily: "'Lato', sans-serif", color: "#888", maxWidth: "400px", margin: "0 auto" }}>
                Search the MLS for active and recent listings across Southern California.
              </p>
            </div>
          )}

          {/* Empty state - searched but no results */}
          {!loading && !error && hasSearched && filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "#fff",
                border: "1px solid #e8e4dc",
                borderRadius: "4px",
              }}
            >
              <MapPin size={40} style={{ color: "#d4c9a8", marginBottom: "1rem" }} />
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#121212", marginBottom: "0.5rem" }}>
                No listings found for "{query}"
              </p>
              <p style={{ fontFamily: "'Lato', sans-serif", color: "#888", marginBottom: "1.5rem", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
                Try a different city, ZIP code, or adjust your filters. You can also search the full MLS for broader results.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => { setPriceFilter(""); setTypeFilter(""); }}
                  style={{
                    padding: "0.65rem 1.25rem",
                    border: "2px solid var(--c21-gold)",
                    background: "transparent",
                    color: "#121212",
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  Clear Filters
                </button>
                <a href={idxSearchUrl} className="c21-btn-gold" style={{ padding: "0.65rem 1.25rem" }}>
                  Search Full MLS
                </a>
              </div>
            </div>
          )}

          {/* Results grid */}
          {!loading && !error && filtered.length > 0 && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "2rem",
                }}
              >
                {filtered.map((listing) => {
                  const propType = listing.propertyType || "Residential";
                  const badgeColor = typeColors[propType] || typeColors.Other;
                  const photo = listing.photoUrl || fallbackImg;
                  const slug = `${listing.address} ${listing.city} ${listing.state} ${listing.zip}`
                    .toUpperCase()
                    .replace(/[^A-Z0-9\s]/g, "")
                    .replace(/\s+/g, "-");
                  const detailUrl = `/listing/${listing.listingId}`;

                  return (
                    <article key={listing.listingId} className="c21-listing-card">
                      <div className="c21-listing-card-media">
                        <img
                          src={photo}
                          alt={`${listing.address}, ${listing.city}`}
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = fallbackImg;
                          }}
                        />
                        {/* Status badge */}
                        <span
                          className="c21-listing-status-badge"
                          style={{
                            background: listing.status?.toLowerCase() === "sold" ? "#7b4f12" : "#2d6a4f",
                          }}
                        >
                          {listing.status || "Active"}
                        </span>
                        {/* Type badge */}
                        <span className="c21-listing-type-badge" style={{ background: badgeColor }}>
                          {propType === "Residential" && <BedDouble size={11} />}
                          {propType === "Multi-Unit" && <Building2 size={11} />}
                          {propType === "Commercial" && <Layers size={11} />}
                          {propType === "Land" && <MapPin size={11} />}
                          {propType}
                        </span>
                      </div>

                      <div className="c21-listing-card-body">
                        <div className="c21-listing-price">
                          {formatPrice(listing.price)}
                        </div>
                        <h3 className="c21-listing-address">{listing.address}</h3>
                        <p className="c21-listing-city">
                          <MapPin size={12} /> {listing.city}, {listing.state} {listing.zip}
                        </p>

                        {((listing.beds !== null && listing.beds > 0) || (listing.baths !== null && listing.baths > 0) || listing.sqft !== null) && (
                          <div className="c21-listing-stats">
                            {listing.beds !== null && listing.beds > 0 && (
                              <span><BedDouble size={13} /> {listing.beds} bd</span>
                            )}
                            {listing.baths !== null && listing.baths > 0 && (
                              <span><Bath size={13} /> {listing.baths} ba</span>
                            )}
                            {listing.sqft !== null && (
                              <span><Square size={13} /> {listing.sqft.toLocaleString()} sf</span>
                            )}
                          </div>
                        )}

                        {listing.agentName && (
                          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", color: "#888", marginTop: "0.35rem" }}>
                            Listed by {listing.agentName}
                          </p>
                        )}

                        <div className="c21-listing-actions">
                          <a
                            href={detailUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="c21-listing-view-btn"
                          >
                            View Details
                          </a>
                          <a href={`/listing/${listing.listingId}`} className="c21-listing-schedule-btn">
                            <CalendarDays size={13} /> Schedule Showing
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Footer CTA */}
              <div
                style={{
                  marginTop: "3rem",
                  padding: "2.5rem",
                  background: "#fff",
                  border: "1px solid #e8e4dc",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.2rem",
                    color: "#121212",
                    marginBottom: "0.5rem",
                  }}
                >
                  Looking for more options?
                </p>
                <p
                  style={{
                    fontFamily: "'Lato', sans-serif",
                    color: "#888",
                    fontSize: "0.9rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  Search the full MLS for the complete inventory of active listings across Southern California.
                </p>
                <a href={idxSearchUrl} className="c21-btn-gold" style={{ padding: "0.75rem 1.75rem" }}>
                  Search Full MLS
                </a>
              </div>
            </>
          )}
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
    </div>
  );
}
