/*
  CENTURY 21 CITRUS REALTY - GET LICENSED / REAL ESTATE COURSE PAGE
  Redesigned to match c21realtyschool.com layout:
  - Dark charcoal background throughout (~#3a3a3a)
  - C21 Gold headings and accent text
  - White body text
  - Two-column alternating image+text sections
  - Feature grids with gold bold labels
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
*/
import {
  Award,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Sparkles,
  TrendingUp,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FormSpamGuard, readFormSpamPayload } from "../components/FormSpamGuard";
import SiteNav from "../components/SiteNav";
import { C21_ASSET_PATHS } from "../lib/portableAssets";

const heroImage = C21_ASSET_PATHS.interiorHero;
const c21SealImageUrl = C21_ASSET_PATHS.seal;
const JANETH_EMAIL = "janeth@c21citrus.com";

// Dark charcoal color used throughout, matching c21realtyschool.com
const CHARCOAL = "#252526";       // Obsessed Grey
const CHARCOAL_LIGHT = "#2e2e2f"; // Slightly lighter Obsessed Grey
const CHARCOAL_DARK = "#121212";  // Digital Black
const SCHOOL_PORTRAITS = C21_ASSET_PATHS.schoolPortraits;

// ─── Data ────────────────────────────────────────────────────────────────────

const licensingSteps = [
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

const resources = [
  {
    icon: BookOpen,
    title: "Live Scan Application",
    copy: "Download the official DRE Live Scan form (RE 237) required for fingerprinting as part of your license application.",
    link: "http://www.dre.ca.gov/files/pdf/forms/re237.pdf",
    linkText: "Live Scan Application (DRE) →",
  },
];

const faqs = [
  {
    q: "How long does it take to get a Real Estate License in California?",
    a: "Most students complete the process in 3-6 months. The pre-license coursework takes 135 hours, and exam scheduling with the DRE typically takes 6-8 weeks after your application is submitted.",
  },
  {
    q: "What are the requirements to apply for the California Real Estate Exam?",
    a: "You must be at least 18 years old, have a valid Social Security number, and complete the required 135 hours of DRE-approved pre-license education. A high school diploma is not required.",
  },
  {
    q: "How much does it cost to get a Real Estate License?",
    a: "Costs include the pre-license course (typically $199-$245), the exam application fee ($100), and the license fee ($350).",
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
    q: "I passed my exam - now what?",
    a: "Congratulations! Contact our office to schedule an interview and get your license activated under Century 21 Citrus Realty's brokerage. Call Janeth Vega - Director of Career Development at 909.592.8500 ext. 421.",
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Weekly Sales Meetings & Training",
    copy: "Our office holds weekly sales meetings and ongoing training sessions covering market updates, negotiation tactics, listing strategies, and technology tools to keep you sharp and informed.",
  },
  {
    icon: UsersRound,
    title: "Paired with an Experienced Mentor",
    copy: "Every new agent is paired with an award-winning producer who provides hands-on guidance through your first three transactions. Your mentor is available to hold your hand every step in the process. Answer questions, draft and review contracts, and help you build confidence.",
  },
  {
    icon: BookOpen,
    title: "Training and Role Play",
    copy: "We offer 24 different training opportunities every single week — most of them live at the office and also available on Zoom. From contract writing and negotiation role play to prospecting, marketing, and mindset coaching. There is always a class to sharpen your skills, no matter where you are in your career.",
  },
  {
    icon: Award,
    title: "Global Brand, Local Support",
    copy: "Leverage the recognition and marketing power of one of the world's most trusted real estate brands while working in a community-focused office that has served Southern California since 1972.",
  },
  {
    icon: Sparkles,
    title: "Marketing Templates & Listing Support",
    copy: "Access a full library of professional marketing templates, social media assets, and listing presentation materials. Our staff transaction coordinates every file. So you can focus on what is most important...listing and selling Real Estate.",
  },
  {
    icon: Award,
    title: "Access to Office Leads & Floor Time",
    copy: "New agents benefit from office lead opportunities and scheduled floor time to build their pipeline while developing their own sphere of influence and referral network.",
  },
];

const testimonials = [
  {
    quote: "I chose Century 21 Citrus Realty in 2012 because of the reputation and the support system they offered. I got my license through their course, and in my first full year as an agent I became one of the top producers in the office. The training, the mentorship, and the culture here are unlike anything I have experienced anywhere else. Century 21 Citrus Realty did not just give me a license - they gave me a career.",
    name: "Mireya Chavarria",
    award: "",
    photo: SCHOOL_PORTRAITS.mireya,
  },
  {
    quote: "From the moment I walked through the door I felt welcomed. The training here is powerful and practical - not just theory, but real-world tools you can use immediately. What I tell everyone who asks me about getting into real estate is this: it is not just an office, it is a family, and it is a launchpad. Century 21 Citrus Realty gave me everything I needed to build a business I am proud of.",
    name: "Denise Vargas",
    award: "",
    photo: SCHOOL_PORTRAITS.denise,
  },
  {
    quote: "I tried three other offices before landing at Century 21 Citrus Realty, and the difference was immediate. The tools, the training, and the collaboration between agents here are on a completely different level. Everyone genuinely wants to see you succeed. Having everything under one roof - from licensing support to marketing resources to a broker who is actually available - made all the difference in my career.",
    name: "Michelle Del Muro",
    award: "",
    photo: SCHOOL_PORTRAITS.michelle,
  },
  {
    quote:
      "Starting a new chapter in my life with a real estate career has been exciting and humbling. I really enjoy working at Century 21 Citrus and I appreciate the support, training, and guidance this office has provided for me. I am grateful to be in an environment where people are willing to help and share their knowledge as this support has made it easier to excel in real estate. Thank you to all the staff, management and my colleagues for the encouragement and for creating a place where I can continue to learn, improve, and serve my clients well. I'm looking forward to what's ahead in this journey!",
    name: "Stella McCauley",
    award: "",
    photo: SCHOOL_PORTRAITS.stella,
  },
  {
    quote: "After spending my entire adult life working in high-end restaurants, I knew I needed a change, something more stable and meaningful where I could truly build a career. I joined Citrus in 2008, right as the market crashed, and I've never looked back. In fact, Citrus is the only company I've ever worked with in real estate. OJ and his team provide incredible tools and support that set you up for success. And he makes it fun too! Our attitude is, \"We work hard but we play harder!\" I still remember him saying, \"You can fail in this industry, but it's not going to be here. The only reason you would fail is if you don't do what we teach you. Every activity we assign is designed to help you succeed.\" That mindset and the structure behind it made all the difference for me. Since joining Citrus, I've earned more than I ever imagined possible. But more than that, I've had the privilege of helping people achieve the American Dream of homeownership. Through goal-setting, discipline, and being part of a supportive real estate family, I've built a life and a career I'm incredibly proud of. If you're serious about growth and looking for a company that will invest in your success, you need to join our team. At Citrus, we're not just colleagues...we're family.",
    name: "Sharyn Jung",
    award: "",
    photo: SCHOOL_PORTRAITS.sharyn,
  },
  {
    quote: "It's truly an honor to reflect on being the number one agent for seven consecutive years and an award-winning agent since 2015. Achieving this level of success wouldn't have been possible without the incredible support, resources, and training I've received from my brokerage. From day one, I've been part of a team that's more like a family - everyone here is genuinely invested in each other's growth, and it's that sense of community that has played a pivotal role in my success. My broker has built a culture that emphasizes teamwork, personal development, and constant improvement, and that's been the cornerstone of my journey in real estate. The tools and resources available to me have been game-changers, helping me stay ahead of the curve and better serve my clients. From cutting-edge technology to in-depth training programs, I've been empowered to expand my skills and adapt to the ever-changing market. Being able to thrive in such a supportive environment makes all the hard work worth it, and I am deeply grateful for the opportunities I've had to grow both personally and professionally. Here's to many more years of success and collaboration!",
    name: "Kimberly Olbrich",
    award: "",
    photo: SCHOOL_PORTRAITS.kimberly,
  },
  {
    quote: "When I made the leap from my job at Bank of America during the height of COVID, I knew I was chasing something more meaningful, but I had no idea just how life-changing that decision would be. Joining Century 21 Citrus was truly the best move I could've made — from day one, I felt surrounded by a team that genuinely wants you to succeed. The training is top-notch, the support from management is unmatched, and the resources they provide to help you find clients are incredibly effective. On top of that, the office culture is inspiring, energetic, and full of agents who uplift one another. Whether you're brand new or a seasoned pro, Century 21 Citrus gives you the tools, mentorship, and environment to truly thrive. Thank you to my Coach Andrew Mendez for pushing me to pursue this career! I'm so proud to be part of a brokerage that not only believes in your potential but helps you unlock it every step of the way!",
    name: "Gabriela Sandoval",
    award: "",
    photo: SCHOOL_PORTRAITS.gabriela,
  },
  {
    quote: "The environment here truly promotes and supports growth. Agents at all levels openly share ideas and strategies, creating a collaborative and motivating atmosphere. The broker provides high-level training, skill building, and personalized sales coaching that has made a real difference in my career. I feel empowered and prepared to go out and find business, knowing I have a strong support system behind me every step of the way.",
    name: "Aaron Rivas",
    award: "",
    photo: SCHOOL_PORTRAITS.aaron,
  },
];

const onboardingProcess = [
  { number: "01", title: "Reach Out", copy: "Call, email, or fill out the contact form to start a conversation with our Director of Career Development about joining the team." },
  { number: "02", title: "Office Visit", copy: "Tour the office, meet the team, and get a clear picture of our culture, tools, training and resources." },
  { number: "03", title: "Begin Training", copy: "Begin our comprehensive training program covering everything you need to start working with clients confidently." },
  { number: "04", title: "Start Building", copy: "Get your access set up, connect with your mentor and Management team, and start building your real estate business with the Century 21 Citrus Realty team behind you." },
];

// ─── Section Nav ─────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "info-session", label: "Free Info Session" },
  { id: "pricing", label: "Course Pricing" },
  { id: "join-citrus", label: "Join Century 21 Citrus Realty" },
  { id: "scholarship", label: "Scholarship Program" },
  { id: "faq", label: "FAQ" },
];

function SectionNav({ active }: { active: string }) {
  return (
    <nav
      aria-label="Page sections"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        background: CHARCOAL_DARK,
        borderBottom: "1px solid rgba(190,175,136,0.3)",
        padding: "0 2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          gap: "0",
          overflowX: "auto",
        }}
      >
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            style={{
              display: "inline-block",
              padding: "1rem 1.5rem",
              fontFamily: "'Lato', sans-serif",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              color: active === s.id ? "var(--c21-gold)" : "rgba(255,255,255,0.6)",
              borderBottom: active === s.id ? "2px solid var(--c21-gold)" : "2px solid transparent",
              transition: "color 0.2s, border-color 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

// ─── Info Session Form ────────────────────────────────────────────────────────

function InfoSessionForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone.trim()) {
      setSubmitError("Please enter your phone number.");
      return;
    }
    const protection = readFormSpamPayload(e.currentTarget as HTMLFormElement);
    if (!protection.turnstileToken) {
      setSubmitError("Please complete the verification before submitting your request.");
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
          phone: form.phone.trim(),
          subject: "Free Info Session Request - Real Estate Licensing Course",
          message: form.message.trim() || "I would like to sign up for a free info session about starting my real estate career at Century 21 Citrus Realty.",
          recipientOverride: "andrew@c21citrus.com,janeth@c21citrus.com",
          ...protection,
        }),
      });
      if (!res.ok) throw new Error("Server error");
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again or call us at 909.592.8500.");
    } finally {
      setSubmitting(false);
    }
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
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <section id="info-session" style={{ background: CHARCOAL_DARK, padding: "5rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <CalendarCheck size={14} />
            Free Info Session
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: "var(--c21-gold)", lineHeight: 1.2, marginBottom: "1.25rem" }}>
            Free Info Session!
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, marginBottom: "1.75rem" }}>
            Sign up for a free, no-obligation information session today. We will walk you through the licensing process and exactly how Century 21 Citrus Realty supports agents from day one.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {["No experience required", "Learn about licensing requirements", "Ask questions", "Discover what makes Century 21 Citrus Realty different"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <CheckCircle2 size={16} style={{ color: "var(--c21-gold)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.85)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: "3px", padding: "2.5rem", borderTop: "4px solid var(--c21-gold)" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <CalendarCheck size={40} style={{ color: "var(--c21-gold-dark)", marginBottom: "1rem" }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.75rem" }}>Request Sent!</h3>
              <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.7 }}>Your request has been sent to our team. We will be in touch within one business day to confirm your session.</p>
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
                  <input type="text" required placeholder="Jane Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "var(--c21-gold-dark)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#d8d4cc"; }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#666", marginBottom: "0.4rem" }}>Phone *</label>
                  <input type="tel" placeholder="(626) 555-0100" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "var(--c21-gold-dark)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#d8d4cc"; }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#666", marginBottom: "0.4rem" }}>Email Address *</label>
                <input type="email" required placeholder="jane@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "var(--c21-gold-dark)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#d8d4cc"; }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#666", marginBottom: "0.4rem" }}>Questions or Comments</label>
                <textarea rows={3} placeholder="Tell us a little about yourself or any questions you have..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} onFocus={(e) => { e.currentTarget.style.borderColor = "var(--c21-gold-dark)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "#d8d4cc"; }} />
              </div>
              <FormSpamGuard />
              {submitError && <p style={{ fontSize: "0.82rem", color: "#c0392b", marginTop: "0.25rem" }}>{submitError}</p>}
              <button type="submit" disabled={submitting} className="c21-btn-gold" style={{ width: "100%", justifyContent: "center", marginTop: "0.25rem", opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}>
                <CalendarCheck size={15} /> Request My Free Info Session
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Janeth Contact Modal ─────────────────────────────────────────────────────

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
    if (!form.phone.trim()) e.phone = "Phone number is required.";
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
          phone: form.phone.trim(),
          subject: "License Inquiry via Get Licensed Page",
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
            <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.7 }}>Janeth Vega - Director of Career Development will be in touch with you shortly. We look forward to speaking with you.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <div>
              <h2 id="janeth-modal-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.25rem" }}>Contact Janeth Vega</h2>
              <p style={{ fontSize: "0.82rem", color: "#888" }}>Licensing and new agent inquiries - ext. 421</p>
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
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#666", marginBottom: "0.4rem" }}>Phone *</label>
              <input type="tel" required placeholder="(626) 555-0100" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ ...inputStyle, borderColor: errors.phone ? "#c0392b" : "#d8d4cc" }} />
              {errors.phone && <p style={{ fontSize: "0.78rem", color: "#c0392b", marginTop: "0.3rem" }}>{errors.phone}</p>}
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#666", marginBottom: "0.4rem" }}>Message *</label>
              <textarea rows={4} placeholder="Tell us about yourself and your interest in real estate..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: "vertical", borderColor: errors.message ? "#c0392b" : "#d8d4cc" }} />
              {errors.message && <p style={{ fontSize: "0.78rem", color: "#c0392b", marginTop: "0.3rem" }}>{errors.message}</p>}
            </div>
            <FormSpamGuard />
            {submitError && <p style={{ fontSize: "0.85rem", color: "#c0392b", background: "#fdf2f2", padding: "0.75rem", borderRadius: "2px" }}>{submitError}</p>}
            <button type="submit" disabled={submitting} className="c21-btn-gold" style={{ width: "100%", justifyContent: "center", opacity: submitting ? 0.7 : 1 }}>
              <Mail size={15} /> {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RealEstateSchool() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("get-licensed");

  // Intersection observer to track active section
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const id of SECTIONS.map((s) => s.id)) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div style={{ fontFamily: "'Lato', sans-serif", background: CHARCOAL }}>
        <SiteNav activeTab="Careers" />

        <main id="main-content">
          {/* ── Hero ──────────────────────────────────────────────────────── */}
          <section className="c21-inner-hero">
            <img src={heroImage} alt="Real estate licensing course" className="c21-inner-hero-bg" />
            <div className="c21-inner-hero-overlay" />
            <img
              src={c21SealImageUrl}
              alt="Century 21 Citrus Realty"
              style={{
                position: "absolute",
                top: "1.25rem",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                width: "clamp(64px, 7vw, 96px)",
                height: "auto",
                pointerEvents: "none",
              }}
            />
            <div className="c21-inner-hero-content">
              <h1 className="c21-inner-hero-title">Live Real Estate<br />Licensing Course!</h1>
              <p className="c21-inner-hero-subtitle">
                From earning your California Real Estate Salesperson license to building a successful real estate career, Century 21 Citrus Realty provides the training, tools, resources, and support to guide you every step of the way.
              </p>
              <div className="c21-hero-actions">
                <a href="#info-session" className="c21-btn-gold">Get Licensed</a>
                <a href="tel:19095928500" className="c21-btn-outline-white"><Phone size={15} /> 909.592.8500</a>
              </div>
            </div>
          </section>

          {/* ── Sticky Section Nav ────────────────────────────────────────── */}
          <SectionNav active={activeSection} />

          {/* ── SECTION 4: Free Info Session Form ─────────────────────────── */}
          <InfoSessionForm />

          {/* ── SECTION: Course Pricing ───────────────────────────────────── */}
          <section id="pricing" style={{ background: CHARCOAL_DARK, padding: "5rem 2rem" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.5rem" }}>Course Pricing</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: "var(--c21-gold)", lineHeight: 1.2, marginBottom: "1rem" }}>Choose Your Package</h2>
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>Both packages include all prerequisite courses required by the California Department of Real Estate. Choose the option that fits your needs.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                {/* Standard Package */}
                <div style={{ background: CHARCOAL_LIGHT, border: "1px solid rgba(190,175,136,0.3)", borderRadius: "3px", padding: "2.5rem", borderTop: "4px solid rgba(190,175,136,0.5)" }}>
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>Most Popular</p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>Super Saver Standard Package</h3>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.75rem", fontWeight: 700, color: "var(--c21-gold)", marginBottom: "1.75rem", lineHeight: 1 }}>$199.99</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                    {[
                      "All prerequisite courses mandated by the Department of Real Estate",
                      "Registration fee",
                      "Tuition fee for required pre-licensing courses",
                      "Course workbook materials",
                      "Live class sessions every Thursday 6:00 p.m. to 7:30 p.m.",
                    ].map((item) => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                        <span style={{ color: "var(--c21-gold)", fontWeight: 700, fontSize: "1rem", lineHeight: 1.5, flexShrink: 0 }}>&#10003;</span>
                        <span style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Deluxe Package */}
                <div style={{ background: CHARCOAL_LIGHT, border: "1px solid rgba(190,175,136,0.5)", borderRadius: "3px", padding: "2.5rem", borderTop: "4px solid var(--c21-gold)" }}>
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.5rem" }}></p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>Super Saver Deluxe Package</h3>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.75rem", fontWeight: 700, color: "var(--c21-gold)", marginBottom: "1.75rem", lineHeight: 1 }}>$244.99</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                    {[
                      "All prerequisite courses mandated by the Department of Real Estate",
                      "Registration fee",
                      "Tuition fee for required pre-licensing courses",
                      "Course workbook materials",
                      "Live class sessions every Thursday 6:00 p.m. to 7:30 p.m.",
                      "Course textbooks",
                    ].map((item) => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                        <span style={{ color: "var(--c21-gold)", fontWeight: 700, fontSize: "1rem", lineHeight: 1.5, flexShrink: 0 }}>&#10003;</span>
                        <span style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.4)" }}>Prices subject to change. Contact Janeth Vega - Director of Career Development at 909.592.8500 ext. 421 for current availability and enrollment.</p>
            </div>
          </section>

          {/* ── SECTION 2: Join Century 21 Citrus Realty ─────────────────────────────── */}
          <section id="join-citrus" style={{ background: CHARCOAL, padding: "5rem 2rem" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

              {/* Two-column intro: heading left, copy right */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", marginBottom: "4rem" }}>
                <div>
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.75rem" }}>
                    What We Offer
                  </p>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, color: "var(--c21-gold)", lineHeight: 1.2 }}>
                    Everything You Need to Succeed
                  </h2>
                </div>
                <div>
                  <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.85 }}>
                    We are a personal development company that specializes in Real Estate. So, joining Century 21 Citrus Realty as a new agent means you will never be left to figure things out on your own. Our support system is built to accelerate your growth and give you every tool you need to build a lasting career in real estate.
                  </p>
                </div>
              </div>

              {/* Benefits grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
                {benefits.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      style={{ background: CHARCOAL_LIGHT, border: "1px solid rgba(190,175,136,0.15)", borderRadius: "3px", padding: "2rem", transition: "border-color 0.2s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(190,175,136,0.4)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(190,175,136,0.15)"; }}
                    >
                      <div style={{ width: "44px", height: "44px", background: "rgba(190,175,136,0.15)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                        <Icon size={20} style={{ color: "var(--c21-gold)" }} />
                      </div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--c21-gold)", marginBottom: "0.65rem" }}>{item.title}</h3>
                      <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.75 }}>{item.copy}</p>
                    </div>
                  );
                })}
              </div>


              {/* Testimonials */}
              <div>
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.5rem" }}>Agent Stories</p>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 700, color: "var(--c21-gold)", lineHeight: 1.2 }}>Hear from Our Team</h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
                  {testimonials.map((t) => (
                    <div key={t.name} style={{ background: CHARCOAL_LIGHT, border: "1px solid rgba(190,175,136,0.2)", borderRadius: "3px", overflow: "hidden", borderTop: "3px solid var(--c21-gold)", display: "flex", flexDirection: "column" }}>
                      {t.photo && (
                        <div style={{ width: "50%", maxWidth: "160px", aspectRatio: "4 / 5", overflow: "hidden", flexShrink: 0, margin: "1.5rem auto 0" }}>
                          <img
                            src={t.photo}
                            alt={t.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 32%", display: "block" }}
                          />
                        </div>
                      )}
                      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", flex: 1 }}>
                        <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.85, fontStyle: "italic", marginBottom: "1.5rem", flex: 1 }}>"{t.quote}"</p>
                        <div>
                          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>{t.name}</p>
                          <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--c21-gold)", marginTop: "0.2rem" }}>{t.award}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 3: Licensed Scholarship Program ───────────────────── */}
          <section id="scholarship" style={{ background: CHARCOAL_DARK, padding: "5rem 2rem" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.5rem" }}>Financial Support</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: "var(--c21-gold)", lineHeight: 1.2 }}>Licensed Scholarship Program Available</h2>
              </div>

              {/* Main scholarship card */}
              <div style={{ background: CHARCOAL_LIGHT, border: "1px solid rgba(190,175,136,0.3)", borderRadius: "3px", borderTop: "4px solid var(--c21-gold)", padding: "2.5rem 3rem", marginBottom: "3.5rem", maxWidth: "760px", margin: "0 auto 3.5rem" }}>
                <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.85, marginBottom: "1.5rem" }}>
                  Get your California Real Estate License through Century 21 Citrus Realty using our Licensed Scholarship Fund! Upon closing your 3rd transaction with Century 21 Citrus Realty you will be reimbursed the total class cost.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                  {[
                    { label: "State License Fee", amount: "$450.00" },
                    { label: "Live Scan", amount: "$84.00" },
                    { label: "Required Courses", amount: "$199.99" },
                  ].map((item) => (
                    <div key={item.label} style={{ background: CHARCOAL_DARK, borderRadius: "2px", padding: "1rem 1.25rem", textAlign: "center" }}>
                      <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.35rem" }}>{item.label}</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--c21-gold)" }}>{item.amount}</p>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "2px solid var(--c21-gold)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Total Reimbursement</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "var(--c21-gold)" }}>$733.99</p>
                </div>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginTop: "1rem", fontStyle: "italic" }}>Terms and Conditions Apply. Requires a 1-year signing commitment. Agent must close 3 transactions with our office, within 12 months of getting licensed.</p>
              </div>

              {/* Janeth Contact Card */}
              <div style={{ background: CHARCOAL, borderRadius: "4px", border: "1px solid rgba(190,175,136,0.2)", padding: "3rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.75rem" }}>Scholarship Inquiries</p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>Talk to Janeth Vega - Director of Career Development About the Scholarship Program</h3>
                  <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                    To find out if you qualify for tuition reimbursement or the Licensed Scholarship Program, reach out to Janeth Vega - Director of Career Development directly. She will walk you through the requirements and help you take the next step.
                  </p>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <button type="button" onClick={() => setModalOpen(true)} className="c21-btn-gold" style={{ cursor: "pointer", border: "none" }}><Mail size={15} /> Email Janeth</button>
                    <a href="tel:19095928500" className="c21-btn-outline-white"><Phone size={15} /> 909.592.8500 ext. 421</a>
                  </div>
                </div>
                <div style={{ background: "rgba(190,175,136,0.08)", border: "1px solid rgba(190,175,136,0.25)", borderRadius: "3px", padding: "2rem", minWidth: "220px", textAlign: "center" }}>
                  <div style={{ width: "120px", height: "120px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 1rem", border: "3px solid var(--c21-gold)" }}>
                    <img src={SCHOOL_PORTRAITS.janeth} alt="Janeth Vega" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 32%" }} />
                  </div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginBottom: "0.3rem" }}>Janeth Vega</p>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "1rem" }}>Director of Career Development</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <a href="tel:19095928500" style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.8)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}><Phone size={13} /> 909-592-8500 ext. 421</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 5: FAQ ─────────────────────────────────────────────── */}
          <section id="faq" style={{ background: CHARCOAL, padding: "5rem 2rem" }}>
            <div style={{ maxWidth: "860px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.5rem" }}>Common Questions</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 700, color: "var(--c21-gold)", lineHeight: 1.2 }}>Licensing FAQ</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ borderBottom: "1px solid rgba(190,175,136,0.2)" }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "1rem" }}
                    >
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600, color: "#fff" }}>{faq.q}</span>
                      {openFaq === i
                        ? <ChevronUp size={18} style={{ color: "var(--c21-gold)", flexShrink: 0 }} />
                        : <ChevronDown size={18} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
                      }
                    </button>
                    {openFaq === i && (
                      <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.75, paddingBottom: "1.25rem", paddingRight: "2rem" }}>{faq.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── SECTION 6: Office Map ───────────────────────────────────────── */}
          <section style={{ background: CHARCOAL_DARK, padding: "5rem 2rem" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <div style={{ marginBottom: "2rem" }}>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.5rem" }}>Location</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--c21-gold)", lineHeight: 1.2, marginBottom: "0.5rem" }}>Visit Our Office</h2>
                <div style={{ width: "60px", height: "3px", background: "var(--c21-gold)", marginTop: "0.75rem" }} />
              </div>
              <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(190,175,136,0.25)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                <iframe
                  title="Century 21 Citrus Realty Office"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.5!2d-117.8180!3d34.1080!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c32b1e2e2e2e2f%3A0x0!2s1100+Via+Verde%2C+San+Dimas%2C+CA+91773!5e0!3m2!1sen!2sus!4v1700000000001!5m2!1sen!2sus&q=1100+Via+Verde,+San+Dimas,+CA+91773"
                  width="100%"
                  height="420"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", marginTop: "1rem", textAlign: "center" }}>
                1100 Via Verde, San Dimas, CA 91773
              </p>
            </div>
          </section>

          {/* ── Final CTA ──────────────────────────────────────────────────── */}
          <section style={{ background: CHARCOAL_DARK, padding: "5rem 2rem" }}>
            <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.75rem" }}>Ready to Begin?</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: "var(--c21-gold)", lineHeight: 1.2, marginBottom: "1.25rem" }}>
                We Will Help You Every Step of the Way
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
                Once you pass your exam, contact Janeth Vega - Director of Career Development to schedule an appointment and activate your license.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button type="button" onClick={() => setModalOpen(true)} className="c21-btn-gold" style={{ cursor: "pointer", border: "none" }}><Mail size={15} /> Email Janeth</button>
                <a href="tel:19095928500" className="c21-btn-outline-white"><Phone size={15} /> 909.592.8500 ext. 421</a>
              </div>
            </div>
          </section>
        </main>
      </div>

      {modalOpen && <JanethModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
