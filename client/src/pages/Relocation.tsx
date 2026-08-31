/*
  CENTURY 21 CITRUS REALTY - RELOCATION PAGE
  Design: C21 brand-aligned luxury real estate portal
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
  Rule: Never write "Century 21" in visible copy - always use the logo image
*/
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Globe,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  Truck,
  Users,
  X,
} from "lucide-react";
import { FormSpamGuard, readFormSpamPayload } from "../components/FormSpamGuard";
import SiteNav from "../components/SiteNav";

const ANDREW_EMAIL = "andrew@c21citrus.com";

function AndrewInquiryForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const protection = readFormSpamPayload(e.currentTarget as HTMLFormElement);
    if (!protection.turnstileToken) {
      setSubmitError("Please complete the verification before sending your inquiry.");
      return;
    }
    setErrors({});
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, recipientOverride: ANDREW_EMAIL, ...protection }),
      });
      if (!res.ok) throw new Error("Server error");
      setSent(true);
    } catch {
      setSubmitError("Something went wrong. Please try again or call Andrew directly.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #ddd", borderRadius: "6px", fontSize: "0.9rem", fontFamily: "'Lato', sans-serif", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--c21-black)", marginBottom: "0.35rem", letterSpacing: "0.03em" };
  const errStyle: React.CSSProperties = { fontSize: "0.78rem", color: "#c0392b", marginTop: "0.25rem" };

  if (sent) {
    return (
      <div style={{ background: "#fff", borderRadius: "10px", padding: "2.5rem", textAlign: "center", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "var(--c21-gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
          <Mail size={22} color="#fff" />
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.5rem" }}>Message Sent!</h3>
        <p style={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.6)", lineHeight: 1.7 }}>Andrew will be in touch with you shortly. Check your inbox for a confirmation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ background: "#fff", borderRadius: "10px", padding: "2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label htmlFor="andrew-name" style={labelStyle}>Full Name *</label>
          <input id="andrew-name" type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Jane Smith" />
          {errors.name && <p style={errStyle}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="andrew-phone" style={labelStyle}>Phone</label>
          <input id="andrew-phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} placeholder="(626) 555-0100" />
        </div>
      </div>
      <div>
        <label htmlFor="andrew-email" style={labelStyle}>Email Address *</label>
        <input id="andrew-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} placeholder="you@example.com" />
        {errors.email && <p style={errStyle}>{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="andrew-message" style={labelStyle}>Message *</label>
        <textarea id="andrew-message" rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} placeholder="Tell Andrew about your relocation timeline, destination, and any questions you have…" />
        {errors.message && <p style={errStyle}>{errors.message}</p>}
      </div>
      <FormSpamGuard />
      {submitError && <p style={{ ...errStyle, fontSize: "0.85rem" }}>{submitError}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="c21-btn-gold"
        style={{ border: "none", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, justifyContent: "center" }}
      >
        <Mail size={15} /> {submitting ? "Sending…" : "Send Inquiry to Andrew"}
      </button>
    </form>
  );
}

const heroImage = "/manus-storage/hero-luxury-home_04c4fbf5.jpg";
const neighborhoodImage = "/manus-storage/hero-neighborhood_4a38234b.jpg";
const logoUrl = "/manus-storage/century21-citrus-realty-gold-logo_f3913815.png";
const phoneUrl = "tel:19095928500";
const contactUrl = "/contact";

const services = [
  {
    icon: Home,
    title: "Home Search Assistance",
    copy: "Your dedicated relocation specialist will help you identify neighborhoods, school districts, and communities that match your lifestyle and budget before you ever set foot in Southern California.",
  },
  {
    icon: Building2,
    title: "Corporate Relocation",
    copy: "We partner with employers and relocation management companies to streamline employee moves. Our agents are trained to minimize disruption and maximize satisfaction for relocating staff and their families.",
  },
  {
    icon: Globe,
    title: "Global Referral Network",
    copy: "Through the worldwide network of over 144,000 real estate professionals in more than 12,900 offices across 84 countries, we can coordinate your move from virtually anywhere in the world.",
  },
  {
    icon: Shield,
    title: "Military & Veteran Services",
    copy: "We proudly serve active-duty military, veterans, and DoD personnel with specialized relocation support. Our agents understand the unique timelines and challenges of a military move.",
  },
  {
    icon: Truck,
    title: "Seamless Transition Support",
    copy: "From your first consultation to your closing day, one dedicated agent handles everything from coordinating showings, paperwork, and local resources so you can focus on your family and your new role.",
  },
  {
    icon: Users,
    title: "Community Orientation",
    copy: "We go beyond the transaction. Our team provides neighborhood tours, school information, local business introductions, and community resources to help you feel at home from day one.",
  },
];

const steps = [
  { number: "01", title: "Initial Consultation", copy: "We start with a detailed conversation about your timeline, budget, preferred neighborhoods, and lifestyle needs, whether you are moving from across town or across the country." },
  { number: "02", title: "Neighborhood Matching", copy: "Your specialist will identify the best communities in San Dimas, Glendora, La Verne, Claremont, and the greater San Gabriel Valley based on your priorities." },
  { number: "03", title: "Curated Home Tours", copy: "We schedule targeted showings of properties that match your criteria, making the most of your time whether you are visiting in person or touring virtually." },
  { number: "04", title: "Offer & Negotiation", copy: "Our experienced agents negotiate on your behalf with full knowledge of local market conditions, ensuring you get the best possible terms on your new home." },
  { number: "05", title: "Smooth Close & Move-In", copy: "We coordinate with escrow, title, and lenders to ensure a clean close, and stay available after the keys are in your hand to answer any questions about your new community." },
];

const areas = [
  { city: "San Dimas", description: "A charming foothill community with tree-lined streets, easy freeway access, and a welcoming atmosphere." },
  { city: "Glendora", description: "Known as 'The Pride of the Foothills,' Glendora offers excellent schools, a walkable downtown, and a strong sense of community." },
  { city: "La Verne", description: "Home to the University of La Verne, this city blends small-town warmth with suburban convenience and beautiful parks." },
  { city: "Claremont", description: "A college town with a vibrant arts scene, historic architecture, and some of the most sought-after residential streets in the Inland Valley." },
  { city: "Pomona", description: "A diverse, growing city with affordable options and easy access to major employment centers throughout the region." },
  { city: "Covina & West Covina", description: "Established communities with strong schools, retail amenities, and a wide range of housing options for every budget." },
];

export default function Relocation() {
  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }}>
      <SiteNav activeTab="Relocation" />

      <main id="main-content">
        {/* Hero */}
        <section className="c21-inner-hero">
          <img src={heroImage} alt="Relocation to Southern California" className="c21-inner-hero-bg" />
          <div className="c21-inner-hero-overlay" />
          <div className="c21-inner-hero-content">
            <h1 className="c21-inner-hero-title">Relocating to<br />Southern California?</h1>
            <p className="c21-inner-hero-subtitle">
              Moving to a new area is one of life's biggest transitions. Century 21 Citrus Realty's dedicated relocation specialists make the process smooth, informed, and personal from your first call to your closing day.
            </p>
            <div className="c21-hero-actions">
              <a href={contactUrl} className="c21-btn-gold"><Phone size={15} /> Talk with a Specialist</a>
              <a href={phoneUrl} className="c21-btn-outline-white"><Phone size={15} /> 909.592.8500</a>
            </div>
          </div>
        </section>

        {/* Andrew Mendez Inquiry Section */}
        <section style={{ background: "#F7F6F3", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.6rem" }}>Your Relocation Specialist</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--c21-black)", lineHeight: 1.2 }}>Ready to Help You Move</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)", gap: "3.5rem", alignItems: "start" }}>
              {/* Agent card */}
              <div style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
                <img
                  src="/manus-storage/andrew-mendez_8a9071ac.png"
                  alt="Andrew Mendez, Relocation Specialist at Century 21 Citrus Realty"
                  style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", objectPosition: "center top", display: "block" }}
                />
                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.25rem" }}>Andrew Mendez</h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--c21-gold)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1rem" }}>Certified Relocation Specialist</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <a href="tel:16267333366" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--c21-black)", textDecoration: "none", fontWeight: 500 }}>
                      <Phone size={15} color="var(--c21-gold)" /> 626-733-3366
                    </a>
                    <a href="mailto:andrew@c21citrus.com" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--c21-black)", textDecoration: "none", fontWeight: 500 }}>
                      <Mail size={15} color="var(--c21-gold)" /> andrew@c21citrus.com
                    </a>
                    <p style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "rgba(0,0,0,0.5)", margin: 0 }}>
                      DRE: 01888530
                    </p>
                  </div>
                </div>
              </div>
              {/* Inquiry form */}
              <div>
                <p style={{ fontSize: "0.95rem", color: "rgba(0,0,0,0.65)", lineHeight: 1.85, marginBottom: "2rem" }}>
                  Whether you are relocating for work, family, or a fresh start, our Relocation Department is here to guide you every step of the way. Fill out the form below and he will be in touch within one business day.
                </p>
                <AndrewInquiryForm />
              </div>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section style={{ background: "#fff", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
            <p className="c21-section-eyebrow" style={{ justifyContent: "center" }}>Full-Service Relocation</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: "var(--c21-black)", lineHeight: 1.2, marginBottom: "1.25rem" }}>
              Your Move Deserves Expert Guidance
            </h2>
            <p style={{ fontSize: "1.05rem", color: "#555", lineHeight: 1.85, maxWidth: "720px", margin: "0 auto" }}>
              Whether you are relocating for work, family, or a fresh start, Century 21 Citrus Realty has been helping individuals and families settle into Southern California since 1972. We combine the reach of a global brand with the personal attention of a local office that truly knows this market.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section style={{ background: "var(--c21-off-white)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <p className="c21-section-eyebrow">How We Help</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--c21-black)", marginBottom: "2.5rem", maxWidth: "520px" }}>
              Relocation Services Tailored to You
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {services.map((s) => (
                <div key={s.title} style={{ background: "#fff", borderRadius: "3px", padding: "2rem", borderTop: "3px solid var(--c21-gold)", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <div style={{ width: "42px", height: "42px", background: "var(--c21-gold)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.1rem" }}>
                    <s.icon size={20} color="#121212" />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.65rem" }}>{s.title}</h3>
                  <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.75 }}>{s.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Network Banner */}
        <section style={{ background: "var(--c21-black)", padding: "4.5rem 2rem" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <p className="c21-section-eyebrow" style={{ color: "var(--c21-gold)" }}>
                <Globe size={14} style={{ marginRight: "0.4rem" }} />
                Global Reach
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "1.25rem" }}>
                Connected Worldwide, Grounded Locally
              </h2>
              <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.85, marginBottom: "1.75rem" }}>
                As part of the global network, Century 21 Citrus Realty has access to over 144,000 real estate professionals in more than 12,900 offices across 84 countries. Whether you are moving from New York, Tokyo, or London, we can coordinate your transition seamlessly.
              </p>
              <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.85 }}>
                Listings are syndicated to more than 200 of the internet's most visited real estate sites, giving your current home maximum exposure while you search for your next one.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {[
                { stat: "144,000+", label: "Real Estate Professionals" },
                { stat: "84", label: "Countries Worldwide" },
                { stat: "12,900+", label: "Offices Globally" },
                { stat: "200+", label: "Listing Syndication Sites" },
              ].map((item) => (
                <div key={item.label} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "3px", padding: "1.5rem", textAlign: "center" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--c21-gold)", marginBottom: "0.4rem" }}>{item.stat}</p>
                  <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section style={{ background: "#fff", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <p className="c21-section-eyebrow">The Process</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--c21-black)", marginBottom: "3rem", maxWidth: "520px" }}>
              How Your Relocation Works
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {steps.map((step, i) => (
                <div key={step.number} style={{ display: "flex", alignItems: "flex-start", gap: "2rem", paddingBottom: i < steps.length - 1 ? "2.5rem" : "0", position: "relative" }}>
                  {/* Step number circle + connecting line */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: "48px", height: "48px", background: "var(--c21-gold)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 900, letterSpacing: "0.06em", color: "var(--c21-black)", flexShrink: 0 }}>
                      {step.number}
                    </div>
                    {i < steps.length - 1 && (
                      <div style={{ width: "2px", flex: 1, minHeight: "2rem", background: "#e8e4dc", marginTop: "0.5rem" }} />
                    )}
                  </div>
                  {/* Step content */}
                  <div style={{ paddingTop: "0.6rem", paddingBottom: i < steps.length - 1 ? "1rem" : "0", flex: 1 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.6rem" }}>{step.title}</h3>
                    <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.8, margin: 0 }}>{step.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Areas We Serve */}
        <section style={{ background: "var(--c21-off-white)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <p className="c21-section-eyebrow">
              <MapPin size={14} style={{ marginRight: "0.4rem" }} />
              Communities We Serve
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.75rem" }}>
              Find Your Place in the San Gabriel Valley
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#666", lineHeight: 1.8, maxWidth: "600px", marginBottom: "2.5rem" }}>
              We specialize in communities throughout the eastern San Gabriel Valley and Inland Valley foothills. Here is a quick overview of the areas where we work every day.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {areas.map((area) => (
                <div key={area.city} style={{ background: "#fff", borderRadius: "3px", padding: "1.75rem", display: "flex", gap: "1rem", alignItems: "flex-start", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <MapPin size={18} style={{ color: "var(--c21-gold)", flexShrink: 0, marginTop: "0.15rem" }} />
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.4rem" }}>{area.city}</h3>
                    <p style={{ fontSize: "0.87rem", color: "#666", lineHeight: 1.7 }}>{area.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Neighborhood Image Strip */}
        <div style={{ height: "320px", overflow: "hidden", position: "relative" }}>
          <img src={neighborhoodImage} alt="Southern California neighborhood" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
                Ready to Make Southern California Home?
              </p>
              <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.8)", marginBottom: "1.75rem" }}>
                Our relocation specialists are available to answer your questions and start your search.
              </p>
              <a href={contactUrl} className="c21-btn-gold">
                <ArrowRight size={15} /> Start the Conversation
              </a>
            </div>
          </div>
        </div>

        {/* Why Citrus */}
        <section style={{ background: "#fff", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <p className="c21-section-eyebrow">
                <Star size={14} style={{ marginRight: "0.4rem" }} />
                Why Century 21 Citrus Realty
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--c21-black)", lineHeight: 1.2, marginBottom: "1.25rem" }}>
                Local Expertise Backed by a Global Brand
              </h2>
              <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.85, marginBottom: "1.5rem" }}>
                Century 21 Citrus Realty has been a trusted part of the San Dimas community since 1972. Our agents live and work in the neighborhoods they sell, giving you genuine insight that no algorithm or out-of-town agent can match.
              </p>
              <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.85, marginBottom: "2rem" }}>
                Combined with the marketing reach and referral network of one of the world's most recognized real estate brands, we offer the best of both worlds: local knowledge and global resources.
              </p>
              <a href={contactUrl} className="c21-btn-gold">
                <Heart size={15} /> Talk with a Relocation Specialist
              </a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { label: "Years Serving Southern California", value: "53+" },
                { label: "Agents Ready to Help", value: "184" },
                { label: "Communities We Know Well", value: "15+" },
                { label: "Global Brand Recognition", value: "#1" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "1.25rem 1.5rem", background: "var(--c21-off-white)", borderRadius: "3px", borderLeft: "4px solid var(--c21-gold)" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--c21-gold)", minWidth: "60px" }}>{item.value}</p>
                  <p style={{ fontSize: "0.88rem", color: "var(--c21-black)", fontWeight: 600, lineHeight: 1.4 }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "var(--c21-black)", padding: "5rem 2rem", textAlign: "center" }}>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <img src={logoUrl} alt="Century 21 Citrus Realty" style={{ height: "52px", marginBottom: "1.75rem", opacity: 0.9 }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "1rem" }}>
              Let's Plan Your Move Together
            </h2>
            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "2.25rem" }}>
              Call us, fill out our contact form, or stop by the office. Our relocation team is ready to answer your questions and help you find the right home in the right community.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href={contactUrl} className="c21-btn-gold"><ArrowRight size={15} /> Contact Us</a>
              <a href={phoneUrl} className="c21-btn-outline-white"><Phone size={15} /> 909.592.8500</a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
}
