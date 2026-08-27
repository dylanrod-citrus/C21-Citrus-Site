/*
  CENTURY 21 CITRUS REALTY - HOME SELLING PROCESS PAGE
  Design: C21 brand-aligned luxury real estate portal
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
  Rule: Never write "Century 21" in visible copy - always use the logo image
*/
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarCheck,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  FileSignature,
  Home as HomeIcon,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
  UsersRound,
  Wrench,
} from "lucide-react";
import SiteNav from "../components/SiteNav";

const logoUrl = "/manus-storage/century21-citrus-realty-gold-logo_f3913815.png";
const heroImage = "/manus-storage/hero-luxury-interior_f79432c6.jpg";
const communityImage = "/manus-storage/hero-neighborhood_4a38234b.jpg";

const idxSearchUrl = "https://c21citrus.com/search/";
const officeListingsUrl = "/our-listings";
const valuationUrl = "https://cloudattract.com/7442b3";
const contactUrl = "/contact";
const buyingProcessUrl = "/home-buying-process";
const sellingProcessUrl = "/home-selling-process";
const phoneUrl = "tel:19095928500";
const emailUrl = "mailto:oj@c21citrus.com";

const journeySections = [
  {
    id: "value",
    number: "01",
    kicker: "Know your value",
    title: "Start with a realistic picture of your home's market position.",
    copy: "Pricing is the most important decision in any sale. Century 21 Citrus Realty reviews comparable sales, current inventory, condition, and your timeline to help you set a price that attracts serious buyers without leaving equity on the table.",
    points: ["Review recent comparable sales", "Assess condition and upgrades", "Align price with your timing goals"],
    icon: BadgeDollarSign,
  },
  {
    id: "prepare",
    number: "02",
    kicker: "Prepare the home",
    title: "Present your home at its best before the first showing.",
    copy: "First impressions drive offers. Strategic preparation, decluttering, repairs, staging, and professional photography helps buyers connect emotionally with the property and supports your asking price.",
    points: ["Address deferred maintenance and repairs", "Stage for buyer appeal", "Schedule professional photography"],
    icon: Wrench,
  },
  {
    id: "market",
    number: "03",
    kicker: "Market broadly",
    title: "Reach buyers through every relevant channel.",
    copy: "Effective marketing combines MLS exposure, digital advertising, social media, email outreach, and open house strategy. Century 21 Citrus Realty coordinates each channel to maximize visibility during the critical first weeks on market.",
    points: ["MLS listing with professional photos", "Digital and social media advertising", "Open house and broker tour coordination"],
    icon: Megaphone,
  },
  {
    id: "offers",
    number: "04",
    kicker: "Review offers",
    title: "Evaluate every offer on price, terms, and buyer strength.",
    copy: "The highest offer is not always the best offer. Century 21 Citrus Realty helps you compare price, contingencies, financing strength, closing timeline, and seller-favorable terms so you can accept with confidence.",
    points: ["Compare net proceeds across offers", "Evaluate contingencies and buyer qualifications", "Negotiate repairs, credits, and closing timelines"],
    icon: FileSignature,
  },
  {
    id: "close",
    number: "05",
    kicker: "Close and move",
    title: "Navigate escrow, inspections, and the final transfer.",
    copy: "Once an offer is accepted, the focus shifts to escrow management, buyer inspections, appraisal, title, disclosures, and final walkthrough. Century 21 Citrus Realty keeps the process on track through signing, funding, and recording.",
    points: ["Manage buyer inspection and appraisal process", "Complete disclosure and title requirements", "Coordinate signing, funding, and move-out"],
    icon: ClipboardCheck,
  },
];

const sellerSituations = [
  { title: "Selling before buying?", copy: "Coordinate equity timing, contingency offers, and temporary housing so you are not caught between two transactions.", icon: TrendingUp },
  { title: "Inherited or estate property?", copy: "Estate sales have unique title, probate, and timing considerations. Century 21 Citrus Realty can help navigate the process with appropriate professionals.", icon: HomeIcon },
  { title: "Investment or rental property?", copy: "Tenant coordination, 1031 exchange timing, and investor buyer targeting all require a different approach than owner-occupied sales.", icon: BadgeDollarSign },
  { title: "Relocating out of Southern California?", copy: "Timing your sale around a distant move requires careful coordination of closing dates, moving logistics, and buyer negotiation.", icon: Truck },
];

const sellerChecklist = [
  "Home valuation and pricing strategy",
  "Pre-listing repairs and staging plan",
  "Professional photography and marketing launch",
  "Offer review and negotiation",
  "Disclosure package and escrow opening",
  "Inspection, appraisal, and closing coordination",
];

export default function HomeSellingProcess() {
  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }}>
      <SiteNav activeTab="Sell" />

      <main id="main-content">
        {/* Hero */}
        <section className="c21-inner-hero">
          <img src={heroImage} alt="Luxury Southern California home interior" className="c21-inner-hero-bg" />
          <div className="c21-inner-hero-overlay" />
          <div className="c21-inner-hero-content">
            <a href="/" className="c21-inner-back-link"><ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Back to Home</a>
            <h1 className="c21-inner-hero-title">Sell with Confidence<br />from Pricing to Closing</h1>
            <p className="c21-inner-hero-subtitle">
              This guide walks you through the selling journey. Value your home accurately, prepare it for market, attract qualified buyers, and close with clarity.
            </p>
            <div className="c21-hero-actions">
              <a href={valuationUrl} className="c21-btn-gold"><HomeIcon size={15} /> Get Home Value</a>
              <a href="/contact" className="c21-btn-outline-white"><UsersRound size={15} /> Talk with the Office</a>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="c21-process-overview">
          <div className="c21-process-overview-inner">
            <div className="c21-process-toc">
              <p style={{ fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold-dark)", marginBottom: "1rem" }}>Seller Roadmap</p>
              {journeySections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="c21-toc-link">{s.number}. {s.kicker}</a>
              ))}
            </div>
            <div className="c21-process-intro-card">
              <p className="c21-section-eyebrow">Local Seller Guidance</p>
              <h2 className="c21-section-title" style={{ fontSize: "1.75rem" }}>A selling process built around your goals, not a generic timeline.</h2>
              <p style={{ color: "#555", lineHeight: 1.7 }}>
                Most sellers ask the same questions: what is my home worth, how do I prepare it, how long will it take, and how do I handle offers? Century 21 Citrus Realty keeps those decisions organized for Southern California sellers.
              </p>
              <div className="c21-trust-row">
                <span><ShieldCheck size={14} /> Honest pricing</span>
                <span><Camera size={14} /> Professional marketing</span>
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
              <h2 className="c21-section-title">Not every seller starts from the same place.</h2>
              <p className="c21-section-subtitle" style={{ margin: "0 auto" }}>Whether you are selling before buying, handling an estate, managing an investment property, or relocating, the right plan should fit your actual situation.</p>
            </div>
            <div className="c21-situations-grid">
              {sellerSituations.map((item) => {
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
              <p className="c21-section-eyebrow">Seller Checklist</p>
              <h2 className="c21-section-title" style={{ fontSize: "1.75rem" }}>Keep the process visible from listing to closing.</h2>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                Selling a home has many moving parts, but the path is easier to manage when each milestone is visible. Use this list as a starting point for your first conversation with Century 21 Citrus Realty.
              </p>
            </div>
            <div className="c21-checklist-items">
              {sellerChecklist.map((item) => (
                <span key={item} className="c21-checklist-item"><Star size={14} /> {item}</span>
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
              <h2 className="c21-section-title" style={{ fontSize: "1.75rem" }}>A successful sale is one you feel good about long after closing day.</h2>
              <blockquote className="c21-proof-quote">
                "A good selling process should leave you confident in your price, protected by your terms, and ready for the next chapter."
              </blockquote>
              <div className="c21-proof-actions">
                <a href={valuationUrl} className="c21-btn-gold"><HomeIcon size={14} /> Get Home Value</a>
                <a href={contactUrl} className="c21-btn-outline-dark"><Mail size={14} /> Ask a Question</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="c21-cta-section">
          <div className="c21-cta-inner">
            <div className="c21-cta-text">
              <h2>Ready to List Your Home?</h2>
              <p>Get a home valuation, review the selling process, or contact Century 21 Citrus Realty for a seller consultation.</p>
            </div>
            <div className="c21-cta-actions">
              <a href={valuationUrl} className="c21-btn-black"><HomeIcon size={15} /> Home Valuation</a>
              <a href={contactUrl} className="c21-btn-outline-black"><Phone size={15} /> Contact Us</a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
}
