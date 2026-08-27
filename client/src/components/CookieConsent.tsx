import { useState, useEffect, useCallback } from "react";

const CONSENT_KEY = "c21_tracking_consent";
const CONSENT_VERSION = "1"; // Bump this to re-prompt users if policy changes

type ConsentStatus = "granted" | "denied" | null;

function getStoredConsent(): ConsentStatus {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed.status as ConsentStatus;
  } catch {
    return null;
  }
}

function setStoredConsent(status: "granted" | "denied") {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ status, version: CONSENT_VERSION, timestamp: Date.now() })
  );
}

function loadAnalytics() {
  // Only load Umami if env vars are available and script isn't already loaded
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

  if (!endpoint || !websiteId) return;
  if (document.querySelector('script[data-website-id]')) return;

  const script = document.createElement("script");
  script.defer = true;
  script.src = `${endpoint}/umami`;
  script.setAttribute("data-website-id", websiteId);
  document.body.appendChild(script);
}

/**
 * Opt the current user out of tracking immediately.
 * Safe to call from any component — removes any existing analytics scripts,
 * stores the "denied" preference, and shows a brief confirmation toast.
 * This satisfies CPRA § 1798.120 "Do Not Sell or Share" opt-out.
 */
export function triggerDoNotSellOptOut() {
  setStoredConsent("denied");
  // Remove any already-loaded analytics scripts
  const existing = document.querySelector('script[data-website-id]');
  if (existing) existing.remove();
  // Show a brief confirmation toast
  const toast = document.createElement("div");
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.style.cssText = [
    "position:fixed", "bottom:1.5rem", "left:50%", "transform:translateX(-50%)",
    "background:#121212", "color:#fff", "border:1px solid #BEAF88",
    "padding:0.75rem 1.5rem", "border-radius:8px", "font-size:0.875rem",
    "font-family:Lato,sans-serif", "z-index:99999", "box-shadow:0 4px 20px rgba(0,0,0,0.4)",
    "max-width:90vw", "text-align:center",
  ].join(";");
  toast.textContent = "Your opt-out preference has been saved. We will not sell or share your personal information.";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getStoredConsent();
    if (consent === "granted") {
      loadAnalytics();
    } else if (consent === null) {
      // No stored preference — show the banner
      setVisible(true);
    }
    // If "denied", do nothing — no banner, no tracking
  }, []);

  const handleAccept = useCallback(() => {
    setStoredConsent("granted");
    setVisible(false);
    loadAnalytics();
  }, []);

  const handleDecline = useCallback(() => {
    setStoredConsent("denied");
    setVisible(false);
  }, []);

  const handleDoNotSell = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    triggerDoNotSellOptOut();
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="mx-auto max-w-3xl rounded-xl border border-[#BEAF88]/30 bg-[#121212]/95 backdrop-blur-md p-5 md:p-6 shadow-2xl"
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <p className="text-sm text-white/90 leading-relaxed font-['Lato',sans-serif]">
              We use privacy-respecting analytics to understand how visitors use our site.
              We <strong>do not sell or share your personal information</strong> with advertisers.{" "}
              <a
                href="/privacy-policy"
                className="text-[#BEAF88] underline underline-offset-2 hover:text-[#e0c36a] transition-colors"
              >
                Privacy Policy
              </a>
              {" | "}
              <a
                href="/privacy-request"
                onClick={handleDoNotSell}
                className="text-[#BEAF88] underline underline-offset-2 hover:text-[#e0c36a] transition-colors cursor-pointer"
              >
                Do Not Sell or Share My Personal Information
              </a>
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-white/70 border border-white/20 rounded-lg hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#BEAF88]/50"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2 text-sm font-semibold text-[#121212] bg-[#BEAF88] rounded-lg hover:bg-[#e0c36a] transition-all focus:outline-none focus:ring-2 focus:ring-[#BEAF88]/50"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
