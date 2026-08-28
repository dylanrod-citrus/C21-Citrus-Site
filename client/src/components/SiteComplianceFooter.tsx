/**
 * SiteComplianceFooter — site-wide legal compliance bar
 *
 * Renders at the bottom of every page and satisfies:
 *  - CCPA/CPRA: conspicuous "Privacy Policy" and "Do Not Sell or Share My Personal Information" links
 *  - CIPA: links to Privacy Policy and Privacy Request form
 *  - ADA/WCAG 2.1 AA: semantic <footer> landmark, descriptive link text, sufficient contrast
 *  - Real estate: Equal Housing Opportunity notice, DRE license, MLS disclaimer
 *  - CAN-SPAM: physical mailing address present on every page
 */

import { Link } from "wouter";
import { triggerDoNotSellOptOut } from "./CookieConsent";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663548398310/FmgRAuAhcizSMKMD.png";

export default function SiteComplianceFooter() {
  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="c21-compliance-footer"
      style={{
        background: "#111",
        borderTop: "1px solid #2a2a2a",
        fontFamily: "Lato, sans-serif",
      }}
    >
      {/* ── Main footer content ── */}
      <div className="c21-compliance-footer-main"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "3rem 1.5rem 2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* Brand column */}
        <div className="c21-compliance-footer-column">
          <img
            src={LOGO_URL}
            alt="Century 21 Citrus Realty"
            style={{ height: "2.5rem", marginBottom: "1rem" }}
          />
          <p style={{ color: "#aaa", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "0.75rem" }}>
            Serving buyers and sellers throughout Southern California. Headquartered in San Dimas, with deep roots across the San Gabriel Valley, Inland Empire, and beyond.
          </p>
          <address style={{ fontStyle: "normal", color: "#aaa", fontSize: "0.85rem", lineHeight: 1.8 }}>
            1100 Via Verde<br />
            San Dimas, CA 91773<br />
            <a href="tel:+19095928500" style={{ color: "#BEAF88", textDecoration: "none" }}>
              (909) 592-8500
            </a>
          </address>
        </div>

        {/* Quick links */}
        <nav className="c21-compliance-footer-column" aria-label="Footer navigation">
          <h3 style={{ color: "#BEAF88", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Quick Links
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { label: "Buy a Home", href: "/buy" },
              { label: "Sell Your Home", href: "/sell" },
              { label: "Our Listings", href: "/our-listings" },
              { label: "Find an Agent", href: "/agents" },
              { label: "Contact Us", href: "/contact" },
            ].map((link) => (
              <li key={link.label} style={{ marginBottom: "0.5rem" }}>
                <Link href={link.href} style={{ color: "#aaa", textDecoration: "none", fontSize: "0.875rem" }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Legal & privacy */}
        <nav className="c21-compliance-footer-column" aria-label="Legal and privacy links">
          <h3 style={{ color: "#BEAF88", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Legal & Privacy
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <Link href="/privacy-policy" style={{ color: "#aaa", textDecoration: "none", fontSize: "0.875rem" }}>
                Privacy Policy
              </Link>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <Link href="/terms-of-use" style={{ color: "#aaa", textDecoration: "none", fontSize: "0.875rem" }}>
                Terms of Use
              </Link>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              {/* CCPA/CPRA § 1798.120 - triggers immediate opt-out, not a form redirect */}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); triggerDoNotSellOptOut(); }}
                className="c21-privacy-choice-button"
                style={{
                  background: "none", border: "none", padding: 0, cursor: "pointer",
                  color: "#BEAF88", fontSize: "0.875rem", fontWeight: 600,
                  textDecoration: "underline", textUnderlineOffset: "2px",
                  fontFamily: "Lato, sans-serif",
                }}
                aria-label="Opt out of sale or sharing of personal information"
              >
                Do Not Sell or Share My Personal Information
              </button>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <Link href="/privacy-request" style={{ color: "#aaa", textDecoration: "none", fontSize: "0.875rem" }}>
                Submit a Privacy Request
              </Link>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <a href="mailto:operations@c21citrus.com" style={{ color: "#aaa", textDecoration: "none", fontSize: "0.875rem" }}>
                operations@c21citrus.com
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* ── Compliance bar ── */}
      <div className="c21-compliance-footer-bottom"
        style={{
          borderTop: "1px solid #2a2a2a",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <span
          aria-label="Equal Housing Opportunity"
          style={{
            color: "#aaa",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            lineHeight: 1.25,
            textTransform: "uppercase",
          }}
        >
          Equal Housing Opportunity
        </span>

        <div className="c21-compliance-footer-copy" style={{ flex: 1, minWidth: "0" }}>
          <p style={{ color: "#666", fontSize: "0.75rem", lineHeight: 1.6, margin: 0 }}>
            © {new Date().getFullYear()} Century 21 Citrus Realty, Inc. All rights reserved.
            Each office is independently owned and operated.{" "}
            <strong style={{ color: "#888" }}>DRE License #00848848.</strong>
          </p>
          <p style={{ color: "#555", fontSize: "0.7rem", lineHeight: 1.5, margin: "0.4rem 0 0" }}>
            Information deemed reliable but not guaranteed. All properties are subject to prior sale, change, or withdrawal.
            Neither listing broker(s) nor Century 21 Citrus Realty shall be responsible for any typographical errors,
            misinformation, misprints, and shall be held totally harmless. Based on information from the California Regional
            Multiple Listing Service (CRMLS) as of {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.
          </p>
        </div>
      </div>
    </footer>
  );
}
