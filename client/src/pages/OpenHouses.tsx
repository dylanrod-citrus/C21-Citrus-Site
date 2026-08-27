/*
  CENTURY 21 CITRUS REALTY - OPEN HOUSES PAGE
  Design: C21 brand-aligned luxury real estate portal
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
  Rule: Never write "Century 21" in visible copy - always use the logo image

  Data: Live from /api/mdm/recent-sales - all active listings available for touring.
  Open house schedule is confirmed by contacting the listing agent directly.
*/
import {
  Bath,
  Bed,
  Calendar,
  Home,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  Square,
  ExternalLink,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SiteNav from "../components/SiteNav";

const heroImage = "/manus-storage/hero-neighborhood_4a38234b.jpg";

const contactUrl = "/contact";
const phoneUrl = "tel:19095928500";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Listing {
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
  agentPhone: string | null;
  listingDate: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n: number): string {
  if (!n) return "Contact for Price";
  return "$" + n.toLocaleString("en-US");
}

function formatPhone(raw: string | null): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits[0] === "1") {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw;
}

function formatType(raw: string): string {
  if (!raw) return "Residential";
  const map: Record<string, string> = {
    RESIDENTIAL: "Residential",
    RESIDENTIAL_INCOME: "Multi-Unit",
    COMMERCIAL_SALE: "Commercial",
    COMMERCIAL_LEASE: "Commercial",
    LAND: "Land",
    MOBILE_HOME: "Mobile Home",
    RENTAL: "Rental",
  };
  return map[raw.toUpperCase()] ?? raw;
}

function badgeColor(type: string): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    Residential: { background: "#121212", color: "#BEAF88" },
    "Multi-Unit": { background: "#1e3a5f", color: "#93c5fd" },
    Commercial: { background: "#3b1f00", color: "#fbbf24" },
    Land: { background: "#14532d", color: "#86efac" },
    "Mobile Home": { background: "#4a1d96", color: "#c4b5fd" },
    Rental: { background: "#7c2d12", color: "#fed7aa" },
  };
  return map[type] ?? { background: "#121212", color: "#fff" };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OpenHouses() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/mdm/recent-sales")
      .then((r) => r.json())
      .then((data) => {
        setListings(data.listings ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load listings. Please try again shortly.");
        setLoading(false);
      });
  }, []);

  const cities = useMemo(() => {
    const set = new Set(listings.map((l) => l.city).filter(Boolean));
    return ["All Cities", ...Array.from(set).sort()];
  }, [listings]);

  const types = useMemo(() => {
    const set = new Set(listings.map((l) => formatType(l.propertyType)).filter(Boolean));
    return ["All Types", ...Array.from(set).sort()];
  }, [listings]);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        l.address.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        (l.agentName ?? "").toLowerCase().includes(q);
      const matchCity = cityFilter === "All Cities" || l.city === cityFilter;
      const matchType =
        typeFilter === "All Types" || formatType(l.propertyType) === typeFilter;
      return matchSearch && matchCity && matchType;
    });
  }, [listings, search, cityFilter, typeFilter]);

  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }}>
      <SiteNav activeTab="Open Houses" />

      <main id="main-content">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="c21-inner-hero">
          <img
            src={heroImage}
            alt="Southern California neighborhood"
            className="c21-inner-hero-bg"
          />
          <div className="c21-inner-hero-overlay" />
          <div className="c21-inner-hero-content">
            <h1 className="c21-inner-hero-title">
              Active Listings Available<br />for Touring
            </h1>
            <p className="c21-inner-hero-subtitle">
              Browse every active listing represented by Century 21 Citrus Realty agents across Southern California. Contact the listing agent directly to schedule a private showing or confirm upcoming open house dates.
            </p>
            <div className="c21-hero-actions">
              <a href={contactUrl} className="c21-btn-outline-white">
                <Calendar size={15} /> Schedule a Showing
              </a>
              <a href={phoneUrl} className="c21-btn-outline-white">
                <Phone size={15} /> (909) 592-8500
              </a>
            </div>
          </div>
        </section>

        {/* ── Filter Bar ────────────────────────────────────────── */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #e8e4dc",
            padding: "1.25rem 0",
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
              gap: "1rem",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flex: 1,
                minWidth: "220px",
              }}
            >
              <Search size={16} style={{ color: "#888", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search by address, city, or agent…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  border: "1px solid #e0dbd0",
                  borderRadius: "2px",
                  padding: "0.5rem 0.85rem",
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.88rem",
                  color: "#333",
                  outline: "none",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                aria-label="Filter by city"
                style={{
                  padding: "0.5rem 0.85rem",
                  border: "1px solid #e0dbd0",
                  borderRadius: "2px",
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.85rem",
                  color: "#333",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="Filter by property type"
                style={{
                  padding: "0.5rem 0.85rem",
                  border: "1px solid #e0dbd0",
                  borderRadius: "2px",
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.85rem",
                  color: "#333",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                {types.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <span style={{ fontSize: "0.82rem", color: "#888" }}>
                <strong style={{ color: "#121212" }}>{filtered.length}</strong>{" "}
                listing{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* ── Listings Grid ─────────────────────────────────────── */}
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "3rem 2rem 5rem",
          }}
        >
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 0",
                color: "#888",
              }}
            >
              <Loader2
                size={36}
                style={{
                  margin: "0 auto 1rem",
                  opacity: 0.4,
                  animation: "spin 1s linear infinite",
                }}
              />
              <p
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "1rem",
                }}
              >
                Loading active listings…
              </p>
            </div>
          ) : error ? (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 0",
                color: "#888",
              }}
            >
              <Home size={44} style={{ margin: "0 auto 1rem", opacity: 0.25 }} />
              <p
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "1rem",
                }}
              >
                {error}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 0",
                color: "#888",
              }}
            >
              <Home size={44} style={{ margin: "0 auto 1rem", opacity: 0.25 }} />
              <p
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "1rem",
                }}
              >
                No listings match your filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCityFilter("All Cities");
                  setTypeFilter("All Types");
                }}
                style={{
                  marginTop: "1rem",
                  background: "none",
                  border: "1px solid #ccc",
                  borderRadius: "2px",
                  padding: "0.5rem 1.25rem",
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.75rem",
              }}
            >
              {filtered.map((listing) => {
                const type = formatType(listing.propertyType);
                const phone = formatPhone(listing.agentPhone);
                const agentEmail = listing.agentName
                  ? `oj@c21citrus.com`
                  : "oj@c21citrus.com";
                const detailUrl = `/listing/${listing.listingId}`;

                return (
                  <div
                    key={listing.listingId}
                    style={{
                      background: "#fff",
                      border: "1px solid #e8e4dc",
                      borderRadius: "3px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "box-shadow 0.2s, transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 8px 32px rgba(0,0,0,0.10)";
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "none";
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "none";
                    }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        position: "relative",
                        height: "200px",
                        overflow: "hidden",
                        background: "#f0ece4",
                      }}
                    >
                      {listing.photoUrl ? (
                        <img
                          src={listing.photoUrl}
                          alt={listing.address}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.4s",
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.transform = "scale(1.04)";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.transform = "scale(1)";
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#f7f6f3",
                          }}
                        >
                          <Home size={40} style={{ color: "#ccc" }} />
                        </div>
                      )}
                      {/* Property type badge - top left */}
                      <span
                        style={{
                          position: "absolute",
                          top: "0.75rem",
                          left: "0.75rem",
                          fontFamily: "'Lato', sans-serif",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          padding: "0.3rem 0.65rem",
                          borderRadius: "2px",
                          ...badgeColor(type),
                        }}
                      >
                        {type}
                      </span>
                      {/* Active badge - top right */}
                      <span
                        style={{
                          position: "absolute",
                          top: "0.75rem",
                          right: "0.75rem",
                          fontFamily: "'Lato', sans-serif",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          padding: "0.3rem 0.65rem",
                          borderRadius: "2px",
                          background: "#14532d",
                          color: "#86efac",
                        }}
                      >
                        Active
                      </span>
                    </div>

                    {/* Info */}
                    <div
                      style={{
                        padding: "1.25rem 1.25rem 0.75rem",
                        flex: 1,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.35rem",
                          fontWeight: 700,
                          color: "var(--c21-black)",
                          margin: "0 0 0.2rem",
                        }}
                      >
                        {formatPrice(listing.price)}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Lato', sans-serif",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#333",
                          margin: "0 0 0.15rem",
                        }}
                      >
                        {listing.address}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Lato', sans-serif",
                          fontSize: "0.82rem",
                          color: "#888",
                          margin: "0 0 0.85rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <MapPin size={12} style={{ flexShrink: 0 }} />
                        {listing.city}, {listing.state} {listing.zip}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "1.25rem",
                          marginBottom: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {listing.beds != null && listing.beds > 0 && (
                          <span
                            style={{
                              fontFamily: "'Lato', sans-serif",
                              fontSize: "0.8rem",
                              color: "#555",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <Bed size={13} style={{ color: "var(--c21-gold-dark)" }} />
                            {listing.beds} bd
                          </span>
                        )}
                        {listing.baths != null && listing.baths > 0 && (
                          <span
                            style={{
                              fontFamily: "'Lato', sans-serif",
                              fontSize: "0.8rem",
                              color: "#555",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <Bath size={13} style={{ color: "var(--c21-gold-dark)" }} />
                            {listing.baths} ba
                          </span>
                        )}
                        {listing.sqft != null && listing.sqft > 0 && (
                          <span
                            style={{
                              fontFamily: "'Lato', sans-serif",
                              fontSize: "0.8rem",
                              color: "#555",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <Square size={13} style={{ color: "var(--c21-gold-dark)" }} />
                            {listing.sqft.toLocaleString()} sf
                          </span>
                        )}
                      </div>

                      {/* Agent */}
                      {listing.agentName && (
                        <div
                          style={{
                            borderTop: "1px solid #f0ece4",
                            paddingTop: "0.85rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.3rem",
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "'Lato', sans-serif",
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "#aaa",
                              margin: 0,
                            }}
                          >
                            Listing Agent
                          </p>
                          <p
                            style={{
                              fontFamily: "'Lato', sans-serif",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              color: "var(--c21-black)",
                              margin: 0,
                              textTransform: "capitalize",
                            }}
                          >
                            {listing.agentName.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                          </p>
                          {phone && (
                            <a
                              href={`tel:${(listing.agentPhone ?? "").replace(/\D/g, "")}`}
                              style={{
                                fontFamily: "'Lato', sans-serif",
                                fontSize: "0.78rem",
                                color: "#555",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.35rem",
                              }}
                            >
                              <Phone size={12} style={{ color: "var(--c21-gold-dark)" }} />
                              {phone}
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div
                      style={{
                        padding: "0.75rem 1.25rem 1.25rem",
                        display: "flex",
                        gap: "0.6rem",
                      }}
                    >
                      <a
                        href={`mailto:${agentEmail}?subject=Showing Request - ${listing.address}`}
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.4rem",
                          background: "var(--c21-gold)",
                          color: "var(--c21-black)",
                          fontFamily: "'Lato', sans-serif",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          padding: "0.6rem",
                          borderRadius: "2px",
                          textDecoration: "none",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.background =
                            "var(--c21-gold-dark)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.background =
                            "var(--c21-gold)";
                        }}
                      >
                        <Mail size={13} /> Schedule
                      </a>
                      <a
                        href={detailUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.4rem",
                          background: "transparent",
                          color: "var(--c21-black)",
                          fontFamily: "'Lato', sans-serif",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          padding: "0.6rem 0.85rem",
                          borderRadius: "2px",
                          textDecoration: "none",
                          border: "1.5px solid #d0ccc2",
                          transition: "border-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.borderColor =
                            "var(--c21-gold)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.borderColor =
                            "#d0ccc2";
                        }}
                      >
                        <ExternalLink size={13} /> Details
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── IDX Callout ───────────────────────────────────────── */}
        <section
          style={{
            background: "var(--c21-off-white)",
            borderTop: "1px solid #e8e4dc",
            padding: "4rem 2rem",
          }}
        >
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              gap: "3rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flex: "1 1 300px" }}>
              <p className="c21-section-eyebrow">Full MLS Access</p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  fontWeight: 700,
                  color: "var(--c21-black)",
                  lineHeight: 1.2,
                  margin: "0 0 0.85rem",
                }}
              >
                Don't See What You're Looking For?
              </h2>
              <p
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.95rem",
                  color: "#555",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Browse the full MLS for every active listing in Southern California - filter by price, city, beds, and more. Or contact our office to schedule a private showing at any time.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
                flex: "0 0 auto",
              }}
            >
              <a href="/our-listings" className="c21-btn-gold">
                <Search size={15} /> View All Listings
              </a>
              <a href={contactUrl} className="c21-btn-outline-dark">
                <Calendar size={15} /> Contact an Agent
              </a>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────────── */}
        <section className="c21-cta-section">
          <div className="c21-cta-inner">
            <div className="c21-cta-text">
              <h2>Ready to Tour a Home?</h2>
              <p>
                Our agents are available to walk you through any property - private showing or open house. Reach out to get started.
              </p>
            </div>
            <div className="c21-cta-actions">
              <a href={contactUrl} className="c21-btn-outline-white">
                <Calendar size={15} /> Contact an Agent
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
