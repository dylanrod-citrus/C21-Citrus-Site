/*
  CENTURY 21 CITRUS REALTY - ABOUT PAGE
  Design: C21 brand-aligned luxury real estate portal
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
  Rule: Never write "Century 21" in visible copy - always use the logo image
*/
import { Award, Globe, Heart, Mail, MapPin, Phone, Star, Users } from "lucide-react";
import SiteNav from "../components/SiteNav";

const heroImage = "/manus-storage/hero-luxury-home_04c4fbf5.jpg";
const logoUrl = "/manus-storage/century21-citrus-realty-gold-logo_f3913815.png";
const contactUrl = "/contact";
const phoneUrl = "tel:19095928500";
const emailUrl = "mailto:oj@c21citrus.com";
const idxSearchUrl = "https://c21citrus.com/search/";

const awards = [
  {
    icon: Star,
    title: "Double-Centurion® Office Award",
    desc: "Awarded for elite-level sales production, one of the most prestigious distinctions in the CENTURY 21 system.",
  },
  {
    icon: Heart,
    title: "Quality Service Pinnacle Office Award",
    desc: "Awarded to offices with exceptional customer service based on independent survey data, earned consecutively year over year.",
  },
  {
    icon: Award,
    title: "Presidents' Office Award",
    desc: "Awarded to offices that achieved Centurion-level production and the Quality Service Pinnacle Award in the same year.",
  },
  {
    icon: Award,
    title: "President's Hall of Fame Office Award",
    desc: "Awarded to offices that achieve the President's Office award for 10 out of 12 years, including the current award year.",
  },
];

const values = [
  {
    icon: Users,
    title: "Client-First Service",
    desc: "Every transaction is conducted with the highest regard for professionalism, integrity, and the finest client service available.",
  },
  {
    icon: Globe,
    title: "Global Network, Local Expertise",
    desc: "As part of the CENTURY 21 global network, we bring world-class resources to buyers and sellers across Southern California.",
  },
  {
    icon: Heart,
    title: "Community Roots Since 1972",
    desc: "We are the oldest CENTURY 21 office still in operation over five decades of serving San Dimas and the surrounding communities.",
  },
  {
    icon: Star,
    title: "Award-Winning Performance",
    desc: "Recognized year after year with the industry's most prestigious production and service awards for consistent excellence.",
  },
];

export default function About() {
  return (
    <div style={{ fontFamily: "'Lato', sans-serif", color: "var(--c21-black)", background: "#fff" }}>
      <SiteNav activeTab="About" />

      {/* Hero */}
      <section id="main-content" className="c21-inner-hero" style={{ position: "relative", height: "420px", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <img src={heroImage} alt="Century 21 Citrus Realty office" className="c21-inner-hero-bg" />
        <div className="c21-inner-hero-overlay" />
        <div className="c21-inner-hero-content" style={{ paddingBottom: "3rem" }}>
          <h1 className="c21-inner-hero-title">About Century 21 Citrus Realty</h1>
          <p className="c21-inner-hero-subtitle">
            Making the American Dream a reality for buyers and sellers across Southern California since 1972.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 2rem 3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.75rem" }}>
            Our Mission
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, lineHeight: 1.2, marginBottom: "1.5rem", color: "var(--c21-black)" }}>
            Making the "American Dream" a Reality
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#444", marginBottom: "1.25rem" }}>
            We are dedicated to helping buyers and sellers obtain their very first home or move up to the home of their dreams. Located in San Dimas, California, a city full of new economic growth, untapped business opportunities, and hidden gems with a rich history.
          </p>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#444", marginBottom: "1.25rem" }}>
            Ideally located at the crossroads of Southern California's economic front with convenient freeway access to Orange County, Riverside, Los Angeles, and the Inland Empire, Century 21 Citrus Realty is well placed to serve all your California real estate needs, as well as relocation needs nationwide.
          </p>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#444" }}>
            The brokers and associates of Century 21 Citrus Realty are committed to the belief that customer service prevails above all, conducting every transaction with the highest regard for professionalism, integrity, and the finest client service available. Through exceptional service, we have stood the test of time as the oldest CENTURY 21 office still in operation, since 1972.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ background: "var(--c21-black)", color: "#fff", borderRadius: "4px", padding: "2.5rem", textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.5rem", fontWeight: 700, color: "var(--c21-gold)", lineHeight: 1 }}>1972</div>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "0.5rem", opacity: 0.85 }}>Year Founded</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ background: "#f7f6f3", borderRadius: "4px", padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "var(--c21-gold)" }}>53+</div>
              <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#666", marginTop: "0.25rem" }}>Years in Business</div>
            </div>
            <div style={{ background: "#f7f6f3", borderRadius: "4px", padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "var(--c21-gold)" }}>4</div>
              <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#666", marginTop: "0.25rem" }}>Prestige Awards</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: "#f7f6f3", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.5rem" }}>What We Stand For</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "var(--c21-black)" }}>Our Core Values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {values.map((v) => (
              <div key={v.title} style={{ background: "#fff", borderRadius: "4px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <v.icon size={28} color="var(--c21-gold)" style={{ marginBottom: "1rem" }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--c21-black)" }}>{v.title}</h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#555" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.5rem" }}>Recognition</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "var(--c21-black)" }}>Award-Winning Brokerage</h2>
          <p style={{ fontSize: "0.95rem", color: "#555", maxWidth: "600px", margin: "0.75rem auto 0", lineHeight: 1.7 }}>
            Century 21 Citrus Realty is a multi-award-winning brokerage, recognized for elite-level production and exceptional customer service.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {awards.map((a) => (
            <div key={a.title} style={{ border: "1px solid #e8e4d9", borderRadius: "4px", padding: "2rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "var(--c21-gold)" }} />
              <a.icon size={24} color="var(--c21-gold)" style={{ marginBottom: "1rem" }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--c21-black)" }}>{a.title}</h3>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "#555" }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--c21-black)", color: "#fff", padding: "4rem 2rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.75rem" }}>Get in Touch</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>Ready to Work With Us?</h2>
        <p style={{ fontSize: "0.95rem", opacity: 0.8, maxWidth: "500px", margin: "0 auto 2rem", lineHeight: 1.7 }}>
          Whether you are buying, selling, or relocating, our team is here to guide you every step of the way.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href={contactUrl} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--c21-gold)", color: "var(--c21-black)", fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.9rem 2rem", borderRadius: "2px", textDecoration: "none" }}>
            Contact Us
          </a>
          <a href={phoneUrl} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", border: "1.5px solid rgba(255,255,255,0.4)", color: "#fff", fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.9rem 2rem", borderRadius: "2px", textDecoration: "none" }}>
            <Phone size={14} /> 909.592.8500
          </a>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
}
