/*
  CENTURY 21 CITRUS REALTY — CAREERS PAGE
  Design: C21 brand-aligned luxury real estate portal
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
  Rule: Never write "Century 21" in visible copy — always use the logo image
*/
import {
  ArrowRight,
  Award,
  BadgeDollarSign,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import SiteNav from "../components/SiteNav";

const heroImage = "/manus-storage/hero-luxury-interior_f79432c6.jpg";
const logoUrl = "/manus-storage/century21-citrus-realty-gold-logo_f3913815.png";

const contactUrl = "/contact";
const phoneUrl = "tel:19095928500";
const emailUrl = "mailto:oj@c21citrus.com";
const idxSearchUrl = "https://c21citrus.com/search/";

const whyJoin = [
  {
    icon: Globe,
    title: "Global Brand, Local Roots",
    copy: "Leverage the recognition and marketing power of one of the world's most trusted real estate brands while working in a community-focused office that has served Southern California since 1987.",
  },
  {
    icon: BadgeDollarSign,
    title: "Competitive Commission Structure",
    copy: "Century 21 Citrus Realty offers a straightforward, competitive commission plan designed to reward your effort and growth — whether you are just starting out or closing high-volume transactions.",
  },
  {
    icon: BookOpen,
    title: "Training & Mentorship",
    copy: "New agents receive hands-on guidance from experienced producers. Ongoing training covers contracts, negotiation, marketing, and the local market dynamics that drive results.",
  },
  {
    icon: TrendingUp,
    title: "Technology & Marketing Tools",
    copy: "Access the full suite of Century 21 marketing platforms, CRM tools, listing syndication, and professional photography coordination to present your listings at their best.",
  },
  {
    icon: UsersRound,
    title: "Collaborative Culture",
    copy: "Our office is built on mutual respect and shared success. Agents support each other, share market knowledge, and celebrate wins together — no cutthroat competition.",
  },
  {
    icon: Award,
    title: "Recognized Excellence",
    copy: "Century 21 Citrus Realty agents have earned Century 21 production awards and local recognition year after year. Join a team with a proven track record and the infrastructure to help you reach yours.",
  },
];

const paths = [
  {
    label: "New Agents",
    icon: Sparkles,
    copy: "If you recently earned your license or are just beginning your real estate career, Century 21 Citrus Realty provides the mentorship, training, and support structure to help you build a sustainable practice from day one.",
    bullets: [
      "Structured onboarding program",
      "Paired with an experienced mentor",
      "Access to office leads and floor time",
      "Marketing templates and listing support",
    ],
  },
  {
    label: "Experienced Agents",
    icon: TrendingUp,
    copy: "If you are an established producer looking for a better platform, stronger culture, or a brand that opens doors, we invite you to have a confidential conversation about what Century 21 Citrus Realty can offer.",
    bullets: [
      "Flexible commission splits",
      "Full Century 21 brand and technology access",
      "Referral network and relocation leads",
    ],
  },
  {
    label: "Team Leaders",
    icon: BriefcaseBusiness,
    copy: "Growing a team? Century 21 Citrus Realty provides the infrastructure, brand credibility, and office environment to help team leaders recruit, retain, and develop top talent in Southern California.",
    bullets: [
      "Team-friendly commission structures",
      "Dedicated team workspace options",
      "Recruiting and onboarding support",
      "Leadership development resources",
    ],
  },
];

const process = [
  { number: "01", title: "Reach Out", copy: "Call, email, or fill out the contact form to start a confidential conversation with our office manager." },
  { number: "02", title: "Office Visit", copy: "Tour the office, meet the team, and get a clear picture of our culture, tools, and commission structure." },
  { number: "03", title: "Review the Plan", copy: "We will walk you through the commission plan, training schedule, and any transition support available." },
  { number: "04", title: "Join the Team", copy: "Complete the paperwork, get your access set up, and start building your business with the Century 21 Citrus Realty team behind you." },
];

export default function Careers() {
  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }}>
      <SiteNav activeTab="Careers" />

      <main id="main-content">
        {/* Hero */}
        <section className="c21-inner-hero">
          <img src={heroImage} alt="Luxury Southern California interior" className="c21-inner-hero-bg" />
          <div className="c21-inner-hero-overlay" />
          <div className="c21-inner-hero-content">
            <p className="c21-hero-eyebrow">Join Our Team</p>
            <h1 className="c21-inner-hero-title">Build Your Real Estate<br />Career with Century 21 Citrus Realty</h1>
            <p className="c21-inner-hero-subtitle">
              Whether you are just getting started or looking for a better platform, Century 21 Citrus Realty offers the brand, tools, and culture to help you grow in Southern California real estate.
            </p>
            <div className="c21-hero-actions">
              <a href={`tel:19095928500`} className="c21-btn-outline-white"><Phone size={15} /> Call 909.592.8500</a>
            </div>
          </div>
        </section>

        {/* Why Join */}
        <section style={{ background: "var(--c21-off-white)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p className="c21-section-eyebrow" style={{ justifyContent: "center" }}>Why Century 21 Citrus Realty</p>
              <h2 className="c21-section-title">A Platform Built for Agent Success</h2>
              <p className="c21-section-subtitle" style={{ margin: "0 auto" }}>
                We combine global brand strength with a locally grounded team culture, giving agents the tools, training, and support to build lasting careers.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
              {whyJoin.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    style={{
                      background: "#fff",
                      border: "1px solid #e8e4dc",
                      borderRadius: "3px",
                      padding: "2rem",
                      transition: "box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                  >
                    <div style={{ width: "44px", height: "44px", background: "rgba(190,175,136,0.12)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                      <Icon size={20} style={{ color: "var(--c21-gold-dark)" }} />
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.65rem" }}>{item.title}</h3>
                    <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", color: "#555", lineHeight: 1.7 }}>{item.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Career Paths */}
        <section style={{ background: "#fff", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p className="c21-section-eyebrow" style={{ justifyContent: "center" }}>Who We Welcome</p>
              <h2 className="c21-section-title">A Path for Every Stage of Your Career</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
              {paths.map((path) => {
                const Icon = path.icon;
                return (
                  <div
                    key={path.label}
                    style={{ background: "var(--c21-off-white)", border: "1px solid #e8e4dc", borderRadius: "3px", padding: "2.25rem", display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                      <div style={{ width: "40px", height: "40px", background: "var(--c21-gold)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={18} style={{ color: "var(--c21-black)" }} />
                      </div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--c21-black)" }}>{path.label}</h3>
                    </div>
                    <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", color: "#555", lineHeight: 1.7, marginBottom: "1.5rem" }}>{path.copy}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "auto" }}>
                      {path.bullets.map((b) => (
                        <span key={b} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontFamily: "'Lato', sans-serif", fontSize: "0.85rem", color: "#444" }}>
                          <CheckCircle2 size={14} style={{ color: "var(--c21-gold-dark)", marginTop: "2px", flexShrink: 0 }} />
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process */}
        <section style={{ background: "var(--c21-black)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p className="c21-section-eyebrow" style={{ justifyContent: "center", color: "var(--c21-gold)" }}>How to Join</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                Four Steps to Getting Started
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "2rem" }}>
              {process.map((step) => (
                <div key={step.number} style={{ borderTop: "2px solid var(--c21-gold)", paddingTop: "1.5rem" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700, color: "var(--c21-gold)", opacity: 0.4, lineHeight: 1, marginBottom: "0.75rem" }}>{step.number}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginBottom: "0.65rem" }}>{step.title}</h3>
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section style={{ background: "var(--c21-off-white)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
            <p className="c21-section-eyebrow" style={{ justifyContent: "center" }}>Start the Conversation</p>
            <h2 className="c21-section-title">Interested in Joining Century 21 Citrus Realty?</h2>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "1rem", color: "#555", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              All inquiries are handled confidentially. Reach out by phone, email, or through our contact form and we will schedule a time to talk at your convenience.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginBottom: "2.5rem" }}>
              <a href={`tel:19095928500`} style={{ background: "transparent", color: "var(--c21-black)", fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.85rem 2rem", borderRadius: "2px", textDecoration: "none", border: "1.5px solid var(--c21-black)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <Phone size={15} /> 909.592.8500
              </a>
              <a href={contactUrl} style={{ background: "transparent", color: "var(--c21-black)", fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.85rem 2rem", borderRadius: "2px", textDecoration: "none", border: "1.5px solid var(--c21-black)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <ArrowRight size={15} /> Contact Form
              </a>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.82rem", color: "#888", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <MapPin size={13} /> San Dimas, CA
              </span>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.82rem", color: "#888", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Phone size={13} /> 909.592.8500
              </span>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.82rem", color: "#888", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Mail size={13} /> oj@c21citrus.com
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
}
