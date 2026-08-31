/*
  CENTURY 21 CITRUS REALTY - EXPERIENCED AGENTS PAGE
  Design: C21 brand-aligned luxury real estate portal
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
  Rule: Never write "Century 21" in visible copy - always use the logo image
*/
import {
  BarChart3,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  Shield,
  TrendingUp,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { FormSpamGuard, readFormSpamPayload } from "../components/FormSpamGuard";
import SiteNav from "../components/SiteNav";

const JANETH_EMAIL = "janeth@c21citrus.com";

function JanethModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "A valid email is required.";
    if (!form.message.trim()) e.message = "Message is required.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const protection = readFormSpamPayload(e.currentTarget as HTMLFormElement);
    if (!protection.turnstileToken) {
      setSubmitError("Please complete the verification before sending your message.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim() || undefined,
          subject: "Experienced Agent Inquiry",
          message: form.message.trim(),
          recipientOverride: JANETH_EMAIL,
          ...protection,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Send failed");
      setSubmitted(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem", border: "1px solid #d8d4cc", borderRadius: "2px",
    fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", color: "var(--c21-black)",
    background: "#fff", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  return (
    <div
      role="dialog" aria-modal="true" aria-labelledby="janeth-modal-title"
      style={{ position: "fixed", inset: 0, zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)", padding: "1rem" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#fff", borderRadius: "4px", width: "100%", maxWidth: "520px", padding: "2.5rem 2rem", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#888", padding: "0.25rem" }}>
          <X size={20} />
        </button>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <CheckCircle2 size={44} style={{ color: "var(--c21-gold-dark)", marginBottom: "1rem" }} />
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.75rem" }}>Message Sent!</h3>
            <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.7 }}>Janeth will be in touch with you shortly. We look forward to speaking with you.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <div>
              <h2 id="janeth-modal-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.25rem" }}>Contact Janeth</h2>
              <p style={{ fontSize: "0.82rem", color: "#888" }}>Director of Career Development - ext. 421</p>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#666", marginBottom: "0.4rem" }}>Full Name *</label>
              <input type="text" required placeholder="Jane Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ ...inputStyle, borderColor: errors.name ? "#c0392b" : "#d8d4cc" }} />
              {errors.name && <p style={{ fontSize: "0.78rem", color: "#c0392b", marginTop: "0.3rem" }}>{errors.name}</p>}
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#666", marginBottom: "0.4rem" }}>Email Address *</label>
              <input type="email" required placeholder="jane@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ ...inputStyle, borderColor: errors.email ? "#c0392b" : "#d8d4cc" }} />
              {errors.email && <p style={{ fontSize: "0.78rem", color: "#c0392b", marginTop: "0.3rem" }}>{errors.email}</p>}
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#666", marginBottom: "0.4rem" }}>Phone</label>
              <input type="tel" placeholder="(626) 555-0100" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#666", marginBottom: "0.4rem" }}>Message *</label>
              <textarea rows={4} placeholder="Tell us about yourself and your interest in joining Century 21 Citrus Realty..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: "vertical", borderColor: errors.message ? "#c0392b" : "#d8d4cc" }} />
              {errors.message && <p style={{ fontSize: "0.78rem", color: "#c0392b", marginTop: "0.3rem" }}>{errors.message}</p>}
            </div>
            <FormSpamGuard />
            {submitError && <p style={{ fontSize: "0.85rem", color: "#c0392b", background: "#fdf2f2", padding: "0.75rem", borderRadius: "2px" }}>{submitError}</p>}
            <button type="submit" disabled={submitting} className="c21-btn-gold" style={{ width: "100%", justifyContent: "center", opacity: submitting ? 0.7 : 1 }}>
              <Mail size={15} /> {submitting ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const heroImage = "/manus-storage/hero-luxury-interior_f79432c6.jpg";

const stats = [
  { value: "11,900+", label: "Offices Worldwide" },
  { value: "84", label: "Countries & Territories" },
  { value: "135,000+", label: "Agents Worldwide" },
  { value: "#1", label: "Most Recognized Brand in Real Estate" },
];

const pillars = [
  {
    icon: Globe,
    title: "Instant Brand Recognition",
    copy: "The Century 21 brand is the most recognized and respected name in real estate according to buyers and sellers. That recognition opens doors and builds trust before you say a word.",
  },
  {
    icon: TrendingUp,
    title: "Learning & Professional Development",
    copy: "Access Century 21's world-class training platform, coaching programs, and leadership development resources designed to help experienced agents elevate their practice.",
  },
  {
    icon: Zap,
    title: "Marketing Muscle",
    copy: "Leverage the largest advertising campaign in the industry. From digital marketing tools to professional listing presentation materials, we give you the assets to compete at the highest level.",
  },
  {
    icon: BarChart3,
    title: "Technology Tools",
    copy: "The full Century 21 technology suite - CRM, listing syndication, market analytics, and client communication platforms - is available to every affiliated agent.",
  },
  {
    icon: UsersRound,
    title: "Supportive Community",
    copy: "Join a collaborative office culture where experienced agents share market knowledge, support each other through complex transactions, and celebrate wins together.",
  },
  {
    icon: Shield,
    title: "Flexible Commission Structure",
    copy: "We offer competitive, flexible commission plans designed to reward your production and growth. Have a confidential conversation with our broker about what works for your business.",
  },
];

const reasons = [
  "Flexible commission splits tailored to your production level",
  "Full Century 21 brand and technology access from day one",
  "Referral network and relocation leads",
  "Weekly sales meetings and ongoing market training",
  "Professional marketing templates and listing support",
  "Collaborative office culture with no cutthroat competition",
  "Access to Century 21's global referral and relocation network",
  "Recognized excellence - our agents earn Century 21 production awards year after year",
];

export default function ExperiencedAgents() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }}>
      <SiteNav activeTab="Careers" />

      <main id="main-content">
        {/* Hero */}
        <section className="c21-inner-hero">
          <img src={heroImage} alt="Experienced agent career" className="c21-inner-hero-bg" />
          <div className="c21-inner-hero-overlay" />
          <div className="c21-inner-hero-content">
            <p className="c21-hero-eyebrow">Experienced Agents</p>
            <h1 className="c21-inner-hero-title">Elevate Your Real Estate<br />Career with Century 21 Citrus Realty</h1>
            <p className="c21-inner-hero-subtitle">
              If you are an established producer looking for a better platform, stronger culture, or a brand that opens doors, we invite you to have a confidential conversation about what Century 21 Citrus Realty can offer.
            </p>
            <div className="c21-hero-actions">
              <a href="/contact" className="c21-btn-gold"><UsersRound size={15} /> Start a Conversation</a>
              <a href="tel:19095928500" className="c21-btn-outline-white"><Phone size={15} /> Call 909.592.8500</a>
            </div>
          </div>
        </section>

        {/* Brand Stats */}
        <section style={{ background: "var(--c21-black)", padding: "4rem 2rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "2rem", textAlign: "center" }}>
              {stats.map((s) => (
                <div key={s.label} style={{ borderLeft: "2px solid var(--c21-gold)", paddingLeft: "1.5rem", textAlign: "left" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, color: "var(--c21-gold)", lineHeight: 1.1 }}>{s.value}</div>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginTop: "0.4rem", lineHeight: 1.4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why C21 Citrus */}
        <section style={{ background: "var(--c21-off-white)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p className="c21-section-eyebrow" style={{ justifyContent: "center" }}>Why Century 21 Citrus Realty</p>
              <h2 className="c21-section-title">A Platform Built for Producers</h2>
              <p className="c21-section-subtitle" style={{ margin: "0 auto" }}>
                The Century 21 brand was built with one purpose in mind: to provide better ways for entrepreneurs like you to thrive. Here is what that means in practice.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
              {pillars.map((item) => {
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

        {/* Reasons List */}
        <section style={{ background: "#fff", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 4rem", alignItems: "start" }}>
              <div>
                <p className="c21-section-eyebrow">Why Agents Choose Us</p>
                <h2 className="c21-section-title" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
                  The Century 21 Citrus Realty Difference
                </h2>
                <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.75, marginTop: "1rem" }}>
                  We are not just offering a desk. We are offering a platform, a culture, and a brand that gives you every advantage to grow your business and serve your clients at the highest level.
                </p>
                <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <a href="/contact" className="c21-btn-gold"><Mail size={15} /> Start a Confidential Conversation</a>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {reasons.map((r) => (
                  <div key={r} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <CheckCircle2 size={16} style={{ color: "var(--c21-gold-dark)", marginTop: "3px", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.92rem", color: "#444", lineHeight: 1.65 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Recruiter Contact Card */}
        <section style={{ background: "var(--c21-off-white)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
            <p className="c21-section-eyebrow" style={{ justifyContent: "center" }}>Ready to Explore a Move?</p>
            <h2 className="c21-section-title">Talk with Our Director of Career Development</h2>
            <p className="c21-section-subtitle" style={{ margin: "0 auto 2.5rem" }}>
              Have a confidential conversation about what joining Century 21 Citrus Realty could look like for your business. No pressure, just an honest conversation.
            </p>
            <div style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              background: "#fff",
              border: "1px solid #e8e4dc",
              borderTop: "3px solid var(--c21-gold)",
              borderRadius: "4px",
              padding: "2rem 2.5rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
              minWidth: "280px",
            }}>
              <div style={{
                width: "200px", height: "200px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid var(--c21-gold)",
                flexShrink: 0,
                marginBottom: "0.5rem",
              }}>
                <img src="/manus-storage/janeth_new_8ac788c9.png" alt="Janeth Vega" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--c21-black)", margin: 0 }}>Janeth Vega</p>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c21-gold-dark)", margin: "0.15rem 0 0.75rem" }}>Director of Career Development</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    fontFamily: "'Lato', sans-serif", fontSize: "0.9rem",
                    color: "var(--c21-black)", background: "none", border: "none",
                    cursor: "pointer", padding: 0, justifyContent: "center",
                  }}
                >
                  <Mail size={14} color="var(--c21-gold-dark)" />
                  janeth@c21citrus.com
                </button>
                <a
                  href="tel:19095928500"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    fontFamily: "'Lato', sans-serif", fontSize: "0.9rem",
                    color: "var(--c21-black)", textDecoration: "none",
                    justifyContent: "center",
                  }}
                >
                  <Phone size={14} color="var(--c21-gold-dark)" />
                  909-592-8500 ext. 421
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Dark CTA */}
        <section style={{ background: "var(--c21-black)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
            <p className="c21-section-eyebrow" style={{ justifyContent: "center", color: "var(--c21-gold)" }}>Ready to Make a Move?</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "1.25rem" }}>
              Let's Have a Confidential Conversation
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
              Whether you are actively looking or just curious about what a move could look like, we are happy to have an honest, no-pressure conversation about your goals and what Century 21 Citrus Realty can offer.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:19095928500" className="c21-btn-outline-white"><Phone size={15} /> 909.592.8500</a>
            </div>
          </div>
        </section>
      </main>

      {modalOpen && <JanethModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
