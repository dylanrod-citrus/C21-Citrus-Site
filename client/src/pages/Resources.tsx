/*
  C21 Century 21 Citrus Realty - Resources Page
  Design: Mediterranean Luxury - Warm Ivory + C21 Gold + Near-Black
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
  Rule: Never write "Century 21" in visible copy - always use the logo image
*/
import SiteNav from "@/components/SiteNav";
import {
  BookOpen,
  Home,
  TrendingUp,
  DollarSign,
  ClipboardList,
  Key,
  Search,
  FileText,
  BarChart2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Phone,
  Mail,
} from "lucide-react";
import { useState } from "react";

const heroImage =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=85";

const contactUrl = "/contact";
const phoneUrl = "tel:19095928500";
const emailUrl = "mailto:oj@c21citrus.com";

// ─── Neighborhoods ──────────────────────────────────────────────────────────
const neighborhoods: {
  city: string;
  county: string;
  image: string;
  description: string;
  stats: { label: string; value: string }[];
  tags: string[];
}[] = [
  {
    city: "San Dimas",
    county: "Los Angeles County",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    description:
      "A charming foothill community with a small-town feel, easy freeway access, and a welcoming atmosphere. San Dimas blends suburban comfort with outdoor recreation - Bonelli Regional Park and Raging Waters are right in the backyard.",
    stats: [
      { label: "Median Home Price", value: "~$780K" },
      { label: "Avg. Days on Market", value: "18 days" },
      { label: "Population", value: "34,000" },
    ],
    tags: ["Outdoor Recreation", "Foothill Living", "Freeway Access", "Historic Downtown"],
  },
  {
    city: "Glendora",
    county: "Los Angeles County",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    description:
      "Known as the 'Pride of the Foothills,' Glendora offers tree-lined streets, a vibrant downtown village, and stunning mountain views. A well-established community with a strong local identity and proximity to the San Gabriel Mountains.",
    stats: [
      { label: "Median Home Price", value: "~$830K" },
      { label: "Avg. Days on Market", value: "15 days" },
      { label: "Population", value: "52,000" },
    ],
    tags: ["Downtown Village", "Mountain Views", "Tree-Lined Streets", "Established Community"],
  },
  {
    city: "La Verne",
    county: "Los Angeles County",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    description:
      "A quiet, upscale community nestled between the foothills and the 210 freeway. La Verne is home to the University of La Verne, a walkable Old Town district, and some of the most sought-after residential streets in the San Gabriel Valley.",
    stats: [
      { label: "Median Home Price", value: "~$860K" },
      { label: "Avg. Days on Market", value: "20 days" },
      { label: "Population", value: "33,000" },
    ],
    tags: ["University Town", "Old Town District", "Quiet Streets", "Strong Community"],
  },
  {
    city: "Claremont",
    county: "Los Angeles County",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    description:
      "Home to the Claremont Colleges consortium, Claremont is a culturally rich, walkable city with a thriving arts scene, independent bookshops, and a nationally recognized tree canopy.",
    stats: [
      { label: "Median Home Price", value: "~$950K" },
      { label: "Avg. Days on Market", value: "22 days" },
      { label: "Population", value: "37,000" },
    ],
    tags: ["College Town", "Arts & Culture", "Walkable Village", "Historic Architecture"],
  },
];

// ─── Buyer Guides ────────────────────────────────────────────────────────────
const buyerGuides = [
  {
    icon: Search,
    title: "Step 1 - Get Pre-Approved",
    summary:
      "Before you start touring homes, getting pre-approved for a mortgage gives you a clear budget and shows sellers you're a serious buyer.",
    body: [
      "Contact a lender to review your credit score, income, and debt-to-income ratio.",
      "Gather documents: W-2s, pay stubs, bank statements, and tax returns for the past two years.",
      "Understand the difference between pre-qualification (informal estimate) and pre-approval (verified commitment).",
      "A pre-approval letter is typically valid for 60-90 days. Time your home search accordingly.",
      "Shopping multiple lenders can save thousands - compare APR, not just interest rates.",
    ],
  },
  {
    icon: Home,
    title: "Step 2 - Define Your Must-Haves",
    summary:
      "Knowing your priorities before you start searching saves time and helps your agent find the right match faster.",
    body: [
      "Separate 'must-haves' (bedrooms, commute distance, school district) from 'nice-to-haves' (pool, updated kitchen).",
      "Research neighborhoods: visit at different times of day and check walkability, noise, and proximity to amenities.",
      "Consider future needs - a growing family, remote work, or aging-in-place requirements.",
      "Set a realistic price ceiling that accounts for property taxes, HOA fees, and maintenance costs beyond the mortgage.",
    ],
  },
  {
    icon: ClipboardList,
    title: "Step 3 - Make a Competitive Offer",
    summary:
      "In Southern California's competitive market, a well-structured offer can make the difference between winning and losing a home.",
    body: [
      "Your agent will pull comparable sales (comps) to help you price your offer strategically.",
      "Earnest money (typically 1-3% of purchase price) demonstrates good faith and is applied to your down payment at closing.",
      "Contingencies protect you - inspection, appraisal, and financing contingencies are standard. In hot markets, buyers sometimes waive them, but understand the risk.",
      "Escalation clauses automatically increase your offer up to a cap if competing bids come in.",
      "A personal letter to the seller can sometimes tip the scales, though some sellers prefer to keep it purely financial.",
    ],
  },
  {
    icon: FileText,
    title: "Step 4 - Navigate Escrow & Closing",
    summary:
      "Once your offer is accepted, the escrow process begins. Here's what to expect over the next 30-45 days.",
    body: [
      "Escrow is a neutral third party that holds funds and documents until all conditions are met.",
      "Order a home inspection within the first 10-17 days. This is your opportunity to negotiate repairs or credits.",
      "The lender will order an appraisal to confirm the home's value supports the loan amount.",
      "Review the title report for any liens, easements, or encumbrances on the property.",
      "Final walk-through (typically 24-48 hours before closing) confirms the property is in the agreed condition.",
      "Closing costs typically range from 2-5% of the loan amount and include lender fees, title insurance, and escrow fees.",
    ],
  },
];

// ─── Seller Guides ───────────────────────────────────────────────────────────
const sellerGuides = [
  {
    icon: TrendingUp,
    title: "Step 1 - Price It Right",
    summary:
      "Pricing is the single most important factor in how quickly your home sells and how much you net. Overpricing leads to stagnation; underpricing leaves money on the table.",
    body: [
      "Your agent will prepare a Comparative Market Analysis (CMA) using recent sales of similar homes within a half-mile radius.",
      "List price should reflect current market conditions - not what you paid, what you need, or what Zillow estimates.",
      "Homes priced correctly from day one generate the most activity in the critical first two weeks.",
      "Price reductions signal to buyers that something is wrong. It's better to price accurately upfront.",
    ],
  },
  {
    icon: Home,
    title: "Step 2 - Prepare & Stage",
    summary:
      "First impressions are formed in seconds - online and in person. Strategic preparation maximizes perceived value.",
    body: [
      "Declutter ruthlessly. Buyers need to visualize their belongings in the space, not yours.",
      "Deep clean every surface, including windows, grout, and appliances.",
      "Address deferred maintenance: leaky faucets, cracked tiles, burned-out bulbs, and scuffed walls.",
      "Professional staging increases sale price by an average of 1-5% and reduces days on market.",
      "Curb appeal matters enormously - fresh mulch, trimmed hedges, and a clean front door set the tone.",
      "Professional photography (and video/3D tours) is non-negotiable in today's market.",
    ],
  },
  {
    icon: DollarSign,
    title: "Step 3 - Review Offers Strategically",
    summary:
      "Multiple offers can be exciting, but the highest price isn't always the best offer. Here's how to evaluate them.",
    body: [
      "Net proceeds matter more than gross price - factor in closing cost credits, repairs, and concessions.",
      "Fewer contingencies generally mean less risk of the deal falling through.",
      "Cash offers close faster and eliminate appraisal risk, which can justify accepting a slightly lower price.",
      "Closing timeline flexibility can be valuable - a leaseback or extended escrow might suit your moving plans.",
      "Your agent can issue a 'highest and best' call if multiple competitive offers arrive simultaneously.",
    ],
  },
  {
    icon: Key,
    title: "Step 4 - Close Smoothly",
    summary:
      "After accepting an offer, your job is to keep the transaction on track through inspections, appraisal, and closing.",
    body: [
      "Respond promptly to buyer inspection requests - delays can create anxiety and derail deals.",
      "Disclose everything required by California law. Non-disclosure is a leading cause of post-closing litigation.",
      "Keep the property in the same condition as when it was shown - don't remove fixtures or make changes.",
      "Coordinate your move-out date with the closing date to avoid double-carrying costs.",
      "Review the settlement statement (ALTA/HUD-1) carefully before signing - errors do occur.",
    ],
  },
];

// ─── Market Resources ────────────────────────────────────────────────────────
const marketResources = [
  {
    icon: BarChart2,
    title: "San Gabriel Valley Market Trends",
    description:
      "Median sale prices, days on market, and inventory levels across San Dimas, Glendora, La Verne, and surrounding cities - updated monthly.",
    link: contactUrl,
    linkLabel: "Request a Market Report",
  },
  {
    icon: DollarSign,
    title: "Mortgage Calculator",
    description:
      "Estimate your monthly payment based on purchase price, down payment, interest rate, and loan term. Factor in taxes and insurance for a complete picture.",
    link: "https://www.bankrate.com/mortgages/mortgage-calculator/",
    linkLabel: "Open Calculator",
    external: true,
  },
  {
    icon: Home,
    title: "What's My Home Worth?",
    description:
      "Get a professional valuation based on current comparable sales - not an algorithm. Our agents provide accurate, data-driven estimates at no cost.",
    link: "https://cloudattract.com/7442b3",
    linkLabel: "Get My Home Value",
  },
  {
    icon: FileText,
    title: "California Disclosure Requirements",
    description:
      "California has some of the most comprehensive disclosure laws in the country. Understand what sellers must disclose and what buyers should ask for.",
    link: contactUrl,
    linkLabel: "Talk to an Agent",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "How long does it take to buy a home in California?",
    a: "From accepted offer to closing, a standard California escrow takes 30-45 days. Cash transactions can close in as few as 7-14 days. The pre-approval and home search phase varies widely, some buyers find their home in weeks, others take several months.",
  },
  {
    q: "What is the typical down payment in Southern California?",
    a: "Conventional loans typically require 5-20% down. FHA loans allow as little as 3.5% with a credit score of 580+. VA loans (for eligible veterans) and USDA loans offer 0% down options. Many first-time buyer programs in California offer down payment assistance - ask your agent about CalHFA and local programs.",
  },
  {
    q: "How is the commission structured when selling?",
    a: "In California, commission is negotiable and paid by the seller at closing. Following the 2024 NAR settlement, buyer's agent compensation is now negotiated separately and disclosed upfront. Your listing agent will explain the full structure before you sign any agreement.",
  },
  {
    q: "Should I sell before I buy, or buy before I sell?",
    a: "This depends on your financial position and market conditions. Selling first eliminates contingency risk but may require temporary housing. Buying first is more convenient but requires carrying two mortgages temporarily or using a bridge loan. A contingent offer (purchase contingent on your home selling) is a middle ground, though sellers in hot markets may be reluctant to accept one.",
  },
  {
    q: "What is Prop 19 and how does it affect me?",
    a: "California Proposition 19 (effective 2021) allows homeowners 55+, severely disabled, or victims of natural disasters to transfer their property tax base to a replacement home anywhere in California. It also changed the rules for inheriting property - children who inherit a parent's home must use it as their primary residence to retain the low tax base. Consult a tax professional for your specific situation.",
  },
  {
    q: "Do I need a home inspection even if the home is new?",
    a: "Yes. New construction homes can have defects too, improper grading, plumbing issues, or code violations that slipped through builder inspections. A third-party inspector provides an unbiased assessment and gives you leverage to request corrections before closing.",
  },
];

export default function Resources() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"buyer" | "seller">("buyer");

  return (
    <div style={{ fontFamily: "'Lato', sans-serif", background: "var(--c21-off-white)" }}>
      <SiteNav activeTab="Resources" />

      <main id="main-content">
        {/* Hero */}
        <section className="c21-inner-hero">
          <img src={heroImage} alt="Southern California neighborhood" className="c21-inner-hero-bg" />
          <div className="c21-inner-hero-overlay" />
          <div className="c21-inner-hero-content">
            <h1 className="c21-inner-hero-title">Buyer & Seller Resources</h1>
            <p className="c21-inner-hero-subtitle">
              Step-by-step guides, market insights, and expert answers to help you navigate every stage of your real estate journey with confidence.
            </p>
            <div className="c21-hero-actions">
              <a href={contactUrl} className="c21-btn-gold"><Phone size={15} /> Talk to an Agent</a>
              <a href="/our-listings" className="c21-btn-outline-white"><Search size={15} /> Browse Listings</a>
            </div>
          </div>
        </section>

        {/* Tab Switcher */}
        <section style={{ background: "#fff", borderBottom: "1px solid #e8e4dc", position: "sticky", top: "72px", zIndex: 40 }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem", display: "flex", gap: 0 }}>
            {(["buyer", "seller"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "1rem 2rem",
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === tab ? "3px solid var(--c21-gold)" : "3px solid transparent",
                  color: activeTab === tab ? "var(--c21-black)" : "#888",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {tab === "buyer" ? "Buyer Guides" : "Seller Guides"}
              </button>
            ))}
          </div>
        </section>

        {/* Guides Section */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold-dark)", marginBottom: "0.5rem" }}>
              {activeTab === "buyer" ? "Home Buying" : "Home Selling"} - Step by Step
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--c21-black)", lineHeight: 1.2 }}>
              {activeTab === "buyer" ? "Your Complete Buyer's Guide" : "Your Complete Seller's Guide"}
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {(activeTab === "buyer" ? buyerGuides : sellerGuides).map((guide, i) => {
              const Icon = guide.icon;
              return (
                <details
                  key={i}
                  style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: "3px", overflow: "hidden" }}
                >
                  <summary
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.25rem",
                      padding: "1.5rem 1.75rem",
                      cursor: "pointer",
                      listStyle: "none",
                      userSelect: "none",
                    }}
                  >
                    <div style={{ background: "var(--c21-gold)", borderRadius: "2px", width: "2.5rem", height: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={16} color="#121212" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.25rem" }}>{guide.title}</h3>
                      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.88rem", color: "#666", lineHeight: 1.5 }}>{guide.summary}</p>
                    </div>
                    <ChevronDown size={18} style={{ color: "#aaa", flexShrink: 0 }} />
                  </summary>
                  <div style={{ padding: "0 1.75rem 1.75rem 4.5rem", borderTop: "1px solid #f0ece4" }}>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {guide.body.map((point, j) => (
                        <li key={j} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                          <span style={{ color: "var(--c21-gold-dark)", fontWeight: 700, flexShrink: 0, marginTop: "0.1rem" }}>-</span>
                          <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", color: "#444", lineHeight: 1.65 }}>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        {/* Market Resources */}
        <section style={{ background: "var(--c21-black)", padding: "5rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
            <div style={{ marginBottom: "3rem" }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold)", marginBottom: "0.5rem" }}>Tools & Data</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Market Resources</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {marketResources.map((res, i) => {
                const Icon = res.icon;
                return (
                  <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(190,175,136,0.2)", borderRadius: "3px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <Icon size={18} color="var(--c21-gold)" />
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{res.title}</h3>
                    </div>
                    <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, flex: 1 }}>{res.description}</p>
                    <a
                      href={res.link}
                      target={res.external ? "_blank" : undefined}
                      rel={res.external ? "noopener noreferrer" : undefined}
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--c21-gold)", textDecoration: "none" }}
                    >
                      {res.linkLabel} <ArrowRight size={13} />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ maxWidth: "860px", margin: "0 auto", padding: "5rem 2rem" }}>
          <div style={{ marginBottom: "3rem", textAlign: "center" }}>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold-dark)", marginBottom: "0.5rem" }}>Common Questions</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--c21-black)", lineHeight: 1.2 }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: "3px", overflow: "hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "1.25rem 1.5rem", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <HelpCircle size={15} style={{ color: "var(--c21-gold-dark)", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "var(--c21-black)", lineHeight: 1.4 }}>{faq.q}</span>
                  </div>
                  {openFaq === i
                    ? <ChevronUp size={16} style={{ color: "#aaa", flexShrink: 0 }} />
                    : <ChevronDown size={16} style={{ color: "#aaa", flexShrink: 0 }} />
                  }
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 1.5rem 1.25rem 3rem", borderTop: "1px solid #f0ece4" }}>
                    <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", color: "#555", lineHeight: 1.75, marginTop: "1rem" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Neighborhood Guides */}
        <section style={{ background: "var(--c21-off-white)", padding: "5rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
            <div style={{ marginBottom: "3rem" }}>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c21-gold-dark)", marginBottom: "0.5rem" }}>Where to Live</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--c21-black)", lineHeight: 1.2, marginBottom: "0.75rem" }}>Neighborhood Guides</h2>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.95rem", color: "#666", maxWidth: "600px", lineHeight: 1.7 }}>Each community in the San Gabriel Valley has its own character, price range, and lifestyle. Here's what to know before you start your search.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {neighborhoods.map((n, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: "3px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                    <img src={n.image} alt={n.city} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }} />
                    <div style={{ position: "absolute", bottom: "1rem", left: "1rem" }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff", margin: 0 }}>{n.city}</h3>
                      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", margin: 0 }}>{n.county}</p>
                    </div>
                  </div>
                  <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", color: "#555", lineHeight: 1.7, margin: 0 }}>{n.description}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                      {n.stats.map((stat, j) => (
                        <div key={j} style={{ background: "var(--c21-off-white)", borderRadius: "2px", padding: "0.6rem 0.75rem" }}>
                          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", marginBottom: "0.2rem" }}>{stat.label}</div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "var(--c21-black)" }}>{stat.value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: "1px solid #f0ece4", paddingTop: "0.75rem" }}>
                      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>Known For</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {n.tags.map((tag, j) => (
                          <span key={j} style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", padding: "0.25rem 0.6rem", background: "rgba(190,175,136,0.12)", color: "var(--c21-gold-dark)", borderRadius: "2px", fontWeight: 600 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={`/our-listings`}
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--c21-gold-dark)", textDecoration: "none", marginTop: "auto" }}
                    >
                      View {n.city} Listings <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="c21-cta-section">
          <div className="c21-cta-inner">
            <div className="c21-cta-text">
              <h2>Still Have Questions?</h2>
              <p>Our agents are here to walk you through every step - whether you're buying your first home or selling a long-held investment. Reach out for a no-obligation consultation.</p>
            </div>
            <div className="c21-cta-actions">
              <a href={phoneUrl} className="c21-btn-gold"><Phone size={15} /> Call the Office</a>
              <a href={emailUrl} className="c21-btn-outline-white"><Mail size={15} /> Send an Email</a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
}
