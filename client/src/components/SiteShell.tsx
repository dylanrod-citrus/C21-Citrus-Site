/*
  SUNLIT CITRUS ATLAS — shared site shell.
  Navigation stays visible and practical against a warm editorial, California-real-estate canvas.
*/
import { ArrowUpRight, Instagram, Mail, Menu, Phone, Search, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";

const brandMark = "/manus-storage/c21-citrus-symbol_9bf476c2.png";

const navItems = [
  { label: "Buy", href: "/buy" },
  { label: "Sell", href: "/sell" },
  { label: "Search", href: "/search" },
  { label: "Communities", href: "/communities" },
  { label: "Agents", href: "/agents" },
  { label: "Resources", href: "/resources" },
  { label: "Careers", href: "/careers" },
];

function BrandLockup({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className={`brand-lockup ${inverse ? "is-inverse" : ""}`} aria-label="C21 Citrus Realty home">
      <img className="brand-mark" src={brandMark} alt="C21 Citrus Realty mark" />
      <span className="brand-name">
        <strong>C21</strong>
        <span>CITRUS REALTY</span>
      </span>
    </Link>
  );
}

export function SiteHeader({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <header className={`site-header tone-${tone}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="utility-line">
        <p>Southern California · Locally rooted since 1972</p>
        <div className="utility-actions">
          <a href="tel:+19095928500"><Phone size={13} /> 909.592.8500</a>
          <a href="mailto:oj@c21citrus.com"><Mail size={13} /> oj@c21citrus.com</a>
        </div>
      </div>
      <div className="nav-row">
        <BrandLockup inverse={tone === "dark"} />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={location === item.href ? "active" : ""}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-cta-wrap">
          <Link className="nav-cta" href="/contact">Talk to us <ArrowUpRight size={15} /></Link>
          <button
            type="button"
            className="mobile-menu-button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((current) => !current)}
          >
            <span className="sr-only">{open ? "Close" : "Open"} navigation</span>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <div id="mobile-navigation" className={`mobile-nav ${open ? "open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          {navItems.map((item, index) => (
            <Link key={item.href} href={item.href} style={{ transitionDelay: `${index * 28}ms` }}>
              <span>0{index + 1}</span>{item.label}<ArrowUpRight size={17} />
            </Link>
          ))}
          <Link href="/contact" className="mobile-contact">Start a conversation</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-topline"><span>Local roots. Wider horizons.</span><span>Est. 1972</span></div>
      <div className="footer-grid">
        <div className="footer-brand">
          <BrandLockup inverse />
          <p>Real estate guidance made personal, practical, and close to home.</p>
          <a className="footer-email" href="mailto:oj@c21citrus.com">oj@c21citrus.com <ArrowUpRight size={15} /></a>
        </div>
        <div className="footer-column">
          <p className="footer-label">Explore</p>
          <Link href="/buy">Buy a home</Link>
          <Link href="/sell">Sell a home</Link>
          <Link href="/search">Search homes</Link>
          <Link href="/communities">Communities</Link>
        </div>
        <div className="footer-column">
          <p className="footer-label">Connect</p>
          <Link href="/agents">Meet the team</Link>
          <Link href="/resources">Local resources</Link>
          <Link href="/careers">Build your career</Link>
          <Link href="/contact">Contact C21 Citrus</Link>
        </div>
        <div className="footer-column footer-office">
          <p className="footer-label">Office</p>
          <p>1700 East Walnut Avenue<br />El Segundo, CA 90245</p>
          <a href="tel:+19095928500">909.592.8500</a>
          <a className="footer-social" href="https://www.instagram.com/century21citrus/" target="_blank" rel="noreferrer"><Instagram size={16} /> Follow along</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} C21 Citrus Realty. All rights reserved.</p>
        <div><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-use">Terms</Link><a href="https://c21citrus.com/" target="_blank" rel="noreferrer"><Search size={12} /> Live search</a></div>
      </div>
    </footer>
  );
}

export function SiteShell({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return <><SiteHeader tone={tone} />{children}<SiteFooter /></>;
}
