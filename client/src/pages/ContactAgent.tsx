/*
  CENTURY 21 CITRUS REALTY - CONTACT AGENT PAGE
  Design: C21 brand-aligned luxury real estate portal
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
  Rule: Never write "Century 21" in visible copy - always use the logo image
*/
import { CheckCircle, Mail, MapPin, Phone, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import SiteNav from "../components/SiteNav";

const logoUrl = "/manus-storage/century21-citrus-realty-gold-logo_f3913815.png";
const phoneUrl = "tel:19095928500";
const emailUrl = "mailto:oj@c21citrus.com";
const contactUrl = "/contact";
const idxSearchUrl = "https://c21citrus.com/search/";

function getParam(search: string, key: string): string {
  const params = new URLSearchParams(search);
  return params.get(key) ?? "";
}

export default function ContactAgent() {
  const [location] = useLocation();
  const search = typeof window !== "undefined" ? window.location.search : "";

  const agentName = getParam(search, "agent");
  const agentEmail = getParam(search, "email");
  const agentPhone = getParam(search, "phone");

  const [form, setForm] = useState({
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    subject: agentName ? `Inquiry for ${agentName}` : "Real Estate Inquiry",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Update subject if agentName loads after mount
  useEffect(() => {
    if (agentName) {
      setForm((f) => ({ ...f, subject: `Inquiry for ${agentName}` }));
    }
  }, [agentName]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.senderName.trim()) e.senderName = "Your name is required.";
    if (!form.senderEmail.trim()) {
      e.senderEmail = "Your email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.senderEmail)) {
      e.senderEmail = "Please enter a valid email address.";
    }
    if (!form.message.trim()) e.message = "Please include a message.";
    return e;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => { const n = { ...err }; delete n[name]; return n; });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);

    // Build mailto link and open it — this is the standard static-site approach
    // since there is no backend to relay email
    const to = agentEmail || "oj@c21citrus.com";
    const subject = encodeURIComponent(form.subject);
    const body = encodeURIComponent(
      `From: ${form.senderName}\nEmail: ${form.senderEmail}${form.senderPhone ? `\nPhone: ${form.senderPhone}` : ""}\n\n${form.message}`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

    // Show success state after a brief delay
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  }

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

  return (
    <div style={{ fontFamily: "'Lato', sans-serif", background: "#f7f6f3", minHeight: "100vh" }}>
      <SiteNav activeTab="Agents" />

      <main id="main-content" style={{ maxWidth: "1100px", margin: "0 auto", padding: "3.5rem 2rem 5rem" }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: "2rem" }}>
          <a
            href="/agents"
            style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.8rem", color: "var(--c21-gold-dark)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            ← Back to Agents
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "3rem", alignItems: "start" }}>

          {/* Left - Form */}
          <div>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold-dark)", marginBottom: "0.5rem" }}>
              Get in Touch
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: "var(--c21-black)", lineHeight: 1.15, marginBottom: "0.75rem" }}>
              {agentName ? `Contact ${agentName}` : "Contact an Agent"}
            </h1>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.95rem", color: "#666", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "520px" }}>
              Fill out the form below and your message will be sent directly to{" "}
              {agentName ? <strong style={{ color: "#333" }}>{agentName}</strong> : "the agent"}.
              Expect a response within one business day.
            </p>

            {submitted ? (
              <div style={{ background: "#fff", border: "1px solid #d4edda", borderRadius: "4px", padding: "2.5rem", textAlign: "center" }}>
                <CheckCircle size={48} style={{ color: "#27ae60", margin: "0 auto 1rem" }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.5rem" }}>
                  Message Sent!
                </h2>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.92rem", color: "#555", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  Your email client should have opened with the message ready to send.
                  {agentName && <> {agentName} will be in touch shortly.</>}
                </p>
                <a
                  href="/agents"
                  style={{ display: "inline-block", background: "var(--c21-gold)", color: "var(--c21-black)", fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.65rem 1.5rem", borderRadius: "2px", textDecoration: "none" }}
                >
                  ← Back to Agents
                </a>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: "4px", padding: "2rem 2rem 2.5rem" }}>

                {/* Agent info banner */}
                {agentName && (
                  <div style={{ background: "#f7f6f3", border: "1px solid #e8e4dc", borderRadius: "3px", padding: "0.85rem 1rem", marginBottom: "1.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ background: "var(--c21-black)", color: "var(--c21-gold)", fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, width: "2rem", height: "2rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "2px", flexShrink: 0 }}>
                      {agentName.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 700, color: "var(--c21-black)" }}>{agentName}</div>
                      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--c21-gold-dark)" }}>Real Estate Agent</div>
                    </div>
                    {agentEmail && (
                      <a href={`mailto:${agentEmail}`} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: "'Lato', sans-serif", fontSize: "0.8rem", color: "#666", textDecoration: "none" }}>
                        <Mail size={13} style={{ color: "var(--c21-gold-dark)" }} />{agentEmail}
                      </a>
                    )}
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                  {/* Sender name */}
                  <div>
                    <label style={labelStyle} htmlFor="senderName">
                      <User size={11} style={{ display: "inline", marginRight: "0.3rem", verticalAlign: "middle" }} />
                      Your Name *
                    </label>
                    <input
                      id="senderName"
                      name="senderName"
                      type="text"
                      placeholder="Jane Smith"
                      value={form.senderName}
                      onChange={handleChange}
                      style={{ ...inputStyle, borderColor: errors.senderName ? "#c0392b" : "#e0dbd0" }}
                    />
                    {errors.senderName && <p style={errorStyle}>{errors.senderName}</p>}
                  </div>

                  {/* Sender email */}
                  <div>
                    <label style={labelStyle} htmlFor="senderEmail">
                      <Mail size={11} style={{ display: "inline", marginRight: "0.3rem", verticalAlign: "middle" }} />
                      Your Email *
                    </label>
                    <input
                      id="senderEmail"
                      name="senderEmail"
                      type="email"
                      placeholder="jane@example.com"
                      value={form.senderEmail}
                      onChange={handleChange}
                      style={{ ...inputStyle, borderColor: errors.senderEmail ? "#c0392b" : "#e0dbd0" }}
                    />
                    {errors.senderEmail && <p style={errorStyle}>{errors.senderEmail}</p>}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                  {/* Sender phone */}
                  <div>
                    <label style={labelStyle} htmlFor="senderPhone">
                      <Phone size={11} style={{ display: "inline", marginRight: "0.3rem", verticalAlign: "middle" }} />
                      Your Phone (optional)
                    </label>
                    <input
                      id="senderPhone"
                      name="senderPhone"
                      type="tel"
                      placeholder="(626) 555-0100"
                      value={form.senderPhone}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label style={labelStyle} htmlFor="subject">Subject</label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={labelStyle} htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Hi, I'm interested in buying/selling a home and would love to connect…"
                    value={form.message}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      minHeight: "130px",
                      borderColor: errors.message ? "#c0392b" : "#e0dbd0",
                    }}
                  />
                  {errors.message && <p style={errorStyle}>{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: submitting ? "#b8973e" : "var(--c21-gold)",
                    color: "var(--c21-black)",
                    fontFamily: "'Lato', sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "0.75rem 2rem",
                    borderRadius: "2px",
                    border: "none",
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  <Send size={14} />
                  {submitting ? "Opening Email…" : "Send Message"}
                </button>

                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", color: "#999", marginTop: "1rem", lineHeight: 1.5 }}>
                  Clicking "Send Message" will open your default email client with the message pre-filled, ready to send.
                </p>
              </form>
            )}
          </div>

          {/* Right - Sidebar info */}
          <div style={{ position: "sticky", top: "100px" }}>
            <div style={{ background: "var(--c21-black)", borderRadius: "4px", padding: "2rem", color: "#fff", marginBottom: "1.25rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--c21-gold)", marginBottom: "1.25rem" }}>
                Office Contact
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <a href={phoneUrl} style={{ display: "flex", alignItems: "center", gap: "0.65rem", color: "#ddd", textDecoration: "none", fontFamily: "'Lato', sans-serif", fontSize: "0.88rem" }}>
                  <Phone size={15} style={{ color: "var(--c21-gold)", flexShrink: 0 }} />
                  909.592.8500
                </a>
                <a href={emailUrl} style={{ display: "flex", alignItems: "center", gap: "0.65rem", color: "#ddd", textDecoration: "none", fontFamily: "'Lato', sans-serif", fontSize: "0.88rem" }}>
                  <Mail size={15} style={{ color: "var(--c21-gold)", flexShrink: 0 }} />
                  oj@c21citrus.com
                </a>
                <a href="https://maps.google.com/?q=Century+21+Citrus+Realty+San+Dimas" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.65rem", color: "#ddd", textDecoration: "none", fontFamily: "'Lato', sans-serif", fontSize: "0.88rem" }}>
                  <MapPin size={15} style={{ color: "var(--c21-gold)", flexShrink: 0 }} />
                  San Dimas, CA
                </a>
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: "4px", padding: "1.5rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.75rem" }}>
                Prefer to Browse First?
              </h3>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.83rem", color: "#666", lineHeight: 1.6, marginBottom: "1rem" }}>
                Search available homes in San Dimas, Glendora, La Verne, and the greater San Gabriel Valley.
              </p>
              <a
                href={idxSearchUrl}
                style={{ display: "block", textAlign: "center", background: "var(--c21-gold)", color: "var(--c21-black)", fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.6rem 1rem", borderRadius: "2px", textDecoration: "none" }}
              >
                Search Homes
              </a>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
    </div>
  );
}
