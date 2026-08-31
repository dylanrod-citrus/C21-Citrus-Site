/**
 * ListingDetail — /listing/:mlsId
 *
 * Full listing detail page matching the C21 Citrus design system.
 * Fetches live data from /api/mdm/listing/:mlsId
 *
 * Design: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
 * Typography: Playfair Display (headings) + Lato (body)
 */

import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "wouter";
import { toast as sonnerToast } from "sonner";
import { FormSpamGuard, readFormSpamPayload } from "../components/FormSpamGuard";
import SiteNav from "../components/SiteNav";

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
  photos: string[];
  description: string | null;
  agentName: string | null;
  agentPhone: string | null;
  listingDate: string | null;
  yearBuilt: number | null;
  lotSize: number | null;
  garageSpaces: number | null;
  latitude: number | null;
  longitude: number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatPhone(phone: string | null): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function formatPropertyType(type: string): string {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ListingDetail() {
  const { mlsId } = useParams<{ mlsId: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const [contactError, setContactError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mlsId]);

  useEffect(() => {
    if (!mlsId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/mdm/listing/${mlsId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: { listing: Listing }) => {
        setListing(data.listing);
        setActivePhoto(0);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [mlsId]);

  const handleContactSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!listing) return;
      const protection = readFormSpamPayload(e.currentTarget as HTMLFormElement);
      if (!protection.turnstileToken) {
        setContactError("Please complete the verification before sending your request.");
        return;
      }
      setContactSending(true);
      setContactError("");
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
            message: `Showing request for listing ${listing.listingId} - ${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}\nListing Agent: ${listing.agentName || 'N/A'}\n\n${contactMessage}`,
            subject: `Showing Request: ${listing.address}, ${listing.city}`,
            recipientOverride: "frontdesk@c21citrus.com",
            ...protection,
          }),
        });
        const body = await response.json().catch(() => ({})) as { success?: boolean; error?: string };
        if (!response.ok || !body.success) throw new Error(body.error || "Unable to send your request.");
        setContactSent(true);
        sonnerToast.success("Request Sent!", {
          description: "We'll be in touch shortly to confirm your showing.",
          duration: 6000,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to send your request. Please call us at 909.592.8500.";
        setContactError(message);
        sonnerToast.error("Unable to send request", {
          description: message,
          duration: 6000,
        });
      } finally {
        setContactSending(false);
      }
    },
    [listing, contactName, contactEmail, contactPhone, contactMessage]
  );

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F6F3" }}>
        <SiteNav />
        <div style={{ paddingTop: "80px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "48px", height: "48px", border: "3px solid #BEAF88",
              borderTopColor: "transparent", borderRadius: "50%",
              animation: "spin 0.8s linear infinite", margin: "0 auto 1rem",
            }} />
            <p style={{ fontFamily: "Lato, sans-serif", color: "#666", fontSize: "1rem" }}>
              Loading listing details…
            </p>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error / Not Found ────────────────────────────────────────────────────────

  if (error || !listing) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F6F3" }}>
        <SiteNav />
        <div style={{ paddingTop: "120px", textAlign: "center", padding: "120px 2rem 4rem" }}>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", color: "#121212", marginBottom: "1rem" }}>
            Listing Not Found
          </h1>
          <p style={{ fontFamily: "Lato, sans-serif", color: "#666", marginBottom: "2rem" }}>
            This listing may have sold or been removed from the market.
          </p>
          <Link href="/our-listings">
            <span style={{
              display: "inline-block", background: "#BEAF88", color: "#121212",
              padding: "0.75rem 2rem", fontFamily: "Lato, sans-serif", fontWeight: 700,
              fontSize: "0.875rem", letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: "pointer", textDecoration: "none",
            }}>
              View All Listings
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const allPhotos = listing.photos.length > 0
    ? listing.photos
    : listing.photoUrl
    ? [listing.photoUrl]
    : [];

  const fullAddress = `${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}`;
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

  return (
    <div id="main-content" tabIndex={-1} style={{ minHeight: "100vh", background: "#F7F6F3", fontFamily: "Lato, sans-serif" }}>
      <SiteNav />

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div style={{ paddingTop: "80px", background: "#121212", padding: "80px 0 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem 2rem 0" }}>
          <nav style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.8rem", color: "#999" }}>
            <Link href="/"><span style={{ color: "#BEAF88", cursor: "pointer", textDecoration: "none" }}>Home</span></Link>
            <span>/</span>
            <Link href="/our-listings"><span style={{ color: "#BEAF88", cursor: "pointer", textDecoration: "none" }}>Our Listings</span></Link>
            <span>/</span>
            <span style={{ color: "#ccc" }}>{listing.address}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero Photo Gallery ─────────────────────────────────────────────── */}
      <div style={{ background: "#121212" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 2rem 0" }}>
          {/* Status + Price header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <span style={{
                display: "inline-block", background: "#BEAF88", color: "#121212",
                padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem",
              }}>
                {listing.status}
              </span>
              <h1 style={{
                fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                color: "#FFFFFF", margin: 0, lineHeight: 1.2,
              }}>
                {listing.address}
              </h1>
              <p style={{ color: "#BEAF88", fontSize: "1rem", margin: "0.25rem 0 0", fontWeight: 400 }}>
                {listing.city}, {listing.state} {listing.zip}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontFamily: "Playfair Display, serif", fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                color: "#BEAF88", fontWeight: 700, lineHeight: 1,
              }}>
                {formatPrice(listing.price)}
              </div>
              <div style={{ color: "#999", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                MLS# {listing.listingId}
              </div>
            </div>
          </div>
        </div>

        {/* Main photo */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
          {allPhotos.length > 0 ? (
            <div>
              <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#111", overflow: "hidden" }}>
                <img
                  src={allPhotos[activePhoto]}
                  alt={`${listing.address} - photo ${activePhoto + 1}`}
                  style={{
                    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                {allPhotos.length > 1 && (
                  <>
                    <button
                      onClick={() => setActivePhoto((p) => (p - 1 + allPhotos.length) % allPhotos.length)}
                      style={{
                        position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)",
                        background: "rgba(0,0,0,0.6)", border: "1px solid rgba(190,175,136,0.4)",
                        color: "#BEAF88", width: "44px", height: "44px", borderRadius: "50%",
                        cursor: "pointer", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                      aria-label="Previous photo"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setActivePhoto((p) => (p + 1) % allPhotos.length)}
                      style={{
                        position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)",
                        background: "rgba(0,0,0,0.6)", border: "1px solid rgba(190,175,136,0.4)",
                        color: "#BEAF88", width: "44px", height: "44px", borderRadius: "50%",
                        cursor: "pointer", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                      aria-label="Next photo"
                    >
                      ›
                    </button>
                    <div style={{
                      position: "absolute", bottom: "1rem", right: "1rem",
                      background: "rgba(0,0,0,0.7)", color: "#BEAF88",
                      padding: "0.25rem 0.75rem", fontSize: "0.8rem", borderRadius: "2px",
                    }}>
                      {activePhoto + 1} / {allPhotos.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {allPhotos.length > 1 && (
                <div style={{
                  display: "flex", gap: "4px", overflowX: "auto", padding: "4px 0",
                  scrollbarWidth: "thin", scrollbarColor: "#BEAF88 #333",
                }}>
                  {allPhotos.slice(0, 20).map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(i)}
                      style={{
                        flexShrink: 0, width: "80px", height: "60px",
                        border: i === activePhoto ? "2px solid #BEAF88" : "2px solid transparent",
                        padding: 0, cursor: "pointer", overflow: "hidden", background: "#111",
                      }}
                      aria-label={`View photo ${i + 1}`}
                    >
                      <img
                        src={url}
                        alt={`Thumbnail ${i + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{
              width: "100%", paddingBottom: "56.25%", background: "#2a2a2a",
              display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
            }}>
              <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#666", fontSize: "1rem" }}>
                No photos available
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "3rem", alignItems: "start" }}>

        {/* Left column */}
        <div>
          {/* Key stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "1px", background: "#ddd", border: "1px solid #ddd", marginBottom: "2.5rem",
          }}>
            {[
              { label: "Bedrooms", value: (listing.beds != null && listing.beds > 0) ? String(listing.beds) : "—" },
              { label: "Bathrooms", value: (listing.baths != null && listing.baths > 0) ? String(listing.baths) : "—" },
              { label: "Sq Ft", value: listing.sqft != null ? listing.sqft.toLocaleString() : "—" },
              { label: "Property Type", value: formatPropertyType(listing.propertyType) },
              ...(listing.yearBuilt ? [{ label: "Year Built", value: String(listing.yearBuilt) }] : []),
              ...(listing.lotSize ? [{ label: "Lot Size", value: `${listing.lotSize.toLocaleString()} sq ft` }] : []),
              ...(listing.garageSpaces ? [{ label: "Garage", value: `${listing.garageSpaces} spaces` }] : []),
            ].map((stat) => (
              <div key={stat.label} style={{ background: "#fff", padding: "1.25rem 1rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#121212", fontFamily: "Playfair Display, serif" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.25rem" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          {listing.description && (
            <div style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", color: "#121212", marginBottom: "1rem", borderBottom: "2px solid #BEAF88", paddingBottom: "0.5rem" }}>
                About This Property
              </h2>
              <p style={{ color: "#444", lineHeight: 1.8, fontSize: "1rem" }}>
                {listing.description}
              </p>
            </div>
          )}

          {/* Listing details table */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", color: "#121212", marginBottom: "1rem", borderBottom: "2px solid #BEAF88", paddingBottom: "0.5rem" }}>
              Listing Details
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  { label: "MLS Number", value: listing.listingId },
                  { label: "Status", value: listing.status },
                  { label: "Property Type", value: formatPropertyType(listing.propertyType) },
                  { label: "List Price", value: formatPrice(listing.price) },
                  ...(listing.beds != null && listing.beds > 0 ? [{ label: "Bedrooms", value: String(listing.beds) }] : []),
                  ...(listing.baths != null && listing.baths > 0 ? [{ label: "Bathrooms", value: String(listing.baths) }] : []),
                  ...(listing.sqft != null ? [{ label: "Living Area", value: `${listing.sqft.toLocaleString()} sq ft` }] : []),
                  ...(listing.lotSize != null ? [{ label: "Lot Size", value: `${listing.lotSize.toLocaleString()} sq ft` }] : []),
                  ...(listing.yearBuilt != null ? [{ label: "Year Built", value: String(listing.yearBuilt) }] : []),
                  ...(listing.garageSpaces != null ? [{ label: "Garage Spaces", value: String(listing.garageSpaces) }] : []),
                  ...(listing.listingDate ? [{ label: "Listed", value: formatDate(listing.listingDate) }] : []),
                  ...(listing.agentName ? [{ label: "Listing Agent", value: listing.agentName }] : []),
                ].map((row, i) => (
                  <tr key={row.label} style={{ background: i % 2 === 0 ? "#fff" : "#F7F6F3" }}>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", width: "40%" }}>
                      {row.label}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.9rem", color: "#121212" }}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Map */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", color: "#121212", marginBottom: "1rem", borderBottom: "2px solid #BEAF88", paddingBottom: "0.5rem" }}>
              Location
            </h2>
            <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1rem" }}>
              {fullAddress}
            </p>
            <div style={{ width: "100%", height: "350px", background: "#e8e8e8", overflow: "hidden" }}>
              <iframe
                title="Property location map"
                width="100%"
                height="350"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={mapUrl}
              />
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ background: "#f0ede6", border: "1px solid #ddd", padding: "1rem 1.25rem", fontSize: "0.75rem", color: "#888", lineHeight: 1.6 }}>
            Information is deemed reliable but not guaranteed. All measurements and square footage are approximate. Buyers should verify all information independently. Data provided by CRMLS. Century 21 Citrus Realty, DRE #00848848.
          </div>
        </div>

        {/* Right column - Contact sidebar */}
        <div style={{ position: "sticky", top: "100px" }}>
          {/* Contact card */}
          <div style={{ background: "#121212", padding: "2rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.25rem", color: "#BEAF88", marginBottom: "0.5rem" }}>
              Interested in This Property?
            </h3>
            <p style={{ color: "#ccc", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Contact our team to schedule a showing or ask a question about this listing.
            </p>

            {listing.agentName && (
              <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #333" }}>
                <div style={{ fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>
                  Listing Agent
                </div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: "1rem" }}>{listing.agentName}</div>
                {listing.agentPhone && (
                  <a href={`tel:${listing.agentPhone}`} style={{ color: "#BEAF88", fontSize: "0.875rem", textDecoration: "none" }}>
                    {formatPhone(listing.agentPhone)}
                  </a>
                )}
              </div>
            )}

            {!showContactForm && !contactSent && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setShowContactForm(true)}
                  style={{
                    background: "#BEAF88", color: "#121212", border: "none",
                    padding: "0.875rem 1.5rem", fontFamily: "Lato, sans-serif",
                    fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.1em",
                    textTransform: "uppercase", cursor: "pointer", width: "100%",
                  }}
                >
                  Schedule a Showing
                </button>
                <a
                  href="tel:9095928500"
                  style={{
                    display: "block", textAlign: "center", border: "1px solid #BEAF88",
                    color: "#BEAF88", padding: "0.875rem 1.5rem",
                    fontFamily: "Lato, sans-serif", fontWeight: 700, fontSize: "0.875rem",
                    letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
                  }}
                >
                  Call (909) 592-8500
                </a>
              </div>
            )}

            {showContactForm && !contactSent && (
              <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <input
                  type="text" placeholder="Your Name" required value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="email" placeholder="Email Address" required value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="tel" placeholder="Phone Number" value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  style={inputStyle}
                />
                <textarea
                  placeholder={`I'm interested in ${listing.address}. Please contact me to schedule a showing.`}
                  rows={4} value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
                <FormSpamGuard />
                {contactError && <p role="alert" style={{ color: "#f3b4ad", fontSize: "0.82rem", lineHeight: 1.5, margin: 0 }}>{contactError}</p>}
                <button
                  type="submit" disabled={contactSending}
                  style={{
                    background: "#BEAF88", color: "#121212", border: "none",
                    padding: "0.875rem 1.5rem", fontFamily: "Lato, sans-serif",
                    fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.1em",
                    textTransform: "uppercase", cursor: contactSending ? "not-allowed" : "pointer",
                    opacity: contactSending ? 0.7 : 1,
                  }}
                >
                  {contactSending ? "Sending…" : "Send Message"}
                </button>
                <button
                  type="button" onClick={() => setShowContactForm(false)}
                  style={{ background: "none", border: "none", color: "#888", fontSize: "0.8rem", cursor: "pointer", textDecoration: "underline" }}
                >
                  Cancel
                </button>
              </form>
            )}

            {contactSent && (
              <div style={{
                textAlign: "center",
                padding: "1.5rem 1rem",
                animation: "c21FadeSlideIn 0.45s cubic-bezier(0.22,1,0.36,1) both",
              }}>
                {/* Animated checkmark circle */}
                <div style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  background: "rgba(190,175,136,0.15)",
                  border: "2px solid #BEAF88",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1rem",
                  animation: "c21ScalePop 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both",
                }}>
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"
                    style={{ animation: "c21CheckDraw 0.4s ease 0.35s both" }}>
                    <polyline
                      points="5,13 11,19 21,8"
                      stroke="#BEAF88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      fill="none"
                      style={{
                        strokeDasharray: 30,
                        strokeDashoffset: 0,
                        animation: "c21StrokeDraw 0.4s ease 0.35s both",
                      }}
                    />
                  </svg>
                </div>
                <p style={{
                  color: "#BEAF88", fontFamily: "'Playfair Display', serif",
                  fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.4rem",
                }}>
                  Request Sent!
                </p>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
                  We'll be in touch shortly to confirm your showing.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setContactSent(false);
                    setShowContactForm(false);
                    setContactName("");
                    setContactEmail("");
                    setContactPhone("");
                    setContactMessage("");
                  }}
                  style={{
                    marginTop: "1rem",
                    background: "none", border: "none",
                    color: "rgba(255,255,255,0.45)", fontSize: "0.78rem",
                    cursor: "pointer", textDecoration: "underline",
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  Send another request
                </button>
              </div>
            )}
            <style>{`
              @keyframes c21FadeSlideIn {
                from { opacity: 0; transform: translateY(12px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              @keyframes c21ScalePop {
                from { opacity: 0; transform: scale(0.6); }
                to   { opacity: 1; transform: scale(1); }
              }
              @keyframes c21StrokeDraw {
                from { stroke-dashoffset: 30; }
                to   { stroke-dashoffset: 0; }
              }
            `}</style>
          </div>

          {/* Office info */}
          <div style={{ background: "#fff", border: "1px solid #e0ddd6", padding: "1.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
              Century 21 Citrus Realty
            </div>
            <p style={{ color: "#444", fontSize: "0.875rem", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
              1100 Via Verde Ave, Suite 120<br />
              San Dimas, CA 91773
            </p>
            <a href="tel:9095928500" style={{ color: "#BEAF88", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
              (909) 592-8500
            </a>
            <div style={{ marginTop: "1rem" }}>
              <Link href="/our-listings">
                <span style={{ color: "#BEAF88", fontSize: "0.8rem", textDecoration: "underline", cursor: "pointer" }}>
                  ← Back to All Listings
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile responsive override ─────────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .listing-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background: "#2a2a2a",
  border: "1px solid #444",
  color: "#fff",
  padding: "0.75rem 1rem",
  fontFamily: "Lato, sans-serif",
  fontSize: "0.875rem",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
};
