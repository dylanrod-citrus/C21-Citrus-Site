/*
  CENTURY 21 CITRUS REALTY - HOME PAGE
  Design: C21 brand-aligned luxury real estate portal
  Layout: Utility bar → Sticky nav → Full-width hero → Search strip →
          Featured listings → Services → Testimonials → About → Resources → CTA → Footer
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
  Rule: Never write "Century 21" in visible copy - always use the logo image
*/
import {
  ArrowRight,
  BedDouble,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  Home as HomeIcon,
  KeyRound,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Quote,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LocationSuggestion } from "@shared/locationSearch";
import { trackSelectedLocation } from "../lib/searchAnalytics";
import { C21_ASSET_PATHS } from "../lib/portableAssets";
import SiteNav from "../components/SiteNav";

/* ── Asset URLs ─────────────────────────────────────────────── */
const logoUrl = C21_ASSET_PATHS.logo;
const heroImageUrl = C21_ASSET_PATHS.homeHero;
const interiorImageUrl = C21_ASSET_PATHS.interiorHero;
const neighborhoodImageUrl = C21_ASSET_PATHS.neighborhoodHero;
const c21SealImageUrl = C21_ASSET_PATHS.seal;

/* ── External links ─────────────────────────────────────────── */
const idxSearchUrl = "https://c21citrus.com/search/";
const officeListingsUrl = "/our-listings";
const valuationUrl = "https://cloudattract.com/7442b3";
const contactUrl = "/contact";
const buyingProcessUrl = "/home-buying-process";
const sellingProcessUrl = "/home-selling-process";
const phoneUrl = "tel:19095928500";
const emailUrl = "mailto:oj@c21citrus.com";

/* ── Fallback listing image ──────────────────────────────────── */
const fallbackListingImg = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80";

/* ── Types ───────────────────────────────────────────────────── */
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
  photoUrl: string | null;
  agentName: string | null;
  listingDate: string | null;
}

const services = [
  {
    icon: KeyRound,
    title: "Buy a Home",
    copy: "Search current inventory, narrow your priorities, and move from online browsing to a real showing with a local Century 21 Citrus Realty guide.",
    href: buyingProcessUrl,
    cta: "Start Your Search",
  },
  {
    icon: TrendingUp,
    title: "Sell Your Home",
    copy: "Understand your home's value, then prepare pricing, presentation, and launch strategy with a brokerage team focused on clear results.",
    href: sellingProcessUrl,
    cta: "Get a Home Value",
  },
  {
    icon: Building2,
    title: "Our Listings",
    copy: "Browse properties actively presented by Century 21 Citrus Realty agents. Residential, commercial, and investment opportunities across Southern California.",
    href: officeListingsUrl,
    cta: "View All Listings",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    copy: "Serving San Dimas, Glendora, La Verne, Pomona, and the greater San Gabriel Valley with deep neighborhood knowledge and market insight.",
    href: contactUrl,
    cta: "Connect With Us",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Guidance",
    copy: "From first-time buyers to seasoned investors, our agents provide honest, experienced counsel at every step of your real estate journey.",
    href: contactUrl,
    cta: "Meet Our Team",
  },
  {
    icon: BriefcaseBusiness,
    title: "Join Our Team",
    copy: "Experienced and new agents are welcome to connect with the office about brokerage culture, tools, and growth opportunities.",
    href: contactUrl,
    cta: "Explore Careers",
  },
];

// Testimonials section removed — fabricated reviews violate FTC 16 CFR Part 255.
// Replace with live RealSatisfied widget or verified client quotes when available.

const resourceLinks = [
  {
    title: "Home Buying Process",
    copy: "A clear buyer journey from search to offer, inspection, financing, and closing day.",
    href: buyingProcessUrl,
  },
  {
    title: "Home Selling Process",
    copy: "A seller path that starts with value, then moves into preparation, marketing, and closing.",
    href: sellingProcessUrl,
  },
  {
    title: "Find an Agent",
    copy: "Connect with Century 21 Citrus Realty agents for local guidance, showings, and pricing conversations.",
    href: "#agents",
  },
  {
    title: "MLS Property Search",
    copy: "Search the full MLS for active listings across Southern California.",
    href: idxSearchUrl,
  },
  {
    title: "Home Valuation",
    copy: "Get a professional estimate of your home's current market value.",
    href: valuationUrl,
  },
  {
    title: "Careers",
    copy: "Explore opportunities to grow your real estate career with Century 21 Citrus Realty.",
    href: contactUrl,
  },
];

const footerCols = [
  {
    title: "Buy",
    links: [
      { label: "Search Homes", href: idxSearchUrl },
      { label: "Our Listings", href: officeListingsUrl },
      { label: "Buying Process", href: buyingProcessUrl },
    ],
  },
  {
    title: "Sell",
    links: [
      { label: "Home Valuation", href: valuationUrl },
      { label: "Selling Process", href: sellingProcessUrl },
      { label: "Schedule Consultation", href: contactUrl },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Agents", href: "/agents" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/* ── RealSatisfied Testimonials Sub-component ───────────────── */
interface Testimonial {
  id: string;
  quote: string;
  author: string;
  agentName: string | null;
  rating: number | null;
  date: string | null;
}

function RealSatisfiedTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    fetch("/api/realsatisfied/testimonials")
      .then((r) => r.json())
      .then((data: { testimonials?: Testimonial[] }) => {
        setTestimonials(data.testimonials || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (testimonials.length < 2) return;
    const t = setInterval(() => setActiveIdx((i) => (i + 1) % testimonials.length), 7000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  // Don't render the section at all if no testimonials and not loading
  if (!loading && testimonials.length === 0) return null;

  const current = testimonials[activeIdx];

  return (
    <section className="c21-testimonials-section">
      <div className="c21-testimonials-inner">
        <p className="c21-section-eyebrow" style={{ justifyContent: "center", color: "var(--c21-gold)" }}>
          Client Stories
        </p>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "2rem 0", color: "rgba(255,255,255,0.5)" }}>
            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.85rem" }}>Loading client stories…</span>
          </div>
        ) : current ? (
          <>
            <Quote size={28} stroke="var(--c21-gold)" fill="none" strokeWidth={1.5} style={{ margin: "0 auto 1rem", display: "block", opacity: 0.7 }} />
            <blockquote className="c21-testimonial-quote">
              {current.quote}
            </blockquote>
            <p className="c21-testimonial-author">
              {current.author}
              {current.agentName && (
                <>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400, margin: "0 0.5rem" }}>·</span>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400, letterSpacing: "0.06em", fontSize: "0.85em" }}>Agent: {current.agentName}</span>
                </>
              )}
              {current.rating !== null && (
                <>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400, margin: "0 0.5rem" }}>·</span>
                  <span style={{ color: "var(--c21-gold)", fontSize: "0.85em" }}>
                    {Array.from({ length: Math.round(current.rating) }).map((_, i) => (
                      <Star key={i} size={12} fill="var(--c21-gold)" stroke="none" style={{ display: "inline", marginRight: "1px" }} />
                    ))}
                  </span>
                </>
              )}
            </p>
            {testimonials.length > 1 && (
              <div className="c21-testimonial-dots">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`c21-testimonial-dot${i === activeIdx ? " active" : ""}`}
                    onClick={() => setActiveIdx(i)}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}
        <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: "1.5rem", textAlign: "center", fontFamily: "'Lato', sans-serif" }}>
          Reviews collected and verified by{" "}
          <a href="https://www.realsatisfied.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>RealSatisfied</a>
        </p>
      </div>
    </section>
  );
}

/* ── Component ───────────────────────────────────────────────── */
export default function Home() {
  // testimonialIdx state removed with testimonials section
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertyType, setPropertyType] = useState("");

  // Recent sales (live from MLS API)
  const [recentSales, setRecentSales] = useState<MlsListing[]>([]);
  const [salesLoading, setSalesLoading] = useState(true);

  // Search results dropdown
  const [searchResults, setSearchResults] = useState<MlsListing[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live local-inventory city/ZIP autocomplete
  const [placeSuggestions, setPlaceSuggestions] = useState<LocationSuggestion[]>([]);
  const [showPlaceSuggestions, setShowPlaceSuggestions] = useState(false);
  const placesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const placesRequestRef = useRef(0);
  const [activePlaceSuggestion, setActivePlaceSuggestion] = useState(-1);
  const [locationSuggestionProvider, setLocationSuggestionProvider] = useState<"inventory" | "cache">("inventory");

  /* Load recent sales on mount */
  useEffect(() => {
    fetch("/api/mdm/recent-sales")
      .then((r) => r.json())
      .then((data) => {
        setRecentSales((data.listings || []).slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setSalesLoading(false));
  }, []);

  /* Live MLS search + Places autocomplete as user types */
  const handleSearchInput = useCallback((value: string) => {
    setSearchQuery(value);
    setActivePlaceSuggestion(-1);
    placesRequestRef.current += 1;
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (placesDebounceRef.current) clearTimeout(placesDebounceRef.current);

    if (value.trim().length < 2) {
      setSearchResults([]);
      setPlaceSuggestions([]);
      setShowResults(false);
      setShowPlaceSuggestions(false);
      return;
    }

    // Current live-inventory city/ZIP suggestions
    if (value.trim().length >= 2) {
      const requestId = placesRequestRef.current;
      placesDebounceRef.current = setTimeout(async () => {
        try {
          const response = await fetch(`/api/maps/autocomplete?q=${encodeURIComponent(value.trim())}`);
          if (!response.ok) throw new Error(`Autocomplete ${response.status}`);
          const data = await response.json() as { suggestions?: LocationSuggestion[]; provider?: "inventory" | "cache" };
          if (requestId !== placesRequestRef.current) return;
          const suggestions = data.suggestions || [];
          setLocationSuggestionProvider(data.provider || "inventory");
          setPlaceSuggestions(suggestions);
          setShowPlaceSuggestions(suggestions.length > 0);
        } catch {
          if (requestId !== placesRequestRef.current) return;
          setPlaceSuggestions([]);
          setShowPlaceSuggestions(false);
        }
      }, 100);
    }

    if (value.trim().length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // MLS listing search
    searchDebounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const r = await fetch(`/api/mdm/search?q=${encodeURIComponent(value.trim())}`);
        const data = await r.json();
        setSearchResults((data.listings || []).slice(0, 8));
        setShowResults(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  }, []);

  const handlePlaceSuggestionClick = useCallback((suggestion: LocationSuggestion) => {
    trackSelectedLocation(suggestion);
    setSearchQuery(suggestion.query);
    setShowPlaceSuggestions(false);
    setPlaceSuggestions([]);
    setActivePlaceSuggestion(-1);
    setSearchLoading(true);
    fetch(`/api/mdm/search?q=${encodeURIComponent(suggestion.query)}`)
      .then((r) => r.json())
      .then((data) => {
        setSearchResults((data.listings || []).slice(0, 8));
        setShowResults(true);
      })
      .catch(() => setSearchResults([]))
      .finally(() => setSearchLoading(false));
  }, []);

  const handleSearchKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showPlaceSuggestions || placeSuggestions.length === 0) {
      if (event.key === "Escape") {
        setShowResults(false);
        setShowPlaceSuggestions(false);
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActivePlaceSuggestion((current) => (current + 1) % placeSuggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActivePlaceSuggestion((current) => current <= 0 ? placeSuggestions.length - 1 : current - 1);
    } else if (event.key === "Enter" && activePlaceSuggestion >= 0) {
      event.preventDefault();
      handlePlaceSuggestionClick(placeSuggestions[activePlaceSuggestion]);
    } else if (event.key === "Escape") {
      setShowPlaceSuggestions(false);
      setActivePlaceSuggestion(-1);
    }
  }, [activePlaceSuggestion, handlePlaceSuggestionClick, placeSuggestions, showPlaceSuggestions]);

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
        setShowPlaceSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to the internal search results page
      const params = new URLSearchParams();
      params.set("q", searchQuery);
      if (priceRange) params.set("price", priceRange);
      if (propertyType) params.set("type", propertyType);
      window.location.href = `/search-results?${params.toString()}`;
    }
  };

  // const current = testimonials[testimonialIdx]; // removed

  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }}>
      <SiteNav activeTab="Home" />

      <main id="main-content">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="c21-hero">
          <img
            src={heroImageUrl}
            alt="Luxury Southern California estate"
            className="c21-hero-bg"
          />
          <div className="c21-hero-overlay" />
          <img
            src={c21SealImageUrl}
            alt="Century 21 Citrus Realty"
            style={{
              position: "absolute",
              top: "1.25rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              width: "clamp(68px, 8vw, 104px)",
              height: "auto",
              pointerEvents: "none",
            }}
          />
          <div className="c21-hero-content">
            <h1 className="c21-hero-title">
              Find Your Place in<br />Southern California
            </h1>
            <p className="c21-hero-subtitle">
              Rooted in San Dimas. Serving buyers and sellers from across Southern California.
            </p>
            <div className="c21-hero-actions">
              <a href={idxSearchUrl} className="c21-btn-gold">
                <Search size={15} /> Search Homes
              </a>
              <a href={valuationUrl} className="c21-btn-outline-white">
                <HomeIcon size={15} /> Get Home Value
              </a>
            </div>
          </div>
        </section>

        {/* ── Search Strip ──────────────────────────────────────── */}
        <div className="c21-search-strip">
          <form className="c21-search-strip-inner" onSubmit={handleSearch}>
            <span className="c21-search-label">Quick Search</span>
            <div ref={searchRef} style={{ position: "relative", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                <input
                  type="text"
                  className="c21-search-input"
                  placeholder="City or ZIP code"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onFocus={() => {
                    if (placeSuggestions.length > 0) setShowPlaceSuggestions(true);
                    else if (searchResults.length > 0) setShowResults(true);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={showPlaceSuggestions && placeSuggestions.length > 0}
                  aria-controls="homepage-location-suggestions"
                  aria-activedescendant={activePlaceSuggestion >= 0 ? `homepage-location-${activePlaceSuggestion}` : undefined}
                  autoComplete="off"
                  style={{ width: "100%" }}
                />
                {searchLoading && (
                  <Loader2 size={14} style={{ position: "absolute", right: "0.75rem", color: "#999", animation: "spin 1s linear infinite" }} />
                )}
                {searchQuery && !searchLoading && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); setSearchResults([]); setPlaceSuggestions([]); setShowResults(false); setShowPlaceSuggestions(false); }}
                    aria-label="Clear location search"
                    style={{ position: "absolute", right: "0.75rem", background: "none", border: "none", cursor: "pointer", padding: 0, color: "#999" }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              {/* Google Places city/zip autocomplete suggestions */}
              {showPlaceSuggestions && placeSuggestions.length > 0 && (
                <div id="homepage-location-suggestions" role="listbox" aria-label="Suggested cities and ZIP codes" style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #e0d9c8",
                  borderRadius: "6px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  zIndex: 9999,
                  overflow: "hidden",
                }}>
                  <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid #f0ece0", fontSize: "0.7rem", color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                    Suggested Locations
                  </div>
                  {placeSuggestions.map((suggestion, i) => (
                    <button
                      id={`homepage-location-${i}`}
                      key={suggestion.id}
                      type="button"
                      role="option"
                      aria-selected={i === activePlaceSuggestion}
                      onClick={() => handlePlaceSuggestionClick(suggestion)}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.6rem",
                        width: "100%", padding: "0.6rem 0.75rem",
                        borderBottom: i < placeSuggestions.length - 1 ? "1px solid #f7f5ef" : "none",
                        background: i === activePlaceSuggestion ? "#faf7ef" : "none", border: "none", cursor: "pointer",
                        textAlign: "left", fontSize: "0.82rem", color: "#121212",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#faf7ef")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <MapPin size={13} style={{ color: "#BEAF88", flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{suggestion.label}</span>
                      <span style={{ fontSize: "0.65rem", color: "#8C7D55", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        {suggestion.type === "zip" ? "ZIP" : "City"}
                      </span>
                    </button>
                  ))}
                  <div style={{ padding: "0.4rem 0.75rem", textAlign: "right", borderTop: "1px solid #f0ece0", fontSize: "0.65rem", color: "#888" }}>
                    {locationSuggestionProvider === "cache" ? "Recently updated local suggestions" : "Based on current listings"}
                  </div>
                </div>
              )}

              {/* Live MLS search results dropdown */}
              {showResults && !showPlaceSuggestions && searchResults.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #e0d9c8",
                  borderRadius: "6px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  zIndex: 9999,
                  maxHeight: "340px",
                  overflowY: "auto",
                }}>
                  <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid #f0ece0", fontSize: "0.7rem", color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                    MLS Results - {searchResults.length} properties
                  </div>
                  {searchResults.map((l) => {
                    const slug = `${l.address} ${l.city} ${l.state} ${l.zip}`
                      .toUpperCase()
                      .replace(/[^A-Z0-9\s]/g, "")
                      .replace(/\s+/g, "-");
                    const detailUrl = `/listing/${l.listingId}`;
                    return (
                    <a
                      key={l.listingId}
                      href={detailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowResults(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.6rem 0.75rem",
                        borderBottom: "1px solid #f7f5ef",
                        textDecoration: "none",
                        color: "#121212",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#faf7ef")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 4,
                        overflow: "hidden",
                        flexShrink: 0,
                        background: "#f0ece0",
                      }}>
                        <img
                          src={l.photoUrl || fallbackListingImg}
                          alt={l.address}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {l.address}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#666" }}>
                          {l.city}, {l.state} {l.zip}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#BEAF88" }}>
                          ${l.price.toLocaleString()}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#999" }}>
                          {l.beds != null && l.beds > 0 ? `${l.beds}bd` : ""}{l.baths != null && l.baths > 0 ? ` · ${l.baths}ba` : ""}
                        </div>
                      </div>
                    </a>
                    );
                  })}
                  <a
                    href={`/search-results?q=${encodeURIComponent(searchQuery)}`}
                    style={{ display: "block", padding: "0.6rem 0.75rem", textAlign: "center", fontSize: "0.75rem", color: "#BEAF88", fontWeight: 600, textDecoration: "none", letterSpacing: "0.06em" }}
                  >
                    View all results →
                  </a>
                </div>
              )}
            </div>
            <select
              className="c21-search-select"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              aria-label="Price range"
            >
              <option value="">Any Price</option>
              <option value="under500">Under $500K</option>
              <option value="500to1m">$500K - $1M</option>
              <option value="1mto2m">$1M - $2M</option>
              <option value="over2m">$2M+</option>
            </select>
            <select
              className="c21-search-select"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              aria-label="Property type"
            >
              <option value="">All Types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Land">Land</option>
              <option value="Multi-Unit">Multi-Unit</option>
            </select>
            <button type="submit" className="c21-search-btn">
              <Search size={15} /> Search
            </button>
          </form>
        </div>

        {/* ── Featured Listings ─────────────────────────────────── */}
        <section className="c21-listings-section" id="listings">
          <div className="c21-listings-header">
            <div>
              <p className="c21-section-eyebrow">From Our Office</p>
              <h2 className="c21-section-title">Featured Listings</h2>
            </div>
            <a
              href={officeListingsUrl}
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--c21-gold-dark)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                whiteSpace: "nowrap",
              }}
            >
              View All <ArrowRight size={14} />
            </a>
          </div>

          {salesLoading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 220, gap: "0.75rem", color: "#888" }}>
              <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem" }}>Loading featured listings…</span>
            </div>
          ) : recentSales.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#888", fontFamily: "'Lato', sans-serif" }}>
              <p>Featured listings are temporarily unavailable.</p>
              <a href={officeListingsUrl} style={{ color: "var(--c21-gold-dark)", textDecoration: "none", fontWeight: 600 }}>Browse our listings →</a>
            </div>
          ) : (
            <div className="c21-listings-grid">
              {recentSales.map((listing) => (
                <a key={listing.listingId} href={`/listing/${listing.listingId}`} className="c21-listing-card">
                  <div className="c21-listing-card-img">
                    <img
                      src={listing.photoUrl || fallbackListingImg}
                      alt={listing.address}
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).src = fallbackListingImg; }}
                    />
                    <span className="c21-listing-badge">Active</span>
                  </div>
                  <div className="c21-listing-card-body">
                    <span className="c21-listing-type-badge c21-listing-type-residential">
                      Residential
                    </span>
                    <p className="c21-listing-price">${listing.price.toLocaleString()}</p>
                    <p className="c21-listing-address">
                      {listing.address}<br />{listing.city}, {listing.state} {listing.zip}
                    </p>
                    <div className="c21-listing-meta">
                      {listing.beds != null && listing.beds > 0 && (
                        <span><BedDouble size={13} /> {listing.beds} bd</span>
                      )}
                      {listing.baths != null && listing.baths > 0 && (
                        <span>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22v-7M3 15V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M3 22h18"/></svg>
                          {listing.baths} ba
                        </span>
                      )}
                      {listing.sqft != null && listing.sqft > 0 && (
                        <span>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="1"/></svg>
                          {listing.sqft.toLocaleString()} sf
                        </span>
                      )}
                    </div>
                    {listing.agentName && (
                      <p style={{ fontSize: "0.72rem", color: "#888", marginTop: "0.4rem", fontFamily: "'Lato', sans-serif" }}>
                        Listed by {listing.agentName}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* ── Services ──────────────────────────────────────────── */}
        <section className="c21-services-section" id="services">
          <div className="c21-services-inner">
            <div className="c21-services-header">
              <p className="c21-section-eyebrow">How We Help</p>
              <h2 className="c21-section-title">Real Estate, Simplified</h2>
              <p className="c21-section-subtitle" style={{ margin: "0 auto" }}>
                Whether you're buying your first home, selling your home, or exploring the market, our team provides clear guidance at every step.
              </p>
            </div>
            <div className="c21-services-grid">
              {services.map((svc) => (
                <a key={svc.title} href={svc.href} className="c21-service-card">
                  <div className="c21-service-icon">
                    <svc.icon size={22} />
                  </div>
                  <h3>{svc.title}</h3>
                  <p>{svc.copy}</p>
                  <span className="c21-service-link">
                    {svc.cta} <ChevronRight size={13} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── RealSatisfied Testimonials ────────────────────── */}
        <RealSatisfiedTestimonials />

        {/* ── About / Stats ─────────────────────────────────────── */}
        <section className="c21-about-section" id="about">
          <div className="c21-about-inner">
            <div className="c21-about-image">
              <img src={neighborhoodImageUrl} alt="Southern California neighborhood aerial view" />
              <span className="c21-about-image-badge">
                <Star size={12} style={{ display: "inline", marginRight: "0.3rem" }} />
                Serving SoCal Since 1972
              </span>
            </div>
            <div>
              <p className="c21-section-eyebrow">About Century 21 Citrus Realty</p>
              <h2 className="c21-section-title">Local Knowledge.<br />Global Brand.</h2>
              <p className="c21-section-subtitle">
                Century 21 Citrus Realty combines the reach and resources of the world's most recognized real estate brand with the personal attention of a locally rooted team. We know Southern California, its neighborhoods, its market rhythms, and its people.
              </p>
              <div className="c21-about-stats">
                <div className="c21-stat-item">
                  <p className="c21-stat-number">53+</p>
                  <p className="c21-stat-label">Years Serving SoCal</p>
                </div>
                <div className="c21-stat-item">
                  <p className="c21-stat-number">Thousands</p>
                  <p className="c21-stat-label">Of Homes Sold</p>
                </div>
                <div className="c21-stat-item">
                  <p className="c21-stat-number">$Billions</p>
                  <p className="c21-stat-label">In Sales Volume</p>
                </div>
                <div className="c21-stat-item">
                  <p className="c21-stat-number">5★</p>
                  <p className="c21-stat-label">Client Rating</p>
                </div>
              </div>
              <div style={{ marginTop: "2rem" }}>
                <a href={contactUrl} className="c21-btn-gold">
                  Contact Our Team <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Resources ─────────────────────────────────────────── */}
        <section className="c21-resources-section" id="resources">
          <div className="c21-resources-inner">
            <div className="c21-resources-header">
              <p className="c21-section-eyebrow">Helpful Guides</p>
              <h2 className="c21-section-title">Resources for Every Step</h2>
            </div>
            <div className="c21-resources-grid">
              {resourceLinks.map((res) => (
                <a key={res.title} href={res.href} className="c21-resource-card">
                  <div className="c21-resource-card-content">
                    <h3>{res.title}</h3>
                    <p>{res.copy}</p>
                  </div>
                  <ArrowRight size={18} className="c21-resource-arrow" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────────── */}
        <section className="c21-cta-section">
          <div className="c21-cta-inner">
            <div className="c21-cta-text">
              <h2>Ready to Make Your Move?</h2>
              <p>Search homes, get a valuation, or connect with a local agent today.</p>
            </div>
            <div className="c21-cta-actions">
              <a href={idxSearchUrl} className="c21-btn-black">
                <Search size={15} /> Search Homes
              </a>
              <a href={contactUrl} className="c21-btn-outline-black">
                <Phone size={15} /> Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
    </div>
  );
}
