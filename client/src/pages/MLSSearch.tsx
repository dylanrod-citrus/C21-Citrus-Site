/*
  CENTURY 21 CITRUS REALTY - MLS SEARCH / MAP PAGE
  Interactive map with live active listings as pins.
  City cards filter listings shown below the map.
  Data: /api/mdm/recent-sales - real MLS photos, live addresses.
  Geocoding: Google Maps Geocoder API (client-side, no key needed via Manus proxy).
*/
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import {
  Bed, Bath, Maximize2, MapPin, Building2, X, ChevronRight,
  Loader2, Home, ExternalLink,
} from "lucide-react";
import SiteNav from "../components/SiteNav";
import { MapView } from "../components/Map";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiListing {
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

interface GeoListing extends ApiListing {
  lat: number;
  lng: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n: number): string {
  if (!n) return "Price on Request";
  return "$" + n.toLocaleString("en-US");
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

const TYPE_COLORS: Record<string, string> = {
  Residential: "#121212",
  "Multi-Unit": "#1e3a5f",
  Commercial: "#3b1f00",
  Land: "#14532d",
  "Mobile Home": "#4a1d96",
  Rental: "#7c2d12",
};

function buildDetailUrl(listing: ApiListing): string {
  return `/listing/${listing.listingId}`;
}

// Geocode a single address string using the Google Maps Geocoder
async function geocodeAddress(
  geocoder: google.maps.Geocoder,
  address: string
): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const loc = results[0].geometry.location;
        resolve({ lat: loc.lat(), lng: loc.lng() });
      } else {
        resolve(null);
      }
    });
  });
}

// ─── Listing Card ─────────────────────────────────────────────────────────────

function ListingCard({ listing }: { listing: GeoListing }) {
  const type = formatType(listing.propertyType);
  const detailUrl = buildDetailUrl(listing);

  return (
    <a
      href={detailUrl}
      style={{
        display: "flex", flexDirection: "column", background: "#fff",
        border: "1px solid #e8e4dc", borderRadius: "4px", overflow: "hidden",
        textDecoration: "none", transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.11)";
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
        (e.currentTarget as HTMLAnchorElement).style.transform = "none";
      }}
    >
      <div style={{ position: "relative", height: "180px", overflow: "hidden", background: "#f0ece4" }}>
        {listing.photoUrl ? (
          <img
            src={listing.photoUrl}
            alt={listing.address}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Home size={32} style={{ color: "#ccc" }} />
          </div>
        )}
        <span style={{
          position: "absolute", top: "10px", left: "10px",
          background: TYPE_COLORS[type] || "#121212",
          color: "#fff", fontFamily: "'Lato', sans-serif",
          fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.1em",
          textTransform: "uppercase", padding: "3px 8px", borderRadius: "2px",
        }}>{type}</span>
        <span style={{
          position: "absolute", top: "10px", right: "10px",
          background: "#14532d", color: "#86efac",
          fontFamily: "'Lato', sans-serif",
          fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.1em",
          textTransform: "uppercase", padding: "3px 8px", borderRadius: "2px",
        }}>Active</span>
      </div>
      <div style={{ padding: "1rem 1.1rem 1.1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--c21-gold-dark)" }}>
          {formatPrice(listing.price)}
        </div>
        <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "var(--c21-black)", lineHeight: 1.3 }}>
          {listing.address}
        </div>
        <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.8rem", color: "#777", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <MapPin size={11} /> {listing.city}, {listing.state}
        </div>
        {(listing.beds || listing.baths || listing.sqft) && (
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem", fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", color: "#555", flexWrap: "wrap" }}>
            {listing.beds != null && listing.beds > 0 && <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Bed size={12} /> {listing.beds} bd</span>}
            {listing.baths != null && listing.baths > 0 && <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Bath size={12} /> {listing.baths} ba</span>}
            {listing.sqft != null && listing.sqft > 0 && <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Maximize2 size={12} /> {listing.sqft.toLocaleString()} sqft</span>}
          </div>
        )}
        <div style={{ marginTop: "auto", paddingTop: "0.6rem", fontFamily: "'Lato', sans-serif", fontSize: "0.7rem", color: "#aaa", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          MLS# {listing.listingId} <ExternalLink size={10} style={{ opacity: 0.5 }} />
        </div>
      </div>
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MLSSearch() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [listings, setListings] = useState<ApiListing[]>([]);
  const [geoListings, setGeoListings] = useState<GeoListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Fetch live listings from API
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

  // Unique cities from live data
  const cities = useMemo(() => {
    const set = new Set(listings.map((l) => l.city).filter(Boolean));
    return Array.from(set).sort();
  }, [listings]);

  // Geocode all listings once map is ready and listings are loaded
  useEffect(() => {
    if (!mapReady || listings.length === 0 || !geocoderRef.current) return;

    setGeocoding(true);
    const geocoder = geocoderRef.current;

    const geocodeAll = async () => {
      const results: GeoListing[] = [];
      // Process in small batches to avoid rate limits
      for (let i = 0; i < listings.length; i++) {
        const listing = listings[i];
        const fullAddress = `${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}`;
        const coords = await geocodeAddress(geocoder, fullAddress);
        if (coords) {
          results.push({ ...listing, ...coords });
        }
        // Small delay between geocode requests
        if (i < listings.length - 1) {
          await new Promise((r) => setTimeout(r, 100));
        }
      }
      setGeoListings(results);
      setGeocoding(false);
    };

    geocodeAll();
  }, [mapReady, listings]);

  // Place markers on map when geoListings are ready
  useEffect(() => {
    if (!mapRef.current || geoListings.length === 0) return;
    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];

    geoListings.forEach((listing) => {
      const type = formatType(listing.propertyType);
      const detailUrl = buildDetailUrl(listing);

      const pinEl = document.createElement("div");
      pinEl.style.cssText = `
        background: var(--c21-gold, #c9a84c);
        color: #121212;
        font-family: 'Lato', sans-serif;
        font-size: 11px;
        font-weight: 800;
        padding: 4px 8px;
        border-radius: 3px;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        cursor: pointer;
        border: 1.5px solid rgba(0,0,0,0.15);
      `;
      pinEl.textContent = formatPrice(listing.price);

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: listing.lat, lng: listing.lng },
        title: listing.address,
        content: pinEl,
      });

      marker.addListener("click", () => {
        const photoHtml = listing.photoUrl
          ? `<img src="${listing.photoUrl}" alt="${listing.address}" style="width:100%;height:120px;object-fit:cover;border-radius:3px;margin-bottom:8px;" />`
          : "";
        const bedsText = listing.beds && listing.beds > 0 ? `${listing.beds} bd` : "";
        const bathsText = listing.baths && listing.baths > 0 ? `· ${listing.baths} ba` : "";
        const sqftText = listing.sqft && listing.sqft > 0 ? `· ${listing.sqft.toLocaleString()} sqft` : "";
        const statsLine = [bedsText, bathsText, sqftText].filter(Boolean).join(" ");

        const content = `
          <div style="font-family:'Lato',sans-serif;max-width:240px;padding:4px 0;">
            ${photoHtml}
            <div style="font-size:0.72rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${TYPE_COLORS[type] || "#121212"};background:#f7f6f3;padding:2px 6px;border-radius:2px;display:inline-block;margin-bottom:6px;">${type}</div>
            <div style="font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:#b8860b;margin-bottom:4px;">${formatPrice(listing.price)}</div>
            <div style="font-size:0.85rem;font-weight:700;color:#121212;margin-bottom:2px;">${listing.address}</div>
            <div style="font-size:0.78rem;color:#666;margin-bottom:6px;">${listing.city}, ${listing.state}</div>
            ${statsLine ? `<div style="font-size:0.75rem;color:#555;margin-bottom:8px;">${statsLine}</div>` : ""}
            <a href="${detailUrl}" target="_blank" style="display:inline-block;background:#c9a84c;color:#121212;font-size:0.7rem;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;padding:5px 12px;border-radius:2px;text-decoration:none;">View Details →</a>
          </div>
        `;
        infoWindowRef.current!.setContent(content);
        infoWindowRef.current!.open(map, marker);
      });

      markersRef.current.push(marker);
    });
  }, [geoListings]);

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    geocoderRef.current = new google.maps.Geocoder();
    infoWindowRef.current = new google.maps.InfoWindow();
    setMapReady(true);
  }, []);

  // Pan map to city when a city card is clicked
  const handleCityClick = useCallback((city: string) => {
    setSelectedCity((prev) => (prev === city ? null : city));
    if (!mapRef.current) return;
    const cityListings = geoListings.filter((l) => l.city === city);
    if (cityListings.length === 0) return;
    if (cityListings.length === 1) {
      mapRef.current.panTo({ lat: cityListings[0].lat, lng: cityListings[0].lng });
      mapRef.current.setZoom(14);
    } else {
      const bounds = new google.maps.LatLngBounds();
      cityListings.forEach((l) => bounds.extend({ lat: l.lat, lng: l.lng }));
      mapRef.current.fitBounds(bounds, 80);
    }
  }, [geoListings]);

  const filteredListings = useMemo(() =>
    selectedCity ? geoListings.filter((l) => l.city === selectedCity) : [],
    [selectedCity, geoListings]
  );

  const totalCount = geoListings.length || listings.length;

  return (
    <div style={{ fontFamily: "'Lato', sans-serif", background: "#f7f6f3", minHeight: "100vh" }}>
      <SiteNav activeTab="Home Search" />

      {/* Hero banner */}
      <section style={{ background: "var(--c21-black)", padding: "3rem 2rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.6rem" }}>
          Active Listings Map
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: "0.75rem" }}>
          Explore Homes Across Southern California
        </h1>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.7)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
          {loading
            ? "Loading active listings…"
            : geocoding
            ? `Placing ${totalCount} listings on the map…`
            : `Browse all ${totalCount} active listings - click any pin for details, or select a city to filter results.`}
        </p>
      </section>

      {/* Loading / Error state */}
      {loading && (
        <div style={{ height: "520px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0ede8" }}>
          <div style={{ textAlign: "center", color: "#888" }}>
            <Loader2 size={36} style={{ margin: "0 auto 1rem", opacity: 0.4, animation: "spin 1s linear infinite" }} />
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem" }}>Loading listings…</p>
          </div>
        </div>
      )}

      {error && (
        <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0ede8" }}>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "#888", fontSize: "0.9rem" }}>{error}</p>
        </div>
      )}

      {/* Interactive Map */}
      {!loading && !error && (
        <section style={{ background: "#fff", borderBottom: "1px solid #e8e4dc" }}>
          <MapView
            initialCenter={{ lat: 34.08, lng: -117.85 }}
            initialZoom={10}
            onMapReady={handleMapReady}
            className="w-full"
          />
          {geocoding && (
            <div style={{ padding: "0.75rem 2rem", background: "#fffbf0", borderBottom: "1px solid #f0e8c8", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Loader2 size={14} style={{ color: "var(--c21-gold-dark)", animation: "spin 1s linear infinite" }} />
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.82rem", color: "#888" }}>
                Placing listings on map… ({geoListings.length}/{listings.length})
              </span>
            </div>
          )}
        </section>
      )}

      {/* Search by City */}
      {!loading && !error && (
        <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "3.5rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold-dark)", marginBottom: "0.5rem" }}>
              Browse by Location
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.5rem" }}>
              Search by City
            </h2>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", color: "#777" }}>
              Click a city to see all listings in that area
            </p>
          </div>

          {cities.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
              <Loader2 size={24} style={{ margin: "0 auto 0.5rem", animation: "spin 1s linear infinite" }} />
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.85rem" }}>Loading cities…</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.85rem", marginBottom: "2.5rem" }}>
              {cities.map((city) => {
                const count = geoListings.filter((l) => l.city === city).length;
                const rawCount = listings.filter((l) => l.city === city).length;
                const displayCount = count || rawCount;
                const isActive = selectedCity === city;
                return (
                  <button
                    key={city}
                    onClick={() => handleCityClick(city)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: isActive ? "var(--c21-black)" : "#fff",
                      border: isActive ? "1.5px solid var(--c21-gold)" : "1px solid #e8e4dc",
                      borderRadius: "3px", padding: "0.9rem 1.1rem",
                      cursor: "pointer", transition: "all 0.2s", textAlign: "left",
                      boxShadow: isActive ? "0 4px 16px rgba(0,0,0,0.12)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLButtonElement).style.transform = "none";
                      }
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                      <MapPin size={14} style={{ color: isActive ? "var(--c21-gold)" : "var(--c21-gold-dark)", flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.88rem", fontWeight: 700, color: isActive ? "#fff" : "var(--c21-black)" }}>{city}</span>
                    </div>
                    <span style={{
                      fontFamily: "'Lato', sans-serif", fontSize: "0.7rem", fontWeight: 800,
                      background: isActive ? "var(--c21-gold)" : "#f0ede8",
                      color: isActive ? "var(--c21-black)" : "#888",
                      borderRadius: "20px", padding: "2px 8px", minWidth: "24px", textAlign: "center",
                    }}>{displayCount}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* City listings results */}
          {selectedCity && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.2rem" }}>
                    Listings in {selectedCity}
                  </h3>
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.85rem", color: "#777" }}>
                    {filteredListings.length} {filteredListings.length === 1 ? "property" : "properties"} found
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCity(null)}
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "1px solid #ddd", borderRadius: "3px", padding: "0.45rem 0.9rem", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#666" }}
                >
                  <X size={13} /> Clear filter
                </button>
              </div>
              {filteredListings.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
                  {filteredListings.map((l) => (
                    <ListingCard key={l.listingId} listing={l} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "3rem", background: "#fff", border: "1px solid #e8e4dc", borderRadius: "4px" }}>
                  <MapPin size={32} style={{ color: "#ddd", marginBottom: "0.75rem" }} />
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", color: "#888" }}>
                    {geocoding ? "Still placing listings on map…" : `No active listings in ${selectedCity} at this time.`}
                  </p>
                  <a href="/our-listings" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "1rem", color: "var(--c21-gold-dark)", fontFamily: "'Lato', sans-serif", fontSize: "0.82rem", fontWeight: 700, textDecoration: "none" }}>
                    View all our listings <ChevronRight size={14} />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Our listings CTA */}
          <div style={{ marginTop: "3rem", background: "var(--c21-black)", borderRadius: "4px", padding: "2rem 2.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>
                See Century 21 Citrus Realty's Own Listings
              </h3>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
                Browse properties listed directly by our agents - with local expertise behind every one.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a href="/our-listings" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "var(--c21-gold)", color: "var(--c21-black)", fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.65rem 1.25rem", borderRadius: "2px", textDecoration: "none" }}>
                <Building2 size={13} /> Our Listings
              </a>
              <a href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.65rem 1.25rem", borderRadius: "2px", textDecoration: "none" }}>
                Contact an Agent
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Footer placeholder */}
    </div>
  );
}
