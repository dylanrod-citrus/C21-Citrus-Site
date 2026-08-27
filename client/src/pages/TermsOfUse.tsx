import SiteNav from "../components/SiteNav";
import { Link } from "wouter";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Lato, sans-serif" }}>
      <a
        href="#main-content"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = "0";
          e.currentTarget.style.width = "auto";
          e.currentTarget.style.height = "auto";
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = "-9999px";
          e.currentTarget.style.width = "1px";
          e.currentTarget.style.height = "1px";
        }}
      >
        Skip to main content
      </a>

      <SiteNav activeTab="" />

      {/* Hero */}
      <section style={{ background: "#121212", paddingTop: "7rem", paddingBottom: "3rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "0.5rem",
            }}
          >
            Terms of Use
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem" }}>
            Last updated: July 6, 2026
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ background: "#F7F6F3", padding: "0.75rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", fontSize: "0.85rem", color: "#888" }}>
          <Link href="/" style={{ color: "#BEAF88", textDecoration: "none" }}>Home</Link>
          {" / "}
          <span>Terms of Use</span>
        </div>
      </nav>

      {/* Content */}
      <main id="main-content">
        <section style={{ padding: "3rem 1.5rem 4rem" }}>
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              color: "#444",
              lineHeight: 1.8,
              fontSize: "0.95rem",
            }}
          >
            <p style={{ marginBottom: "1.5rem" }}>
              Welcome to the Century 21 Citrus Realty website. By accessing or using this website
              (the "Site"), you agree to be bound by these Terms of Use. If you do not agree, please
              do not use this Site.
            </p>

            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#121212", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
              1. Acceptance of Terms
            </h2>
            <p>
              These Terms of Use govern your access to and use of the Site operated by Century 21
              Century 21 Citrus Realty, Inc. ("Company," "we," "us," or "our"), a California real estate
              brokerage licensed under DRE License #00848848. By using this Site, you represent that
              you are at least 18 years of age and have the legal capacity to enter into these terms.
            </p>

            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#121212", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
              2. Real Estate Information Disclaimer
            </h2>
            <p>
              All real estate listings, property information, and market data displayed on this Site
              are provided for informational purposes only. Information is deemed reliable but is not
              guaranteed accurate. All properties are subject to prior sale, change, or withdrawal.
              Neither Century 21 Citrus Realty nor any listing broker shall be responsible for
              typographical errors, misinformation, or misprints.
            </p>
            <p style={{ marginTop: "0.75rem" }}>
              Listing data is based on information from the California Regional Multiple Listing
              Service (CRMLS). The information provided is for consumers' personal, non-commercial
              use and may not be used for any purpose other than to identify prospective properties
              consumers may be interested in purchasing.
            </p>

            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#121212", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
              3. No Agency Relationship
            </h2>
            <p>
              Use of this Site does not create an agency, brokerage, or fiduciary relationship
              between you and Century 21 Citrus Realty. An agency relationship is only established
              through a written agreement signed by both parties.
            </p>

            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#121212", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
              4. Intellectual Property
            </h2>
            <p>
              All content on this Site, including text, graphics, logos, images, and software, is
              the property of Century 21 Citrus Realty or its content suppliers and is protected by
              United States and international copyright laws. The Century 21® brand and trademarks
              are owned by Century 21 Real Estate LLC. Unauthorized reproduction, distribution, or
              modification of any content is strictly prohibited.
            </p>

            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#121212", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
              5. Permitted Use
            </h2>
            <p>
              You may use this Site solely for lawful, personal, non-commercial purposes. You agree
              not to:
            </p>
            <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem", lineHeight: 2 }}>
              <li>Scrape, harvest, or systematically collect data from the Site</li>
              <li>Use automated tools, bots, or scripts to access the Site</li>
              <li>Reproduce, republish, or redistribute listing data without authorization</li>
              <li>Attempt to gain unauthorized access to any part of the Site</li>
              <li>Transmit any harmful, offensive, or unlawful content</li>
              <li>Violate any applicable federal, state, or local laws or regulations</li>
            </ul>

            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#121212", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
              6. Third-Party Links
            </h2>
            <p>
              This Site may contain links to third-party websites, including MLS search portals,
              valuation tools, and other real estate resources. We are not responsible for the
              content, privacy practices, or accuracy of any third-party site. Links do not
              constitute an endorsement.
            </p>

            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#121212", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
              7. Disclaimer of Warranties
            </h2>
            <p>
              THIS SITE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. We do not warrant that the
              Site will be uninterrupted, error-free, or free of viruses or other harmful components.
            </p>

            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#121212", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
              8. Limitation of Liability
            </h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, CENTURY 21 CITRUS REALTY SHALL NOT BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT
              OF YOUR USE OF THIS SITE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR
              TOTAL LIABILITY SHALL NOT EXCEED $100.
            </p>

            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#121212", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
              9. Equal Housing Opportunity
            </h2>
            <p>
              Century 21 Citrus Realty is committed to the principles of the Fair Housing Act and
              the Equal Housing Opportunity Act. We do not discriminate on the basis of race, color,
              national origin, religion, sex, familial status, disability, or any other protected
              class under applicable federal, state, or local law.
            </p>

            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#121212", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
              10. Privacy
            </h2>
            <p>
              Your use of this Site is also governed by our{" "}
              <Link href="/privacy-policy" style={{ color: "#BEAF88" }}>Privacy Policy</Link>,
              which is incorporated into these Terms by reference. California residents may exercise
              their privacy rights by visiting our{" "}
              <Link href="/privacy-request" style={{ color: "#BEAF88" }}>Privacy Request page</Link>.
            </p>

            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#121212", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
              11. Governing Law
            </h2>
            <p>
              These Terms of Use shall be governed by and construed in accordance with the laws of
              the State of California, without regard to its conflict of law provisions. Any disputes
              arising under these Terms shall be subject to the exclusive jurisdiction of the state
              and federal courts located in Los Angeles County, California.
            </p>

            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#121212", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
              12. Changes to These Terms
            </h2>
            <p>
              We reserve the right to modify these Terms of Use at any time. Changes will be posted
              on this page with an updated "Last updated" date. Your continued use of the Site after
              any changes constitutes your acceptance of the new Terms.
            </p>

            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#121212", marginTop: "2.5rem", marginBottom: "0.75rem" }}>
              13. Contact Us
            </h2>
            <div
              style={{
                background: "#F7F6F3",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                marginTop: "1rem",
                border: "1px solid #E8E5DE",
                lineHeight: 2,
              }}
            >
              <p style={{ fontWeight: 700, color: "#121212" }}>Century 21 Citrus Realty, Inc.</p>
              <p>1100 Via Verde, San Dimas, CA 91773</p>
              <p>Phone: (909) 592-8500</p>
              <p>
                Email:{" "}
                <a href="mailto:oj@c21citrus.com" style={{ color: "#BEAF88" }}>
                  oj@c21citrus.com
                </a>
              </p>
              <p>
                Privacy:{" "}
                <a href="mailto:operations@c21citrus.com" style={{ color: "#BEAF88" }}>
                  operations@c21citrus.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
