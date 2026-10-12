/*
  CENTURY 21 CITRUS REALTY - FULL MLS / IDX SEARCH
  Data: CRMLS Matrix broker-generated IDX frame.
  The initial view is defined in the broker's Matrix IDX configuration; visitors
  remain free to search the broader CRMLS coverage from within the embedded search.
*/
import { Building2, Search } from "lucide-react";
import SiteNav from "../components/SiteNav";

const MATRIX_IDX_SEARCH_URL =
  "https://matrix.crmls.org/Matrix/public/IDX.aspx?idx=5aca3921";

export default function MLSSearch() {
  return (
    <div
      style={{
        fontFamily: "'Lato', sans-serif",
        background: "#f7f6f3",
        minHeight: "100vh",
      }}
    >
      <SiteNav activeTab="Home Search" />

      <main id="main-content">
        <section
          style={{
            background: "var(--c21-black)",
            padding: "3rem 2rem 2.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--c21-gold)",
              marginBottom: "0.6rem",
            }}
          >
            CRMLS Home Search
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.15,
              marginBottom: "0.75rem",
            }}
          >
            Search Homes Across Southern California
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.72)",
              maxWidth: "620px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Browse the full CRMLS search experience, with current property details,
            map search, and filters for the homes that fit your needs.
          </p>
        </section>

        <section
          aria-label="CRMLS property search"
          style={{
            background: "#fff",
            borderBottom: "1px solid #e8e4dc",
            padding: "clamp(1rem, 2.5vw, 2rem)",
          }}
        >
          <div
            style={{
              maxWidth: "1440px",
              margin: "0 auto",
              background: "#fff",
              border: "1px solid #e8e4dc",
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            }}
          >
            <iframe
              title="Century 21 Citrus Realty CRMLS home search"
              src={MATRIX_IDX_SEARCH_URL}
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="geolocation"
              style={{
                display: "block",
                width: "100%",
                height: "min(1000px, calc(100svh - 96px))",
                minHeight: "780px",
                border: 0,
                background: "#f7f6f3",
              }}
            />
          </div>
        </section>

        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "3.25rem 2rem",
          }}
        >
          <div
            style={{
              background: "var(--c21-black)",
              borderRadius: "4px",
              padding: "2rem 2.5rem",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.5rem",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--c21-gold)",
                  marginBottom: "0.45rem",
                }}
              >
                Century 21 Citrus Realty
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "0.4rem",
                }}
              >
                Looking for our office&apos;s active listings?
              </h2>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.68)",
                  lineHeight: 1.55,
                  maxWidth: "620px",
                }}
              >
                View the properties currently associated with Century 21 Citrus Realty,
                or contact our office for help with any home in the CRMLS search.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a
                href="/our-listings"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  background: "var(--c21-gold)",
                  color: "var(--c21-black)",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.7rem 1.2rem",
                  borderRadius: "2px",
                  textDecoration: "none",
                }}
              >
                <Building2 size={14} /> Our Listings
              </a>
              <a
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  border: "1px solid rgba(255,255,255,0.32)",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.7rem 1.2rem",
                  borderRadius: "2px",
                  textDecoration: "none",
                }}
              >
                <Search size={14} /> Contact the Office
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
