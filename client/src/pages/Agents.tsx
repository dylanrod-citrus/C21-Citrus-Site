/*
  CENTURY 21 CITRUS REALTY - AGENTS PAGE
  Design: C21 brand-aligned luxury real estate portal
  Colors: C21 Gold #BEAF88, Near-Black #121212, White #FFFFFF, Off-White #F7F6F3
  Typography: Playfair Display (headings) + Lato (body)
  Rule: Never write "Century 21" in visible copy - always use the logo image
  Data: Live from Anywhere MDM API via /api/mdm/agents
*/
import { Mail, MapPin, Phone, Search, UsersRound, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import SiteNav from "../components/SiteNav";

const heroImage = "/manus-storage/hero-neighborhood_4a38234b.jpg";
const contactUrl = "/contact";
const idxSearchUrl = "https://c21citrus.com/search/";
const logoUrl = "/manus-storage/century21-citrus-realty-gold-logo_f3913815.png";
const phoneUrl = "tel:19095928500";
const emailUrl = "mailto:oj@c21citrus.com";

interface MdmAgent {
  agentMasterId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string | null;
  phone: string | null;
  photoUrl: string | null;
  licenseNumber: string | null;
  title: string | null;
  officeName: string | null;
  isActive: boolean;
}

/* Generate initials avatar background colors from name */
function getAvatarColor(name: string): string {
  const colors = [
    "#8B6914", "#6B4F12", "#5C4033", "#3D5A3E", "#2E4057",
    "#4A3728", "#7A5C2E", "#3B5249", "#4E3B6E", "#5C3D3D",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Format a raw phone string (e.g. "+19095928500") to "(909) 592-8500" */
function formatPhone(raw: string | null): string {
  if (!raw) return "";
  // Strip all non-digits
  const digits = raw.replace(/\D/g, "");
  // Handle US numbers: 10 digits or 11 digits starting with 1
  const local = digits.length === 11 && digits[0] === "1" ? digits.slice(1) : digits;
  if (local.length === 10) {
    return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
  }
  // Return original if we can't parse
  return raw;
}

/** Strip extension from phone for tel: link */
function phoneForLink(raw: string | null): string {
  if (!raw) return "";
  // Remove ext/x/extension suffixes
  const stripped = raw.replace(/;ext=\d+/i, "").replace(/\s*(ext|x)\.?\s*\d+/i, "").trim();
  return stripped.replace(/\D/g, "");
}

export default function Agents() {
  const [agents, setAgents] = useState<MdmAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [initialFilter, setInitialFilter] = useState("All");
  const gridRef = useRef<HTMLDivElement>(null);

  // Fetch live agents from MDM API
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/api/mdm/agents")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: { agents: MdmAgent[] }) => {
        if (!cancelled) {
          setAgents(data.agents || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[Agents] fetch error:", err);
          setError("Unable to load agent roster. Please try again shortly.");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // Collect initials present in the roster
  const presentInitials = useMemo(() =>
    Array.from(new Set(agents.map((a) => a.lastName[0]?.toUpperCase() ?? "#"))).sort(),
  [agents]);

  const filtered = useMemo(() => agents.filter((a) => {
    const q = search.toLowerCase();
    const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
    const matchesSearch = !q || fullName.includes(q);
    const matchesInitial =
      initialFilter === "All" ||
      (a.lastName[0]?.toUpperCase() ?? "#") === initialFilter;
    return matchesSearch && matchesInitial;
  }), [agents, search, initialFilter]);

  // Group filtered agents by last-name initial for section dividers
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const a of filtered) {
      const letter = a.lastName[0]?.toUpperCase() ?? "#";
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(a);
    }
    return map;
  }, [filtered]);

  const hasActiveFilter = search || initialFilter !== "All";

  function clearFilters() {
    setSearch("");
    setInitialFilter("All");
  }

  return (
    <div style={{ fontFamily: "'Lato', sans-serif" }}>
      <SiteNav activeTab="Agents" />

      <main id="main-content">
        {/* Hero */}
        <section className="c21-inner-hero">
          <img src={heroImage} alt="Southern California neighborhood" className="c21-inner-hero-bg" />
          <div className="c21-inner-hero-overlay" />
          <div className="c21-inner-hero-content">
            <h1 className="c21-inner-hero-title">Meet the Century 21 Citrus Realty<br />Agent Team</h1>
            <p className="c21-inner-hero-subtitle">
              Our agents bring deep local knowledge of San Dimas, Glendora, La Verne, and the greater San Gabriel Valley, backed by the reach of a globally recognized brand.
            </p>
            <div className="c21-hero-actions">
              <a href={contactUrl} className="c21-btn-gold"><UsersRound size={15} /> Contact the Office</a>
              <a href={idxSearchUrl} className="c21-btn-outline-white"><Search size={15} /> Search Homes</a>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e8e4dc", position: "sticky", top: "72px", zIndex: 40 }}>
          {/* Main filter row */}
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem 2rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.85rem", justifyContent: "space-between" }}>
            {/* Search input */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: 1, minWidth: "220px", position: "relative" }}>
              <Search size={15} style={{ color: "#aaa", flexShrink: 0, position: "absolute", left: "0.75rem" }} />
              <input
                type="text"
                placeholder="Search by name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  border: "1px solid #e0dbd0",
                  borderRadius: "2px",
                  padding: "0.5rem 2rem 0.5rem 2.2rem",
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.88rem",
                  color: "#333",
                  outline: "none",
                  background: "#fafaf8",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{ position: "absolute", right: "0.6rem", background: "none", border: "none", cursor: "pointer", color: "#aaa", display: "flex", alignItems: "center", padding: 0 }}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Count + clear */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {!loading && (
                <span style={{ fontSize: "0.82rem", color: "#888", whiteSpace: "nowrap" }}>
                  <strong style={{ color: "#121212" }}>{filtered.length}</strong> agent{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
              {hasActiveFilter && (
                <button
                  onClick={clearFilters}
                  style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "none", border: "1px solid #ddd", borderRadius: "2px", padding: "0.3rem 0.65rem", fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", color: "#666", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  <X size={11} /> Clear filters
                </button>
              )}
            </div>
          </div>

          {/* A-Z quick-jump strip */}
          <div style={{ borderTop: "1px solid #f0ece4", background: "#fafaf8", padding: "0.5rem 2rem", maxWidth: "100%", overflowX: "auto" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", gap: "0.2rem", alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => setInitialFilter("All")}
                style={{
                  fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.08em",
                  padding: "0.25rem 0.55rem", borderRadius: "2px", border: "none", cursor: "pointer",
                  background: initialFilter === "All" ? "var(--c21-gold)" : "transparent",
                  color: initialFilter === "All" ? "var(--c21-black)" : "#888",
                  transition: "background 0.15s, color 0.15s",
                }}
              >ALL</button>
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
                const active = initialFilter === letter;
                const present = presentInitials.includes(letter);
                return (
                  <button
                    key={letter}
                    onClick={() => present ? setInitialFilter(active ? "All" : letter) : undefined}
                    style={{
                      fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700,
                      padding: "0.25rem 0.45rem", borderRadius: "2px", border: "none", cursor: present ? "pointer" : "default",
                      background: active ? "var(--c21-gold)" : "transparent",
                      color: active ? "var(--c21-black)" : present ? "#444" : "#ccc",
                      transition: "background 0.15s, color 0.15s",
                    }}
                  >{letter}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <section ref={gridRef} style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>
          {loading ? (
            /* Loading skeleton */
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ background: "#e8e4dc", width: "2.4rem", height: "2.4rem", borderRadius: "2px" }} />
                <div style={{ flex: 1, height: "1px", background: "#e8e4dc" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ background: "#f0ece4", height: "120px", animation: "pulse 1.5s ease-in-out infinite" }} />
                    <div style={{ padding: "1.25rem" }}>
                      <div style={{ background: "#f0ece4", height: "1rem", borderRadius: "2px", marginBottom: "0.5rem", width: "70%", animation: "pulse 1.5s ease-in-out infinite" }} />
                      <div style={{ background: "#f0ece4", height: "0.75rem", borderRadius: "2px", marginBottom: "1rem", width: "40%", animation: "pulse 1.5s ease-in-out infinite" }} />
                      <div style={{ background: "#f0ece4", height: "0.75rem", borderRadius: "2px", width: "60%", animation: "pulse 1.5s ease-in-out infinite" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#888" }}>
              <UsersRound size={40} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "1rem", color: "#c00" }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={{ marginTop: "1rem", background: "var(--c21-gold)", border: "none", borderRadius: "2px", padding: "0.5rem 1.25rem", fontFamily: "'Lato', sans-serif", fontSize: "0.82rem", cursor: "pointer", color: "var(--c21-black)", fontWeight: 700 }}
              >Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#888" }}>
              <UsersRound size={40} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "1rem" }}>No agents match your filters.</p>
              <button
                onClick={clearFilters}
                style={{ marginTop: "1rem", background: "none", border: "1px solid #ccc", borderRadius: "2px", padding: "0.5rem 1.25rem", fontFamily: "'Lato', sans-serif", fontSize: "0.82rem", cursor: "pointer", color: "#555" }}
              >Clear Filters</button>
            </div>
          ) : (
            <div>
              {Array.from(grouped.entries()).map(([letter, agentsInGroup]) => (
                <div key={letter} style={{ marginBottom: "2.5rem" }}>
                  {/* Section letter divider */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                    <div style={{ background: "var(--c21-black)", color: "var(--c21-gold)", fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, width: "2.4rem", height: "2.4rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "2px", flexShrink: 0 }}>{letter}</div>
                    <div style={{ flex: 1, height: "1px", background: "#e8e4dc" }} />
                    <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", color: "#aaa" }}>{agentsInGroup.length} agent{agentsInGroup.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
                    {agentsInGroup.map((agent) => {
                      const formattedPhone = formatPhone(agent.phone);
                      const telDigits = phoneForLink(agent.phone);
                      return (
                        <div
                          key={agent.agentMasterId}
                          style={{
                            background: "#fff",
                            border: "1px solid #e8e4dc",
                            borderRadius: "3px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            transition: "box-shadow 0.2s, transform 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)";
                            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                            (e.currentTarget as HTMLDivElement).style.transform = "none";
                          }}
                        >
                          {/* Photo or initials avatar */}
                          {agent.photoUrl ? (
                            <div style={{ height: "200px", overflow: "hidden", background: "#f0ece4" }}>
                              <img
                                src={agent.photoUrl}
                                alt={agent.displayName}
                                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }}
                                onError={(e) => {
                                  // Fall back to initials avatar on image load error
                                  const parent = (e.currentTarget as HTMLImageElement).parentElement;
                                  if (parent) {
                                    parent.style.background = getAvatarColor(agent.displayName);
                                    parent.innerHTML = `<span style="font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:700;color:rgba(255,255,255,0.9);letter-spacing:0.05em;display:flex;align-items:center;justify-content:center;height:100%">${getInitials(agent.displayName)}</span>`;
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div style={{ background: getAvatarColor(agent.displayName), height: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.05em" }}>
                                {getInitials(agent.displayName)}
                              </span>
                            </div>
                          )}

                          {/* Info */}
                          <div style={{ padding: "1.25rem 1.25rem 1rem", flex: 1, display: "flex", flexDirection: "column" }}>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--c21-black)", marginBottom: "0.25rem", lineHeight: 1.3 }}>
                              {agent.displayName}
                            </h3>
                            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--c21-gold-dark)", marginBottom: "0.85rem" }}>
                              {agent.title || "Real Estate Agent"}
                            </p>

                            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                              {formattedPhone && (
                                <a
                                  href={`tel:${telDigits}`}
                                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Lato', sans-serif", fontSize: "0.82rem", color: "#444", textDecoration: "none" }}
                                >
                                  <Phone size={13} style={{ color: "var(--c21-gold-dark)", flexShrink: 0 }} />
                                  {formattedPhone}
                                </a>
                              )}
                              {agent.email && (
                                <a
                                  href={`mailto:${agent.email}`}
                                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Lato', sans-serif", fontSize: "0.82rem", color: "#444", textDecoration: "none", wordBreak: "break-all" }}
                                >
                                  <Mail size={13} style={{ color: "var(--c21-gold-dark)", flexShrink: 0 }} />
                                  {agent.email}
                                </a>
                              )}
                            </div>
                          </div>

                          {/* CTA */}
                          <div style={{ padding: "0 1.25rem 1.25rem" }}>
                            <a
                              href={`/contact-agent?agent=${encodeURIComponent(agent.displayName)}${agent.email ? `&email=${encodeURIComponent(agent.email)}` : ""}${agent.phone ? `&phone=${encodeURIComponent(formattedPhone)}` : ""}`}
                              style={{
                                display: "block",
                                textAlign: "center",
                                background: "var(--c21-gold)",
                                color: "var(--c21-black)",
                                fontFamily: "'Lato', sans-serif",
                                fontSize: "0.75rem",
                                fontWeight: 800,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                padding: "0.6rem 1rem",
                                borderRadius: "2px",
                                textDecoration: "none",
                                transition: "background 0.2s",
                              }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--c21-gold-dark)"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--c21-gold)"; }}
                            >
                              Contact Agent
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Banner */}
        <section className="c21-cta-section">
          <div className="c21-cta-inner">
            <div className="c21-cta-text">
              <h2>Ready to Work with a Local Expert?</h2>
              <p>Our agents know Southern California neighborhoods, pricing trends, and what it takes to close. Reach out to connect with the right agent for your goals.</p>
            </div>
            <div className="c21-cta-actions">
              <a href={contactUrl} className="c21-btn-gold"><UsersRound size={15} /> Contact the Office</a>
              <a href={idxSearchUrl} className="c21-btn-outline-white"><Search size={15} /> Search Homes</a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
}
