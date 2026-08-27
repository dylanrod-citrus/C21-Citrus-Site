import SiteNav from "../components/SiteNav";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white font-['Lato',sans-serif]">
      <SiteNav activeTab="" />

      {/* Hero */}
      <section className="bg-[#121212] pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/70 text-lg">
            Last updated: July 6, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none text-[#333] leading-relaxed">

            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#121212] mt-10 mb-4">
              1. Introduction
            </h2>
            <p>
              Century 21 Citrus Realty, Inc. ("we," "us," or "our") is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website. Please read this policy
              carefully. If you do not agree with the terms of this policy, please do not access
              the site.
            </p>

            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#121212] mt-10 mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-xl font-bold text-[#121212] mt-6 mb-3">
              Information You Provide Voluntarily
            </h3>
            <p>
              We may collect personal information that you voluntarily provide when you use our
              contact forms, request property information, schedule showings, or sign up for
              services. This may include your name, email address, phone number, and message
              content.
            </p>
            <h3 className="text-xl font-bold text-[#121212] mt-6 mb-3">
              Automatically Collected Information (Only With Your Consent)
            </h3>
            <p>
              With your explicit consent, we use Umami Analytics, a privacy-focused analytics
              tool, to collect anonymous usage data such as pages visited, time on site, and
              general geographic region. Umami does not use cookies, does not track users across
              websites, and does not collect personally identifiable information. This data
              helps us improve our website experience.
            </p>
            <p>
              <strong>No analytics or tracking scripts are loaded until you affirmatively
              click "Accept" on our consent banner.</strong> If you decline or do not interact
              with the banner, no analytics data is collected from your visit.
            </p>

            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#121212] mt-10 mb-4">
              3. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Respond to your inquiries and provide requested real estate services</li>
              <li>Send you property information you have requested</li>
              <li>Improve our website based on anonymous usage patterns (only with consent)</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#121212] mt-10 mb-4">
              4. Third-Party Sharing
            </h2>
            <p>
              We do <strong>not</strong> sell, rent, or share your personal information with
              third parties for their marketing purposes. We do not use advertising pixels,
              retargeting tags, or behavioral tracking technologies.
            </p>
            <p>
              We may share information with service providers who assist us in operating our
              website (such as email delivery services) under strict confidentiality agreements.
            </p>

            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#121212] mt-10 mb-4">
              5. Cookies and Tracking Technologies
            </h2>
            <p>
              Our website uses only essential, first-party cookies required for basic
              functionality (such as remembering your consent preference). We do not use
              third-party advertising cookies, tracking pixels, or cross-site tracking
              technologies.
            </p>
            <p>
              The only analytics tool we use (Umami) is cookieless and privacy-respecting. It
              is loaded only after you provide affirmative consent via our consent banner.
            </p>

            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#121212] mt-10 mb-4">
              6. Your Rights Under California Law
            </h2>
            <p>
              If you are a California resident, you have the following rights under the
              California Consumer Privacy Act (CCPA) and the California Privacy Rights Act
              (CPRA):
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Right to Know:</strong> You may request disclosure of the categories and specific pieces of personal information we have collected about you.</li>
              <li><strong>Right to Delete:</strong> You may request deletion of personal information we have collected from you.</li>
              <li><strong>Right to Opt-Out:</strong> You have the right to opt out of the sale or sharing of your personal information. We do not sell or share personal information.</li>
              <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights.</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us using the information provided
              below.
            </p>

            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#121212] mt-10 mb-4">
              7. Data Security
            </h2>
            <p>
              We use administrative, technical, and physical security measures to protect your
              personal information. While we strive to use commercially acceptable means to
              protect your data, no method of transmission over the Internet or electronic
              storage is 100% secure.
            </p>

            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#121212] mt-10 mb-4">
              8. Children's Privacy
            </h2>
            <p>
              Our website is not intended for individuals under the age of 13. We do not
              knowingly collect personal information from children under 13.
            </p>

            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#121212] mt-10 mb-4">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new Privacy Policy on this page and updating the "Last
              updated" date. If we make material changes to how we handle your data, we will
              re-prompt for consent where required.
            </p>

            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#121212] mt-10 mb-4">
              10. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise your
              California privacy rights, you may contact us using any of the following methods:
            </p>
            <div className="bg-[#F7F6F3] rounded-xl p-6 mt-4 border border-[#E8E5DE] space-y-2">
              <p className="font-bold text-[#121212]">Century 21 Citrus Realty, Inc.</p>
              <p>1100 Via Verde, San Dimas, CA 91773</p>
              <p>Phone: (909) 592-8500</p>
              <p>Email: <a href="mailto:operations@c21citrus.com" className="text-[#BEAF88] hover:underline">operations@c21citrus.com</a></p>
              <p>Online: <Link href="/privacy-request" className="text-[#BEAF88] hover:underline font-semibold">Submit a Privacy Request →</Link></p>
            </div>
            <p className="mt-4 text-sm text-[#666]">
              We will respond to verified requests within <strong>45 days</strong>. In some cases, we may extend this period by an additional 45 days with notice.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
