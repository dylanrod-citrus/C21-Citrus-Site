/*
  CENTURY 21 CITRUS REALTY - HOME VALUE PAGE
  Wrapper page that keeps the full site navigation visible while
  embedding the external home valuation tool.
*/
import { HomeIcon, TrendingUp, DollarSign } from "lucide-react";
import SiteNav from "../components/SiteNav";
import { Mail, Phone, MapPin } from "lucide-react";

const logoUrl = "/manus-storage/century21-citrus-realty-gold-logo_f3913815.png";
const phoneUrl = "tel:19095928500";
const emailUrl = "mailto:oj@c21citrus.com";
const valuationUrl = "https://cloudattract.com/7442b3";
const idxSearchUrl = "https://c21citrus.com/search/";
const contactUrl = "/contact";

export default function HomeValue() {
  return (
    <div style={{ fontFamily: "'Lato', sans-serif", background: "#f7f6f3", minHeight: "100vh" }}>
      <SiteNav activeTab="Home Value" />

      {/* Hero banner */}
      <section style={{ background: "var(--c21-black)", padding: "3.5rem 2rem 3rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.6rem" }}>
          Free Estimate
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: "0.75rem" }}>
          What Is Your Home Worth?
        </h1>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.7)", maxWidth: "500px", margin: "0 auto 1.75rem", lineHeight: 1.7 }}>
          Get a free, no-obligation home valuation from our local experts, backed by current market data across San Dimas, Glendora, La Verne, and the greater San Gabriel Valley.
        </p>
      </section>

      {/* Get Home Value CTA */}
      <section style={{ background: "#fff", padding: "3rem 2rem", textAlign: "center" }}>
        <a
          href={valuationUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--c21-gold)", color: "var(--c21-black)", fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "1rem 2.25rem", borderRadius: "2px", textDecoration: "none" }}
        >
          <HomeIcon size={15} /> Get My Free Home Value
        </a>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.82rem", color: "#888", marginTop: "0.75rem" }}>Opens our free home valuation tool in a new tab.</p>
      </section>

      {/* Why get a valuation */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "3.5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold-dark)", marginBottom: "0.5rem" }}>
            Why It Matters
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--c21-black)" }}>
            Know Your Home's Value Before You Decide
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {[
            { icon: TrendingUp, title: "Current Market Data", body: "Our valuations use up-to-date comparable sales, active listings, and local market trends specific to your neighborhood." },
            { icon: DollarSign, title: "Price It Right", body: "Homes priced accurately from day one sell faster and for more money. Avoid the costly mistake of over- or under-pricing." },
            { icon: HomeIcon, title: "No Obligation", body: "Our home valuation is completely free with no pressure to list. It's simply a starting point for your decision-making." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: "4px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ width: "2.5rem", height: "2.5rem", background: "var(--c21-black)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} style={{ color: "var(--c21-gold)" }} />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--c21-black)" }}>{title}</h3>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.88rem", color: "#666", lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div style={{ marginTop: "3rem", background: "var(--c21-black)", borderRadius: "4px", padding: "2rem 2.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>
              Ready for a Personalized Valuation?
            </h3>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
              Speak with one of our local agents for a detailed comparative market analysis.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <a href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "var(--c21-gold)", color: "var(--c21-black)", fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.65rem 1.25rem", borderRadius: "2px", textDecoration: "none" }}>
              Contact Us
            </a>
            <a href="/agents" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.65rem 1.25rem", borderRadius: "2px", textDecoration: "none" }}>
              Meet Our Agents
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
}
