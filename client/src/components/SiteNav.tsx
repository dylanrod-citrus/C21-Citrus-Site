/*
  CENTURY 21 CITRUS REALTY - SHARED SITE NAV
  Shared across all pages. Includes:
  - Utility bar (phone, email, Home Value, Home Search, Contact)
  - Sticky main nav with logo and all page tabs
  - Careers dropdown with sub-pages
  - Mobile drawer menu
  Rule: Never write "Century 21" in visible copy - always use the logo image
*/
import { Heart, Menu, Phone, Search, X } from "lucide-react";
import { useState, useEffect } from "react";

/* ── Asset URLs ─────────────────────────────────────────────── */
const logoUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663548398310/FmgRAuAhcizSMKMD.png";

/* ── External links ─────────────────────────────────────────── */
const idxSearchUrl = "https://c21citrus.com/search/";
const phoneUrl = "tel:19095928500";
const emailUrl = "mailto:oj@c21citrus.com";

const navLinks = [
  { label: "Buy",                 href: "/home-buying-process" },
  { label: "Sell",                href: "/home-selling-process" },
  { label: "Our Listings",        href: "/our-listings" },
  { label: "Relocation",          href: "/relocation" },
  { label: "Agents",              href: "/agents" },
  { label: "Resources",           href: "/resources" },
  { label: "About",               href: "/about" },
  { label: "Get Licensed",  href: "/careers/real-estate-school" },
  { label: "Experienced Agents",  href: "/careers/experienced-agents" },
];



interface SiteNavProps {
  /** Highlight the active tab by label, e.g. "Agents" */
  activeTab?: string;
}

export default function SiteNav({ activeTab }: SiteNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);
  // Read favorites count from localStorage and keep it in sync
  useEffect(() => {
    const readCount = () => {
      try {
        const stored = localStorage.getItem("c21-favorites");
        const ids = stored ? (JSON.parse(stored) as string[]) : [];
        setFavCount(ids.length);
      } catch {
        setFavCount(0);
      }
    };
    readCount();
    window.addEventListener("storage", readCount);
    const interval = setInterval(readCount, 500);
    return () => {
      window.removeEventListener("storage", readCount);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* ── Skip Navigation Link (ADA) ─────────────────────────── */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          top: "-999px",
          left: "-999px",
          zIndex: 9999,
          background: "var(--c21-gold)",
          color: "var(--c21-black)",
          padding: "0.75rem 1.25rem",
          fontFamily: "'Lato', sans-serif",
          fontWeight: 700,
          fontSize: "0.875rem",
          textDecoration: "none",
          borderRadius: "2px",
        }}
        onFocus={(e) => { e.currentTarget.style.top = "0.5rem"; e.currentTarget.style.left = "0.5rem"; }}
        onBlur={(e) => { e.currentTarget.style.top = "-999px"; e.currentTarget.style.left = "-999px"; }}
      >
        Skip to main content
      </a>

      {/* ── Utility Bar ─────────────────────────────────────────── */}
      <header role="banner" aria-label="Site header">
      <div className="c21-utility-bar">
        <div className="c21-utility-bar-left">
          <a href={phoneUrl} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <Phone size={12} />
            909.592.8500
          </a>
        </div>
        <div className="c21-utility-bar-right">
          <a href="https://cloudattract.com/7442b3" target="_blank" rel="noopener noreferrer">Home Value</a>
          <a href="/mls-search">Home Search</a>
          <a href="/contact">Contact</a>
          <a
            href="/favorites"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.3rem",
              fontWeight: favCount > 0 ? 700 : undefined,
              color: favCount > 0 ? "var(--c21-gold)" : undefined,
            }}
            aria-label={`My Favorites${favCount > 0 ? ` (${favCount})` : ""}`}
          >
            <Heart size={11} fill={favCount > 0 ? "var(--c21-gold)" : "none"} stroke={favCount > 0 ? "var(--c21-gold)" : "currentColor"} />
            My Favorites{favCount > 0 && (
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: "var(--c21-gold)", color: "var(--c21-black)",
                borderRadius: "50%", width: "1.1rem", height: "1.1rem",
                fontSize: "0.75rem", fontWeight: 800, lineHeight: 1,
              }}>{favCount}</span>
            )}
          </a>
        </div>
      </div>
      </header>

      {/* ── Main Nav ──────────────────────────────────────────────── */}
      <nav className="c21-nav" id="top" aria-label="Main navigation">
        <div className="c21-nav-inner">
          <a href="/" className="c21-nav-logo" aria-label="Century 21 Citrus Realty home">
            <img src={logoUrl} alt="Century 21 Citrus Realty" />
          </a>
          <ul className="c21-nav-links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={activeTab === link.label ? "active" : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}


          </ul>

          <button
            className="c21-nav-mobile-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ───────────────────────────────────────────── */}
      <div className={`c21-mobile-menu${mobileOpen ? " open" : ""}`}>
        <div className="c21-mobile-menu-header">
          <img src={logoUrl} alt="Century 21 Citrus Realty" />
          <button
            className="c21-mobile-menu-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="c21-mobile-nav-links" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={activeTab === link.label ? "active" : undefined}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}


        </nav>
        <div style={{ padding: "0 1.5rem 0.5rem" }}>
          <a
            href="/favorites"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              fontFamily: "'Lato', sans-serif", fontSize: "0.8rem", fontWeight: 700,
              letterSpacing: "0.06em", textTransform: "uppercase",
              color: favCount > 0 ? "var(--c21-gold)" : "rgba(255,255,255,0.7)",
              padding: "0.6rem 0", textDecoration: "none",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Heart size={14} fill={favCount > 0 ? "var(--c21-gold)" : "none"} stroke={favCount > 0 ? "var(--c21-gold)" : "currentColor"} />
            My Favorites
            {favCount > 0 && (
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: "var(--c21-gold)", color: "var(--c21-black)",
                borderRadius: "50%", width: "1.2rem", height: "1.2rem",
                fontSize: "0.65rem", fontWeight: 800,
              }}>{favCount}</span>
            )}
          </a>
        </div>
        <div className="c21-mobile-cta">
          <a
            href={idxSearchUrl}
            className="c21-btn-gold"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <Search size={15} /> Search Homes
          </a>
        </div>
      </div>
    </>
  );
}
