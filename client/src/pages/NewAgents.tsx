/*
  CENTURY 21 CITRUS REALTY — NEW AGENTS PAGE
  Design: C21 brand-aligned luxury real estate portal
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
  Rule: Never write "Century 21" in visible copy — always use the logo image
*/
import {
  Award,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import SiteNav from "../components/SiteNav";

const heroImage = "/manus-storage/hero-luxury-interior_f79432c6.jpg";

const benefits = [
  {
    icon: BookOpen,
    title: "Extensive Two-Week Training",
    copy: "Our thorough two-week onboarding program covers contracts, disclosures, MLS, marketing, and client communication. Nothing is left to chance, you will be ready to work with buyers and sellers from day one.",
  },
  {
    icon: UsersRound,
    title: "Paired with an Experienced Mentor",
    copy: "Every new agent is paired with a seasoned producer who provides hands-on guidance through your first transactions. Your mentor is available to answer questions, review paperwork, and help you build confidence.",
  },
  {
    icon: TrendingUp,
    title: "Weekly Sales Meetings & Training",
    copy: "Our office holds weekly sales meetings and ongoing training sessions covering market updates, negotiation tactics, listing strategies, and technology tools to keep you sharp and informed.",
  },
  {
    icon: Globe,
    title: "Global Brand, Local Support",
    copy: "Leverage the recognition and marketing power of one of the world's most trusted real estate brands while working in a community-focused office that has served Southern California since 1987.",
  },
  {
    icon: Sparkles,
    title: "Marketing Templates & Listing Support",
    copy: "Access a full library of professional marketing templates, social media assets, and listing presentation materials. Our staff helps coordinate photography and listing preparation.",
  },
  {
    icon: Award,
    title: "Access to Office Leads & Floor Time",
    copy: "New agents benefit from office lead opportunities and scheduled floor time to build their pipeline while developing their own sphere of influence and referral network.",
  },
];

const testimonials = [
  {
    quote: "Century 21 Citrus Realty gave me and still gives me the support and training to grow every day as a professional real estate agent. The office structure, experience, and knowledge of the sales manager and broker are very important elements that I like about this office.",
    name: "Brenda Vazquez",
    award: "Centurion Award Winner",
  },
  {
    quote: "After being in the real estate business for 21 years with a different office, what impresses me the most about Century 21 Citrus Realty is its commitment to excellence, professionalism, training, and state-of-the-art tools to provide the very best client service possible.",
    name: "Clara Posin",
    award: "Masters Award Winner",
  },
  {
    quote: "My first full year in the business I closed 23 transactions and generated $218,000 in gross closed commission. No matter what the market conditions are, I have consistently increased my business by at least 20%. I can definitely say that Century 21 Citrus Realty has been a key factor in my success.",
    name: "Agent Testimonial",
    award: "Century 21 Citrus Realty Agent",
  },
];

const process = [
  { number: "01", title: "Reach Out", copy: "Call, email, or fill out the contact form to start a conversation with our office manager about joining the team." },
  { number: "02", title: "Office Visit", copy: "Tour the office, meet the team, and get a clear picture of our culture, tools, and commission structure." },
  { number: "03", title: "Two-Week Onboarding", copy: "Complete our comprehensive two-week training program covering everything you need to start working with clients confidently." },
  { number: "04", title: "Start Building", copy: "Get your access set up, connect with your mentor, and start building your real estate business with the Century 21 Citrus Realty team behind you." },
];

function InfoSessionForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Opens email client pre-filled with the form data
    const subject = encodeURIComponent("Free Info Session Request");
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\n\nMessage:\n${form.message || "I would like to sign up for a free info session about starting my real estate career at Century 21 Citrus Realty."}`
    );
    window.location.href = `mailto:oj@c21citrus.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #d8d4cc",
    borderRadius: "2px",
    fontFamily: "'Lato', sans-serif",
    fontSize: "0.9rem",
    color: "var(--c21-black)",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
  };

  return (
    <section style={{ background: "var(--c21-black)", padding: "5rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
        {/* Left — copy */}
        <div>
          <p className="c21-section-eyebrow" style={{ color: "var(--c21-gold)" }}>
            <CalendarCheck size={14} style={{ marginRight: "0.4rem" }} />
            Free Info Session
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "1.25rem" }}>
            Curious About a Career in Real Estate?
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: "1.75rem" }}>
            Sign up for a free, no-obligation information session with our office manager. We will walk you through the licensing process, what a day in the life of an agent looks like, and exactly how Century 21 Citrus Realty supports agents from day one.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {["No experience required", "Learn about licensing requirements", "Ask questions in a relaxed setting", "Discover what makes Century 21 Citrus Realty different"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <CheckCircle2 size={15} style={{ color: "var(--c21-gold)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.8)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div style={{ background: "#fff", borderRadius: "3px", padding: "2.5rem", borderTop: "4px solid var(--c21-gold)" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <CalendarCheck size={40} style={{ color: "var(--c21-gold-dark)", marginBottom: "1rem" }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.75rem" }}>Request Sent!</h3>
              <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.7 }}>Your email client has been opened with your request pre-filled. We will be in touch shortly to confirm your session.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.25rem" }}>Sign Up for a Free Info Session</p>
                <p style={{ fontSize: "0.82rem", color: "#888" }}>We will reach out within one business day to schedule your session.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#666", marginBottom: "0.4rem" }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--c21-gold-dark)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#d8d4cc"; }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#666", marginBottom: "0.4rem" }}>Phone</label>
                  <input
                    type="tel"
                    placeholder="(626) 555-0100"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--c21-gold-dark)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#d8d4cc"; }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#666", marginBottom: "0.4rem" }}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="jane@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--c21-gold-dark)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#d8d4cc"; }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#666", marginBottom: "0.4rem" }}>Questions or Comments</label>
                <textarea
                  rows={3}
                  placeholder="Tell us a little about yourself or any questions you have..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--c21-gold-dark)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#d8d4cc"; }}
                />
              </div>
              <button
                type="submit"
                className="c21-btn-gold"
                style={{ width: "100%", justifyContent: "center", marginTop: "0.25rem" }}
              >
                <CalendarCheck size={15} /> Request My Free Info Session
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default function NewAgents() {
  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }}>
      <SiteNav activeTab="Careers" />

      <main id="main-content">
        {/* Hero */}
        <section className="c21-inner-hero">
          <img src={heroImage} alt="New agent career" className="c21-inner-hero-bg" />
          <div className="c21-inner-hero-overlay" />
          <div className="c21-inner-hero-content">
            <h1 className="c21-inner-hero-title">Launch Your Real Estate<br />Career the Right Way</h1>
            <p className="c21-inner-hero-subtitle">
              Whether you just earned your license or are still in the process, Century 21 Citrus Realty provides the tools, mentorship, training, Coaching and support structure to help you build a sustainable practice from day one.
            </p>
            <div className="c21-hero-actions">
              <a href="tel:19095928500" className="c21-btn-outline-white"><Phone size={15} /> Call 909.592.8500</a>
            </div>
          </div>
        </section>

        {/* Free Info Session Sign-Up */}
        <InfoSessionForm />

        {/* Benefits Grid */}
        <section style={{ background: "var(--c21-off-white)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p className="c21-section-eyebrow" style={{ justifyContent: "center" }}>What We Offer</p>
              <h2 className="c21-section-title">Everything You Need to Succeed</h2>
              <p className="c21-section-subtitle" style={{ margin: "0 auto" }}>
                Joining Century 21 Citrus Realty as a new agent means you will never be left to figure things out alone. Our support system is built to accelerate your growth.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
              {benefits.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: "3px", padding: "2rem", transition: "box-shadow 0.2s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                  >
                    <div style={{ width: "44px", height: "44px", background: "rgba(190,175,136,0.12)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                      <Icon size={20} style={{ color: "var(--c21-gold-dark)" }} />
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.65rem" }}>{item.title}</h3>
                    <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.7 }}>{item.copy}</p>
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
                  <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ background: "#fff", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p className="c21-section-eyebrow" style={{ justifyContent: "center" }}>Agent Testimonials</p>
              <h2 className="c21-section-title">Hear From Our Agents</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  style={{ background: "var(--c21-off-white)", border: "1px solid #e8e4dc", borderRadius: "3px", padding: "2.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}
                >
                  <div style={{ color: "var(--c21-gold)", fontSize: "2.5rem", lineHeight: 1, fontFamily: "Georgia, serif" }}>"</div>
                  <p style={{ fontSize: "0.92rem", color: "#444", lineHeight: 1.8, fontStyle: "italic", flex: 1 }}>{t.quote}</p>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "var(--c21-black)", fontSize: "0.95rem" }}>{t.name}</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--c21-gold-dark)", fontWeight: 600, marginTop: "0.2rem" }}>{t.award}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "var(--c21-off-white)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
            <p className="c21-section-eyebrow" style={{ justifyContent: "center" }}>Join the Team</p>
            <h2 className="c21-section-title">There Is a Place for You at Century 21 Citrus Realty</h2>
            <p className="c21-section-subtitle" style={{ margin: "0 auto 2.5rem" }}>
              Whether you are just starting out or ready to take your career to the next level, we invite you to have a conversation about what Century 21 Citrus Realty can offer you.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/contact" className="c21-btn-gold"><UsersRound size={15} /> Talk with the Office</a>
              <a href="tel:19095928500" className="c21-btn-outline-dark"><Phone size={15} /> 909.592.8500</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
