/*
  CENTURY 21 CITRUS REALTY — GET YOUR LICENSE PAGE
  Design: C21 brand-aligned luxury real estate portal
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
  Rule: Never write "Century 21" in visible copy — always use the logo image
*/
import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  GraduationCap,
  Mail,
  Phone,
  X,
} from "lucide-react";
import SiteNav from "../components/SiteNav";

const heroImage = "/manus-storage/hero-luxury-interior_f79432c6.jpg";

const steps = [
  {
    number: "01",
    title: "Complete a Pre-License Course",
    copy: "California requires 135 hours of DRE-approved pre-license education. Courses are available online or in person and cover real estate principles, practice, and one elective.",
  },
  {
    number: "02",
    title: "Apply for the Exam",
    copy: "Submit your exam application to the California Department of Real Estate (DRE) along with the required fee. You can apply online at dre.ca.gov.",
  },
  {
    number: "03",
    title: "Pass the State Exam",
    copy: "The California salesperson exam consists of 150 multiple-choice questions. You need a score of 70% or higher to pass. Results are provided immediately upon completion.",
  },
  {
    number: "04",
    title: "Activate Your License",
    copy: "Once you pass, you will need to be sponsored by a licensed broker to activate your license. Century 21 Citrus Realty can sponsor you and get you started right away.",
  },
];

const faqs = [
  {
    q: "How long does it take to get a real estate license in California?",
    a: "Most students complete the process in 3–6 months. The pre-license coursework takes 135 hours, and exam scheduling with the DRE typically takes 4–8 weeks after your application is submitted.",
  },
  {
    q: "What are the requirements to apply for the California real estate exam?",
    a: "You must be at least 18 years old, have a valid Social Security number, and complete the required 135 hours of DRE-approved pre-license education. A high school diploma is not required.",
  },
  {
    q: "How much does it cost to get a real estate license?",
    a: "Costs include the pre-license course (typically $200–$500), the exam application fee ($60), and the license fee ($245). Total costs are generally between $500–$900.",
  },
  {
    q: "What happens if I fail the state exam?",
    a: "There is no limit on how many times you can take the exam. The DRE charges $100 per exam sitting. You can reschedule online through the DRE's licensing system at any time.",
  },
  {
    q: "How do I reschedule my exam date?",
    a: "The fastest and easiest method is using the DRE's online licensing system at dre.ca.gov. You may reschedule an exam date at any time before the scheduled sitting.",
  },
  {
    q: "How long does it take to get my exam results?",
    a: "You will receive your results immediately upon completing the exam at the testing center.",
  },
  {
    q: "I passed my exam — now what?",
    a: "Congratulations! Contact our office to schedule an interview and get your license activated under Century 21 Citrus Realty's broker. Call Janeth at 909.592.8500 ext. 229.",
  },
  {
    q: "How do I change my mailing address with the DRE?",
    a: "You can update your address online at secure.dre.ca.gov/elicensing/. To update it with our office records, simply contact us directly.",
  },
];

const resources = [
  {
    icon: GraduationCap,
    title: "DRE-Approved Schools",
    copy: "The California DRE maintains a list of approved pre-license education providers. Courses are available online and in-person across Southern California.",
    link: "https://www.dre.ca.gov/Licensees/ApprovedCourses.html",
    linkText: "Browse Approved Schools →",
  },
  {
    icon: ClipboardList,
    title: "Exam Application",
    copy: "Apply for the California salesperson exam online through the DRE's eLicensing portal. Have your course completion certificates ready.",
    link: "https://secure.dre.ca.gov/elicensing/",
    linkText: "Apply Online →",
  },
  {
    icon: BookOpen,
    title: "Exam Candidate Handbook",
    copy: "Download the official DRE candidate handbook for exam content outlines, testing center policies, and identification requirements.",
    link: "http://www.dre.ca.gov/files/pdf/forms/re237.pdf",
    linkText: "Download Handbook →",
  },
];

const JANETH_EMAIL = "janeth@c21citrus.com";

export default function GetYourLicense() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Janeth modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function openModal() {
    setForm({ name: "", email: "", phone: "", message: "" });
    setErrors({});
    setSubmitted(false);
    setSubmitError("");
    setModalOpen(true);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "A valid email is required.";
    if (!form.message.trim()) e.message = "Message is required.";
    return e;
  }

  async function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
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
          subject: "License Inquiry via Get Your License Page",
          message: form.message.trim(),
          recipientOverride: JANETH_EMAIL,
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

  return (
    <>
    <div style={{ fontFamily: "'Lato', sans-serif" }}>
      <SiteNav activeTab="Careers" />

      <main id="main-content">
        {/* Hero */}
        <section className="c21-inner-hero">
          <img src={heroImage} alt="Real estate career" className="c21-inner-hero-bg" />
          <div className="c21-inner-hero-overlay" />
          <div className="c21-inner-hero-content">
            <h1 className="c21-inner-hero-title">Get Your Real Estate<br />License in California</h1>
            <p className="c21-inner-hero-subtitle">
              We guide aspiring agents through every step of the licensing process, from pre-license education to passing the state exam and activating your license with Century 21 Citrus Realty.
            </p>
            <div className="c21-hero-actions">
              <a href="tel:19095928500" className="c21-btn-outline-white"><Phone size={15} /> Call 909.592.8500</a>
            </div>
          </div>
        </section>

        {/* 4-Step Process */}
        <section style={{ background: "#fff", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p className="c21-section-eyebrow" style={{ justifyContent: "center" }}>The Licensing Path</p>
              <h2 className="c21-section-title">Four Steps to Your California License</h2>
              <p className="c21-section-subtitle" style={{ margin: "0 auto" }}>
                California's licensing process is straightforward. Here is exactly what you need to do to go from interested to licensed.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "2.5rem" }}>
              {steps.map((step) => (
                <div key={step.number} style={{ borderTop: "3px solid var(--c21-gold)", paddingTop: "1.5rem" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", fontWeight: 700, color: "var(--c21-gold)", opacity: 0.35, lineHeight: 1, marginBottom: "0.75rem" }}>{step.number}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.65rem" }}>{step.title}</h3>
                  <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.75 }}>{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resources */}
        <section style={{ background: "var(--c21-off-white)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p className="c21-section-eyebrow" style={{ justifyContent: "center" }}>Official Resources</p>
              <h2 className="c21-section-title">DRE Links & Study Materials</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
              {resources.map((r) => {
                const Icon = r.icon;
                return (
                  <div
                    key={r.title}
                    style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: "3px", padding: "2rem" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                  >
                    <div style={{ width: "44px", height: "44px", background: "rgba(190,175,136,0.12)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                      <Icon size={20} style={{ color: "var(--c21-gold-dark)" }} />
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.65rem" }}>{r.title}</h3>
                    <p style={{ fontSize: "0.88rem", color: "#555", lineHeight: 1.7, marginBottom: "1.25rem" }}>{r.copy}</p>
                    <a href={r.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.85rem", color: "var(--c21-gold-dark)", fontWeight: 600, textDecoration: "none" }}>{r.linkText}</a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ background: "#fff", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p className="c21-section-eyebrow" style={{ justifyContent: "center" }}>Common Questions</p>
              <h2 className="c21-section-title">Licensing FAQ</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  style={{ borderBottom: "1px solid #e8e4dc" }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "1.25rem 0", background: "none", border: "none", cursor: "pointer",
                      textAlign: "left", gap: "1rem"
                    }}
                  >
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600, color: "var(--c21-black)" }}>{faq.q}</span>
                    {openFaq === i
                      ? <ChevronUp size={18} style={{ color: "var(--c21-gold-dark)", flexShrink: 0 }} />
                      : <ChevronDown size={18} style={{ color: "#999", flexShrink: 0 }} />
                    }
                  </button>
                  {openFaq === i && (
                    <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.75, paddingBottom: "1.25rem", paddingRight: "2rem" }}>{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "var(--c21-black)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
            <p className="c21-section-eyebrow" style={{ justifyContent: "center", color: "var(--c21-gold)" }}>Ready to Begin?</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "1.25rem" }}>
              We Will Help You Every Step of the Way
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
              Once you pass your exam, contact Janeth at our office to schedule an interview and activate your license with Century 21 Citrus Realty. We offer a two-week onboarding program so nothing is left to chance.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={openModal} className="c21-btn-gold" style={{ cursor: "pointer", border: "none" }}><Mail size={15} /> Email Janeth</button>
              <a href="tel:19095928500" className="c21-btn-outline-white"><Phone size={15} /> 909.592.8500 ext. 229</a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>

    {/* Janeth Contact Modal */}
    {modalOpen && (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="janeth-modal-title"
        style={{
          position: "fixed", inset: 0, zIndex: 9000,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.65)", padding: "1rem",
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
      >
        <div style={{
          background: "#fff", borderRadius: "4px", width: "100%", maxWidth: "520px",
          padding: "2.5rem 2rem", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}>
          {/* Close */}
          <button
            onClick={() => setModalOpen(false)}
            aria-label="Close"
            style={{
              position: "absolute", top: "1rem", right: "1rem",
              background: "none", border: "none", cursor: "pointer", color: "#666",
            }}
          >
            <X size={20} />
          </button>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: "var(--c21-gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <Mail size={20} color="#121212" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.75rem" }}>Message Sent!</h3>
              <p style={{ color: "#555", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>Thank you — Janeth will be in touch with you shortly. A confirmation has been sent to your email.</p>
              <button onClick={() => setModalOpen(false)} className="c21-btn-gold" style={{ border: "none", cursor: "pointer" }}>Close</button>
            </div>
          ) : (
            <>
              <h2 id="janeth-modal-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.4rem" }}>Contact Janeth</h2>
              <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1.75rem", lineHeight: 1.5 }}>Fill out the form below and Janeth will follow up with you directly about getting your license with Century 21 Citrus Realty.</p>

              <form onSubmit={handleModalSubmit} noValidate>
                {/* Name */}
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="j-name" style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#333", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Full Name *</label>
                  <input
                    id="j-name" type="text" autoComplete="name" required
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{ width: "100%", padding: "0.65rem 0.85rem", border: `1px solid ${errors.name ? "#c0392b" : "#ccc"}`, borderRadius: "2px", fontSize: "0.95rem", fontFamily: "'Lato', sans-serif", boxSizing: "border-box" }}
                  />
                  {errors.name && <p style={{ color: "#c0392b", fontSize: "0.78rem", marginTop: "0.25rem" }}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="j-email" style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#333", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email Address *</label>
                  <input
                    id="j-email" type="email" autoComplete="email" required
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ width: "100%", padding: "0.65rem 0.85rem", border: `1px solid ${errors.email ? "#c0392b" : "#ccc"}`, borderRadius: "2px", fontSize: "0.95rem", fontFamily: "'Lato', sans-serif", boxSizing: "border-box" }}
                  />
                  {errors.email && <p style={{ color: "#c0392b", fontSize: "0.78rem", marginTop: "0.25rem" }}>{errors.email}</p>}
                </div>

                {/* Phone */}
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="j-phone" style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#333", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Phone Number</label>
                  <input
                    id="j-phone" type="tel" autoComplete="tel"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid #ccc", borderRadius: "2px", fontSize: "0.95rem", fontFamily: "'Lato', sans-serif", boxSizing: "border-box" }}
                  />
                </div>

                {/* Message */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label htmlFor="j-message" style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#333", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Message *</label>
                  <textarea
                    id="j-message" rows={4} required
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell Janeth a bit about where you are in the licensing process..."
                    style={{ width: "100%", padding: "0.65rem 0.85rem", border: `1px solid ${errors.message ? "#c0392b" : "#ccc"}`, borderRadius: "2px", fontSize: "0.95rem", fontFamily: "'Lato', sans-serif", resize: "vertical", boxSizing: "border-box" }}
                  />
                  {errors.message && <p style={{ color: "#c0392b", fontSize: "0.78rem", marginTop: "0.25rem" }}>{errors.message}</p>}
                </div>

                {submitError && (
                  <p style={{ color: "#c0392b", fontSize: "0.85rem", marginBottom: "1rem", padding: "0.75rem", background: "#fdf0f0", borderRadius: "2px", border: "1px solid #f5c6c6" }}>{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="c21-btn-gold"
                  style={{ width: "100%", border: "none", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, justifyContent: "center" }}
                >
                  <Mail size={15} /> {submitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    )}
    </>
  );
}
