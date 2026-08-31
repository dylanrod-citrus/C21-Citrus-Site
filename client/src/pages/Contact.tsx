/*
  CENTURY 21 CITRUS REALTY - CONTACT US PAGE
  Design: C21 brand-aligned luxury real estate portal
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
*/
import { CheckCircle, Clock, Mail, MapPin, Phone, Send, User } from "lucide-react";
import { useState } from "react";
import { FormSpamGuard, readFormSpamPayload } from "../components/FormSpamGuard";
import SiteNav from "../components/SiteNav";

const logoUrl = "/manus-storage/century21-citrus-realty-gold-logo_f3913815.png";
const phoneUrl = "tel:19095928500";
const emailUrl = "mailto:oj@c21citrus.com";
const idxSearchUrl = "https://c21citrus.com/search/";
const contactUrl = "/contact";

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e0dbd0",
  borderRadius: "2px",
  padding: "0.65rem 0.9rem",
  fontFamily: "'Lato', sans-serif",
  fontSize: "0.9rem",
  color: "#121212",
  background: "#fafaf8",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'Lato', sans-serif",
  fontSize: "0.75rem",
  fontWeight: 800,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#555",
  marginBottom: "0.4rem",
};

const errorStyle: React.CSSProperties = {
  fontFamily: "'Lato', sans-serif",
  fontSize: "0.75rem",
  color: "#c0392b",
  marginTop: "0.3rem",
};

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Your name is required.";
    if (!form.email.trim()) {
      e.email = "Your email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!form.message.trim()) e.message = "Please include a message.";
    return e;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => { const n = { ...err }; delete n[name]; return n; });
  }

  const [submitError, setSubmitError] = useState("");

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
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          subject: form.subject || undefined,
          message: form.message,
          ...protection,
        }),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Unable to send your message. Please call us at 909.592.8500.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ fontFamily: "'Lato', sans-serif", background: "#f7f6f3", minHeight: "100vh" }}>
      <SiteNav activeTab="Contact" />

      {/* Page Hero */}
      <section style={{
        background: "var(--c21-black)",
        padding: "4rem 2rem 3rem",
        textAlign: "center",
      }}>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.6rem" }}>
          We're Here to Help
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: "0.75rem" }}>
          Contact Us
        </h1>
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.7)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
          Reach out to the Century 21 Citrus Realty office whether you have a question, want to schedule a consultation, or are ready to start your home search.
        </p>
      </section>

      {/* Quick contact bar */}
      <div style={{ background: "var(--c21-gold)", padding: "1rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem" }}>
          <a href={phoneUrl} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Lato', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "var(--c21-black)", textDecoration: "none" }}>
            <Phone size={15} /> 909.592.8500
          </a>
          <a href={emailUrl} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Lato', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "var(--c21-black)", textDecoration: "none" }}>
            <Mail size={15} /> oj@c21citrus.com
          </a>
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Lato', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "var(--c21-black)" }}>
            <Clock size={15} /> Mon-Fri 9am-6pm · Sat & Sun By Appt
          </span>
        </div>
      </div>

      <main id="main-content" style={{ maxWidth: "1100px", margin: "0 auto", padding: "3.5rem 2rem 5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "3rem", alignItems: "start" }}>

          {/* Left - Contact Form */}
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.5rem" }}>
              Send Us a Message
            </h2>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.92rem", color: "#666", lineHeight: 1.7, marginBottom: "2rem" }}>
              Fill out the form below and a member of our team will respond within one business day.
            </p>

            {submitted ? (
              <div style={{ background: "#fff", border: "1px solid #d4edda", borderRadius: "4px", padding: "2.5rem", textAlign: "center" }}>
                <CheckCircle size={48} style={{ color: "#27ae60", margin: "0 auto 1rem" }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.5rem" }}>
                  Message Sent!
                </h3>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.92rem", color: "#555", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  Thank you! Your message has been sent. A member of our team will be in touch within one business day. A confirmation has been sent to your email.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                  style={{ background: "var(--c21-gold)", color: "var(--c21-black)", fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.65rem 1.5rem", borderRadius: "2px", border: "none", cursor: "pointer" }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: "4px", padding: "2rem 2rem 2.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                  <div>
                    <label style={labelStyle} htmlFor="name">
                      <User size={11} style={{ display: "inline", marginRight: "0.3rem", verticalAlign: "middle" }} />
                      Your Name *
                    </label>
                    <input id="name" name="name" type="text" placeholder="Jane Smith" value={form.name} onChange={handleChange}
                      style={{ ...inputStyle, borderColor: errors.name ? "#c0392b" : "#e0dbd0" }} />
                    {errors.name && <p style={errorStyle}>{errors.name}</p>}
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="email">
                      <Mail size={11} style={{ display: "inline", marginRight: "0.3rem", verticalAlign: "middle" }} />
                      Your Email *
                    </label>
                    <input id="email" name="email" type="email" placeholder="jane@example.com" value={form.email} onChange={handleChange}
                      style={{ ...inputStyle, borderColor: errors.email ? "#c0392b" : "#e0dbd0" }} />
                    {errors.email && <p style={errorStyle}>{errors.email}</p>}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                  <div>
                    <label style={labelStyle} htmlFor="phone">
                      <Phone size={11} style={{ display: "inline", marginRight: "0.3rem", verticalAlign: "middle" }} />
                      Phone (optional)
                    </label>
                    <input id="phone" name="phone" type="tel" placeholder="(626) 555-0100" value={form.phone} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="subject">Subject</label>
                    <select id="subject" name="subject" value={form.subject} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="">Select a topic…</option>
                      <option value="I'm looking to buy a home">Buying a Home</option>
                      <option value="I'm looking to sell my home">Selling a Home</option>
                      <option value="I'd like a home valuation">Home Valuation</option>
                      <option value="I'd like to schedule a showing">Schedule a Showing</option>
                      <option value="I'm interested in an open house">Open House Inquiry</option>
                      <option value="I'd like to speak with an agent">Speak with an Agent</option>
                      <option value="Career / Joining the Team">Careers</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={labelStyle} htmlFor="message">Message *</label>
                  <textarea id="message" name="message" rows={6}
                    placeholder="How can we help you? Tell us about your real estate goals…"
                    value={form.message} onChange={handleChange}
                    style={{ ...inputStyle, resize: "vertical", minHeight: "140px", borderColor: errors.message ? "#c0392b" : "#e0dbd0" }} />
                  {errors.message && <p style={errorStyle}>{errors.message}</p>}
                </div>

                <div style={{ marginBottom: "1.25rem" }}><FormSpamGuard /></div>

                <button type="submit" disabled={submitting} style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: submitting ? "#b8973e" : "var(--c21-gold)",
                  color: "var(--c21-black)", fontFamily: "'Lato', sans-serif", fontSize: "0.78rem",
                  fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
                  padding: "0.75rem 2rem", borderRadius: "2px", border: "none",
                  cursor: submitting ? "not-allowed" : "pointer", transition: "background 0.2s",
                }}>
                  <Send size={14} />
                  {submitting ? "Sending…" : "Send Message"}
                </button>
                {submitError && (
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.85rem", color: "#c0392b", marginTop: "1rem", lineHeight: 1.5 }}>
                    {submitError}
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Right - Office Info + Map */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Office details card */}
            <div style={{ background: "var(--c21-black)", borderRadius: "4px", padding: "2rem", color: "#fff" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--c21-gold)", marginBottom: "1.25rem" }}>
                Office Information
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <a href={phoneUrl} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", color: "#ddd", textDecoration: "none", fontFamily: "'Lato', sans-serif", fontSize: "0.88rem", lineHeight: 1.5 }}>
                  <Phone size={15} style={{ color: "var(--c21-gold)", flexShrink: 0, marginTop: "0.15rem" }} />
                  <span>909.592.8500</span>
                </a>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", color: "#ddd", fontFamily: "'Lato', sans-serif", fontSize: "0.88rem", lineHeight: 1.5 }}>
                  <MapPin size={15} style={{ color: "var(--c21-gold)", flexShrink: 0, marginTop: "0.15rem" }} />
                  <span>1100 Via Verde<br />San Dimas, CA 91773</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", color: "#ddd", fontFamily: "'Lato', sans-serif", fontSize: "0.88rem", lineHeight: 1.5 }}>
                  <Clock size={15} style={{ color: "var(--c21-gold)", flexShrink: 0, marginTop: "0.15rem" }} />
                  <span>Mon - Fri: 9:00 am - 6:00 pm<br />Saturday &amp; Sunday: By Appointment</span>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div style={{ borderRadius: "4px", overflow: "hidden", border: "1px solid #e8e4dc", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
              <iframe
                title="Century 21 Citrus Realty Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.4!2d-117.8!3d34.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c32b5b5b5b5b5b%3A0x0!2sCentury+21+Citrus+Realty%2C+San+Dimas%2C+CA!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="280"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div style={{ padding: "0.85rem 1rem", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", color: "#666" }}>1100 Via Verde, San Dimas, CA</span>
                <a
                  href="https://maps.google.com/?q=Century+21+Citrus+Realty+1100+Via+Verde+San+Dimas+CA"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--c21-gold-dark)", textDecoration: "none" }}
                >
                  Get Directions →
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
    </div>
  );
}
