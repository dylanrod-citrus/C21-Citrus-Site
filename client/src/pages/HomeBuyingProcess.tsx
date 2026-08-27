/*
  CENTURY 21 CITRUS REALTY - HOME BUYING PROCESS PAGE
  Design: C21 brand-aligned luxury real estate portal
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
  Rule: Never write "Century 21" in visible copy - always use the logo image
*/
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  FileSignature,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
  UsersRound,
} from "lucide-react";
import SiteNav from "../components/SiteNav";

const logoUrl = "/manus-storage/century21-citrus-realty-gold-logo_f3913815.png";
const heroImage = "/manus-storage/hero-luxury-home_04c4fbf5.jpg";
const communityImage = "/manus-storage/hero-neighborhood_4a38234b.jpg";

const idxSearchUrl = "https://c21citrus.com/search/";
const officeListingsUrl = "/our-listings";
const valuationUrl = "https://cloudattract.com/7442b3";
const sellingProcessUrl = "/home-selling-process";
const contactUrl = "/contact";
const phoneUrl = "tel:19095928500";
const emailUrl = "mailto:oj@c21citrus.com";

const journeySections = [
  {
    id: "ready",
    number: "01",
    kicker: "Ready to buy",
    title: "Start with a clear plan before the first showing.",
    copy: "A strong purchase begins before you walk through a front door. Century 21 Citrus Realty helps you clarify timing, budget comfort, must-haves, and the people who need to be involved so your search feels organized instead of reactive.",
    points: ["Define your move timeline", "Separate needs from wants", "Discuss down payment and closing-cost expectations"],
    icon: CalendarCheck,
  },
  {
    id: "fit",
    number: "02",
    kicker: "Your home fit",
    title: "Match lifestyle, location, and affordability.",
    copy: "The right home is not only a price point. It also has to work for commute patterns, school or community priorities, future resale, maintenance comfort, and the way you actually live day to day in Southern California.",
    points: ["Compare property styles and neighborhoods", "Review monthly-payment comfort", "Plan for insurance, taxes, HOA dues, and upkeep"],
    icon: Compass,
  },
  {
    id: "search",
    number: "03",
    kicker: "MLS search",
    title: "Shop with live inventory and local interpretation.",
    copy: "Online search is useful, but local guidance helps turn listings into practical choices. Your agent can help flag pricing signals, neighborhood context, showing strategy, and homes that may require faster decisions.",
    points: ["Use MLS search and office listings", "Tour homes with a short-list mindset", "Watch days on market, disclosures, condition, and comparables"],
    icon: Search,
  },
  {
    id: "offer",
    number: "04",
    kicker: "Offer strategy",
    title: "Write an offer that fits both the home and your risk tolerance.",
    copy: "When a home is the right match, your offer should balance competitiveness with protection. Century 21 Citrus Realty can help you review price, deposits, contingencies, timelines, seller expectations, and negotiation options.",
    points: ["Discuss offer price and terms", "Review contingencies and deposits", "Prepare for counteroffers or multiple-offer situations"],
    icon: FileSignature,
  },
  {
    id: "escrow",
    number: "05",
    kicker: "Escrow to closing",
    title: "Move through mortgage, inspections, paperwork, and keys.",
    copy: "After acceptance, the process becomes a coordinated checklist. Financing, inspections, appraisal, disclosures, insurance, final walkthrough, and closing documents all need steady follow-up and clear communication.",
    points: ["Complete lender and escrow milestones", "Review inspection findings and repair options", "Prepare for signing, funding, recording, and move-in"],
    icon: ClipboardCheck,
  },
];

const buyerSituations = [
  { title: "Already own a home?", copy: "Coordinate sale timing, equity expectations, temporary housing, and whether buying before selling is realistic for your household.", icon: TrendingUp },
  { title: "Still narrowing the right move?", copy: "If timing is not right for an immediate purchase, use a planning conversation to organize budget, area priorities, and the next step that fits your household.", icon: MapPin },
  { title: "Buying all cash?", copy: "Cash can simplify financing timelines, but inspections, title, disclosures, insurance, and closing details still deserve careful review.", icon: BadgeDollarSign },
  { title: "Relocating within Southern California?", copy: "Compare commute, schools, daily amenities, neighborhood rhythm, and future resale considerations before narrowing your search area.", icon: Truck },
];

const closingChecklist = [
  "Pre-approval or proof of funds",
  "Priority list for home, area, and budget",
  "MLS search and showing plan",
  "Offer package and negotiation strategy",
  "Inspection, disclosure, and appraisal review",
  "Insurance, escrow, signing, and moving timeline",
];

export default function HomeBuyingProcess() {
  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }}>
      <SiteNav activeTab="Buy" />

      <main id="main-content">
        {/* Hero */}
        <section className="c21-inner-hero">
          <img src={heroImage} alt="Luxury Southern California home" className="c21-inner-hero-bg" />
          <div className="c21-inner-hero-overlay" />
          <div className="c21-inner-hero-content">
            <a href="/" className="c21-inner-back-link"><ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Back to Home</a>
            <h1 className="c21-inner-hero-title">Buy with a Clearer Path<br />from Search to Keys</h1>
            <p className="c21-inner-hero-subtitle">
              This guide turns the buying journey into practical steps, prepare your budget, focus your search, write with confidence, move through escrow, and plan the first days in your new home.
            </p>
            <div className="c21-hero-actions">
              <a href="/contact" className="c21-btn-outline-white"><UsersRound size={15} /> Talk with the Office</a>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="c21-process-overview">
          <div className="c21-process-overview-inner">
            <div className="c21-process-toc">
              <p style={{ fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold-dark)", marginBottom: "1rem" }}>Buyer Roadmap</p>
              {journeySections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="c21-toc-link">{s.number}. {s.kicker}</a>
              ))}
            </div>
            <div className="c21-process-intro-card">
              <p className="c21-section-eyebrow">Local Buyer Guidance</p>
              <h2 className="c21-section-title" style={{ fontSize: "1.75rem" }}>A process built around practical decisions, not guesswork.</h2>
              <p style={{ color: "#555", lineHeight: 1.7 }}>
                Most buyers ask the same practical questions: when to begin, how much to spend, where to search, how to make an offer, what happens in escrow, and how to prepare for moving. Century 21 Citrus Realty keeps those decisions organized for Southern California buyers.
              </p>
              <div className="c21-trust-row">
                <span><ShieldCheck size={14} /> Agency guidance</span>
                <span><Star size={14} /> MLS-first search</span>
                <span><Sparkles size={14} /> Clear next steps</span>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Steps */}
        <section className="c21-process-steps-section">
          {journeySections.map((section) => {
            const Icon = section.icon;
            return (
              <article id={section.id} key={section.id} className="c21-process-step">
                <div className="c21-process-step-number">{section.number}</div>
                <div className="c21-process-step-body">
                  <div className="c21-process-step-icon"><Icon size={22} /></div>
                  <p className="c21-section-eyebrow">{section.kicker}</p>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--c21-black)" }}>{section.title}</h2>
                  <p style={{ color: "#555", lineHeight: 1.7, marginBottom: "1.25rem" }}>{section.copy}</p>
                  <div className="c21-step-points">
                    {section.points.map((point) => (
                      <span key={point}><CheckCircle2 size={14} /> {point}</span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Situations */}
        <section className="c21-situations-section">
          <div className="c21-situations-inner">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p className="c21-section-eyebrow" style={{ justifyContent: "center" }}>Special Situations</p>
              <h2 className="c21-section-title">Not every buyer starts from the same place.</h2>
              <p className="c21-section-subtitle" style={{ margin: "0 auto" }}>Whether you already own a home, are still narrowing timing, are buying with cash, or are relocating into a new area, the right plan should fit your actual timing and risk comfort.</p>
            </div>
            <div className="c21-situations-grid">
              {buyerSituations.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="c21-situation-card">
                    <div className="c21-situation-icon"><Icon size={20} /></div>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="c21-checklist-section">
          <div className="c21-checklist-inner">
            <div className="c21-checklist-copy">
              <p className="c21-section-eyebrow">Timeline &amp; Paperwork</p>
              <h2 className="c21-section-title" style={{ fontSize: "1.75rem" }}>Keep the checklist visible through closing.</h2>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                Buying a home has moving parts, but the path is easier to manage when each milestone is visible. Use this list as a starting point for your first conversation with Century 21 Citrus Realty.
              </p>
            </div>
            <div className="c21-checklist-items">
              {closingChecklist.map((item) => (
                <span key={item} className="c21-checklist-item"><CheckCircle2 size={14} /> {item}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Proof */}
        <section className="c21-proof-section">
          <div className="c21-proof-inner">
            <div className="c21-proof-image">
              <img src={communityImage} alt="Southern California neighborhood" />
            </div>
            <div className="c21-proof-copy">
              <p className="c21-section-eyebrow">Beyond Closing</p>
              <h2 className="c21-section-title" style={{ fontSize: "1.75rem" }}>The move does not end at the signature.</h2>
              <blockquote className="c21-proof-quote">
                "A good buying process should leave you informed, protected, and ready for the first week in your new home."
              </blockquote>
              <div className="c21-proof-actions">
                <a href={idxSearchUrl} className="c21-btn-gold"><Search size={14} /> Search Homes</a>
                <a href={contactUrl} className="c21-btn-outline-dark"><Mail size={14} /> Ask a Question</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="c21-cta-section">
          <div className="c21-cta-inner">
            <div className="c21-cta-text">
              <h2>Ready to Start Your Home Search?</h2>
              <p>Open the MLS, review office listings, or contact Century 21 Citrus Realty for a grounded buyer consultation.</p>
            </div>
            <div className="c21-cta-actions">
              <a href={idxSearchUrl} className="c21-btn-black"><Search size={15} /> MLS Search</a>
              <a href={contactUrl} className="c21-btn-outline-black"><Phone size={15} /> Contact Us</a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
}
