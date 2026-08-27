import { useState } from "react";
import SiteNav from "../components/SiteNav";
import { Link } from "wouter";

const REQUEST_TYPES = [
  {
    value: "know",
    label: "Right to Know",
    description:
      "Request disclosure of the categories and specific pieces of personal information we have collected about you.",
  },
  {
    value: "delete",
    label: "Right to Delete",
    description:
      "Request deletion of personal information we have collected from you.",
  },
  {
    value: "correct",
    label: "Right to Correct",
    description:
      "Request correction of inaccurate personal information we maintain about you.",
  },
  {
    value: "optout",
    label: "Right to Opt-Out",
    description:
      "Opt out of the sale or sharing of your personal information (we do not sell personal information, but you may still submit this request).",
  },
  {
    value: "limit",
    label: "Limit Use of Sensitive Information",
    description:
      "Request that we limit our use of your sensitive personal information to only what is necessary to provide our services.",
  },
  {
    value: "nondiscrimination",
    label: "Right to Non-Discrimination",
    description:
      "Confirm that we will not discriminate against you for exercising any of your privacy rights.",
  },
];

type FormState = {
  requestType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
  description: string;
  agentName: string;
  verified: boolean;
};

const INITIAL_STATE: FormState = {
  requestType: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  relationship: "consumer",
  description: "",
  agentName: "",
  verified: false,
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function PrivacyRequest() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const selectedType = REQUEST_TYPES.find((t) => t.value === form.requestType);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.verified) {
      setErrorMsg("Please confirm your identity by checking the verification box.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/privacy-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed. Please try again.");
      }
      setStatus("success");
      setForm(INITIAL_STATE);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] font-sans">
      <SiteNav />

      {/* Page Header */}
      <section
        className="relative bg-[#121212] text-white py-20 px-6"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.98) 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-[#BEAF88] text-xs font-bold tracking-[0.18em] uppercase mb-4"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            Your Privacy Rights
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-5"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Submit a Privacy Request
          </h1>
          <p
            className="text-white/70 text-base leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            California residents have rights under the California Consumer
            Privacy Act (CCPA) and the California Privacy Rights Act (CPRA).
            Use this form to exercise any of those rights. We will respond
            within 45 days of receiving your verified request.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E8E4DC]">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-[#888]" style={{ fontFamily: "Lato, sans-serif" }}>
          <Link href="/" className="hover:text-[#BEAF88] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/privacy-policy" className="hover:text-[#BEAF88] transition-colors">Privacy Policy</Link>
          <span>/</span>
          <span className="text-[#121212]">Submit a Request</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-14">

        {status === "success" ? (
          <div className="bg-white rounded-sm border border-[#E8E4DC] p-10 text-center shadow-sm">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(190,175,136,0.12)" }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#BEAF88" fillOpacity="0.15" />
                <path d="M9 16.5L13.5 21L23 11" stroke="#BEAF88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2
              className="text-2xl font-bold text-[#121212] mb-3"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Request Submitted
            </h2>
            <p className="text-[#555] text-sm leading-relaxed mb-2" style={{ fontFamily: "Lato, sans-serif" }}>
              Thank you. We have received your privacy request and will respond within <strong>45 days</strong>.
            </p>
            <p className="text-[#555] text-sm leading-relaxed mb-8" style={{ fontFamily: "Lato, sans-serif" }}>
              A confirmation has been sent to your email address. If you have questions, contact us at{" "}
              <a href="mailto:operations@c21citrus.com" className="text-[#BEAF88] hover:underline">
                operations@c21citrus.com
              </a>{" "}
              or call <a href="tel:+19095928500" className="text-[#BEAF88] hover:underline">909.592.8500</a>.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#121212] text-white text-xs font-bold tracking-[0.1em] uppercase px-8 py-3 hover:bg-[#BEAF88] hover:text-[#121212] transition-colors"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              Return Home
            </Link>
          </div>
        ) : (
          <>
            {/* Info callout */}
            <div className="bg-[#121212] text-white rounded-sm p-5 mb-8 flex gap-4 items-start">
              <div className="mt-0.5 shrink-0">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="#BEAF88" fillOpacity="0.2" />
                  <path d="M10 9v5M10 7v.5" stroke="#BEAF88" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-white/80 text-sm leading-relaxed" style={{ fontFamily: "Lato, sans-serif" }}>
                To protect your privacy, we are required to verify your identity before processing your request. We will contact you using the email address you provide below. You may be asked to provide additional verification.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-8">

              {/* Step 1: Request Type */}
              <section className="bg-white rounded-sm border border-[#E8E4DC] p-8 shadow-sm">
                <h2
                  className="text-lg font-bold text-[#121212] mb-1"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  1. Select Your Request Type
                </h2>
                <p className="text-[#888] text-xs mb-6" style={{ fontFamily: "Lato, sans-serif" }}>
                  Choose the California privacy right you wish to exercise.
                </p>

                <div className="space-y-3">
                  {REQUEST_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-start gap-4 p-4 rounded-sm border cursor-pointer transition-all ${
                        form.requestType === type.value
                          ? "border-[#BEAF88] bg-[#BEAF88]/5"
                          : "border-[#E8E4DC] hover:border-[#BEAF88]/50 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="requestType"
                        value={type.value}
                        checked={form.requestType === type.value}
                        onChange={handleChange}
                        className="mt-1 accent-[#BEAF88] shrink-0"
                        required
                      />
                      <div>
                        <p
                          className="text-sm font-bold text-[#121212] mb-0.5"
                          style={{ fontFamily: "Lato, sans-serif" }}
                        >
                          {type.label}
                        </p>
                        <p
                          className="text-xs text-[#666] leading-relaxed"
                          style={{ fontFamily: "Lato, sans-serif" }}
                        >
                          {type.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                {selectedType && (
                  <div className="mt-4 p-4 bg-[#F7F6F3] border-l-4 border-[#BEAF88] rounded-sm">
                    <p className="text-xs text-[#555] leading-relaxed" style={{ fontFamily: "Lato, sans-serif" }}>
                      <strong className="text-[#121212]">Selected: {selectedType.label}</strong> - {selectedType.description}
                    </p>
                  </div>
                )}
              </section>

              {/* Step 2: Your Information */}
              <section className="bg-white rounded-sm border border-[#E8E4DC] p-8 shadow-sm">
                <h2
                  className="text-lg font-bold text-[#121212] mb-1"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  2. Your Information
                </h2>
                <p className="text-[#888] text-xs mb-6" style={{ fontFamily: "Lato, sans-serif" }}>
                  Required to verify your identity and process your request.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#121212] uppercase tracking-[0.08em] mb-2" style={{ fontFamily: "Lato, sans-serif" }}>
                      First Name <span className="text-[#BEAF88]">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      placeholder="Jane"
                      className="w-full border border-[#D8D4CC] bg-[#FAFAF8] px-4 py-3 text-sm text-[#121212] placeholder-[#BBBBBB] focus:outline-none focus:border-[#BEAF88] focus:ring-1 focus:ring-[#BEAF88] transition-colors rounded-sm"
                      style={{ fontFamily: "Lato, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#121212] uppercase tracking-[0.08em] mb-2" style={{ fontFamily: "Lato, sans-serif" }}>
                      Last Name <span className="text-[#BEAF88]">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      placeholder="Smith"
                      className="w-full border border-[#D8D4CC] bg-[#FAFAF8] px-4 py-3 text-sm text-[#121212] placeholder-[#BBBBBB] focus:outline-none focus:border-[#BEAF88] focus:ring-1 focus:ring-[#BEAF88] transition-colors rounded-sm"
                      style={{ fontFamily: "Lato, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#121212] uppercase tracking-[0.08em] mb-2" style={{ fontFamily: "Lato, sans-serif" }}>
                      Email Address <span className="text-[#BEAF88]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="jane@example.com"
                      className="w-full border border-[#D8D4CC] bg-[#FAFAF8] px-4 py-3 text-sm text-[#121212] placeholder-[#BBBBBB] focus:outline-none focus:border-[#BEAF88] focus:ring-1 focus:ring-[#BEAF88] transition-colors rounded-sm"
                      style={{ fontFamily: "Lato, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#121212] uppercase tracking-[0.08em] mb-2" style={{ fontFamily: "Lato, sans-serif" }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="(909) 555-0100"
                      className="w-full border border-[#D8D4CC] bg-[#FAFAF8] px-4 py-3 text-sm text-[#121212] placeholder-[#BBBBBB] focus:outline-none focus:border-[#BEAF88] focus:ring-1 focus:ring-[#BEAF88] transition-colors rounded-sm"
                      style={{ fontFamily: "Lato, sans-serif" }}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-xs font-bold text-[#121212] uppercase tracking-[0.08em] mb-2" style={{ fontFamily: "Lato, sans-serif" }}>
                    Your Relationship to Century 21 Citrus Realty <span className="text-[#BEAF88]">*</span>
                  </label>
                  <select
                    name="relationship"
                    value={form.relationship}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#D8D4CC] bg-[#FAFAF8] px-4 py-3 text-sm text-[#121212] focus:outline-none focus:border-[#BEAF88] focus:ring-1 focus:ring-[#BEAF88] transition-colors rounded-sm"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    <option value="consumer">Website Visitor / Consumer</option>
                    <option value="buyer">Past or Current Buyer Client</option>
                    <option value="seller">Past or Current Seller Client</option>
                    <option value="agent">Agent / Team Member</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mt-5">
                  <label className="block text-xs font-bold text-[#121212] uppercase tracking-[0.08em] mb-2" style={{ fontFamily: "Lato, sans-serif" }}>
                    Agent Name (if applicable)
                  </label>
                  <input
                    type="text"
                    name="agentName"
                    value={form.agentName}
                    onChange={handleChange}
                    placeholder="Name of the agent you worked with, if any"
                    className="w-full border border-[#D8D4CC] bg-[#FAFAF8] px-4 py-3 text-sm text-[#121212] placeholder-[#BBBBBB] focus:outline-none focus:border-[#BEAF88] focus:ring-1 focus:ring-[#BEAF88] transition-colors rounded-sm"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  />
                </div>
              </section>

              {/* Step 3: Description */}
              <section className="bg-white rounded-sm border border-[#E8E4DC] p-8 shadow-sm">
                <h2
                  className="text-lg font-bold text-[#121212] mb-1"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  3. Describe Your Request
                </h2>
                <p className="text-[#888] text-xs mb-6" style={{ fontFamily: "Lato, sans-serif" }}>
                  Please provide any additional details that will help us locate your information and process your request accurately.
                </p>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Please describe your request in as much detail as possible. For example: the type of information you are requesting, the approximate dates you interacted with our website or office, or any other relevant context."
                  className="w-full border border-[#D8D4CC] bg-[#FAFAF8] px-4 py-3 text-sm text-[#121212] placeholder-[#BBBBBB] focus:outline-none focus:border-[#BEAF88] focus:ring-1 focus:ring-[#BEAF88] transition-colors rounded-sm resize-none"
                  style={{ fontFamily: "Lato, sans-serif" }}
                />
              </section>

              {/* Step 4: Verification & Submit */}
              <section className="bg-white rounded-sm border border-[#E8E4DC] p-8 shadow-sm">
                <h2
                  className="text-lg font-bold text-[#121212] mb-1"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  4. Verify & Submit
                </h2>
                <p className="text-[#888] text-xs mb-6" style={{ fontFamily: "Lato, sans-serif" }}>
                  By submitting this form, you confirm the information provided is accurate.
                </p>

                <label className="flex items-start gap-3 cursor-pointer mb-6">
                  <input
                    type="checkbox"
                    name="verified"
                    checked={form.verified}
                    onChange={handleChange}
                    className="mt-0.5 accent-[#BEAF88] shrink-0 w-4 h-4"
                  />
                  <span className="text-sm text-[#444] leading-relaxed" style={{ fontFamily: "Lato, sans-serif" }}>
                    I confirm that the information provided in this form is accurate and that I am the consumer whose personal information is the subject of this request, or I am authorized to submit this request on behalf of that consumer. I understand that Century 21 Citrus Realty may need to verify my identity before processing this request.
                  </span>
                </label>

                {errorMsg && (
                  <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-sm">
                    <p className="text-red-700 text-sm" style={{ fontFamily: "Lato, sans-serif" }}>{errorMsg}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <p className="text-xs text-[#888] leading-relaxed max-w-sm" style={{ fontFamily: "Lato, sans-serif" }}>
                    We will respond within <strong>45 days</strong>. You may also email{" "}
                    <a href="mailto:operations@c21citrus.com" className="text-[#BEAF88] hover:underline">
                      operations@c21citrus.com
                    </a>{" "}
                    or call{" "}
                    <a href="tel:+19095928500" className="text-[#BEAF88] hover:underline">
                      909.592.8500
                    </a>.
                  </p>
                  <button
                    type="submit"
                    disabled={status === "loading" || !form.requestType || !form.firstName || !form.lastName || !form.email}
                    className="shrink-0 bg-[#BEAF88] text-[#121212] text-xs font-bold tracking-[0.12em] uppercase px-10 py-4 hover:bg-[#121212] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    {status === "loading" ? "Submitting…" : "Submit Request"}
                  </button>
                </div>
              </section>

            </form>
          </>
        )}

        {/* Legal note */}
        <div className="mt-10 p-6 bg-white border border-[#E8E4DC] rounded-sm">
          <p className="text-xs text-[#888] leading-relaxed" style={{ fontFamily: "Lato, sans-serif" }}>
            <strong className="text-[#121212]">Important:</strong> We are required to verify your identity before processing your request to protect your privacy. We will not discriminate against you for exercising your rights. For more information about your California privacy rights, please review our{" "}
            <Link href="/privacy-policy" className="text-[#BEAF88] hover:underline">
              Privacy Policy
            </Link>
            . If you are an authorized agent submitting on behalf of a consumer, please include documentation of your authorization in the description field above.
          </p>
        </div>
      </main>
    </div>
  );
}
