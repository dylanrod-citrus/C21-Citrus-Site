import { useState, useEffect, useCallback } from "react";

const CONSENT_KEY = "c21_tracking_consent";
const CONSENT_VERSION = "2"; // Bump this to re-prompt users if policy changes

type ConsentStatus = "granted" | "denied" | null;

export function resolveConsentStatus(storedConsent: ConsentStatus, globalPrivacyControl: boolean): ConsentStatus {
  return globalPrivacyControl ? "denied" : storedConsent;
}

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

/** Returns true only when optional analytics are explicitly allowed and GPC is not set. */
export function hasAnalyticsConsent(): boolean {
  return resolveConsentStatus(getStoredConsent(), hasGlobalPrivacyControl()) === "granted";
}

function setStoredConsent(status: "granted" | "denied") {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ status, version: CONSENT_VERSION, timestamp: Date.now() })
  );
}

function loadAnalytics() {
  // Only load the office-owned Umami tracker after explicit consent.
  const endpoint = import.meta.env.VITE_UMAMI_ENDPOINT;
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;

  if (!endpoint || !websiteId) return;
  if (document.querySelector('script[data-website-id]')) return;

  const script = document.createElement("script");
  script.defer = true;
  script.src = `${endpoint.replace(/\/$/, "")}/script.js`;
  script.setAttribute("data-website-id", websiteId);
  document.body.appendChild(script);
}

function hasGlobalPrivacyControl(): boolean {
  return typeof navigator !== "undefined" && (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

function disableAnalytics() {
  document.querySelectorAll('script[data-website-id], script[src*="/umami"], script[src*="/script.js"]').forEach((script) => script.remove());
}

function persistOptOut(source: "banner" | "footer" | "gpc") {
  void fetch("/api/privacy-opt-out", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source }),
    keepalive: true,
  }).catch(() => undefined);
}

/**
 * Opt the current user out of tracking immediately.
 * Safe to call from any component — removes any existing analytics scripts,
 * stores the "denied" preference, and shows a brief confirmation toast.
 * It governs optional website analytics for this browser. Broader privacy
 * requests remain available through the dedicated privacy-request workflow.
 */
export function triggerDoNotSellOptOut(source: "banner" | "footer" = "footer") {
  setStoredConsent("denied");
  disableAnalytics();
  persistOptOut(source);
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
  toast.textContent = "Your privacy preference has been saved. Optional analytics are disabled on this device.";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const globalPrivacyControl = hasGlobalPrivacyControl();
    const consent = resolveConsentStatus(getStoredConsent(), globalPrivacyControl);
    if (globalPrivacyControl) {
      setStoredConsent("denied");
      disableAnalytics();
      persistOptOut("gpc");
      return;
    }
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
    triggerDoNotSellOptOut("banner");
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
              Accepting enables optional, privacy-respecting analytics; declining keeps the
              optional analytics service and location-selection events off. Necessary server-side
              logs may still be processed to operate and secure this site. We <strong>do not sell
              or share your personal information</strong> with advertisers.{" "}
              <a
                href="/privacy-policy"
                className="text-[#BEAF88] underline underline-offset-2 hover:text-[#e0c36a] transition-colors"
              >
                Privacy Policy
              </a>
              {" | "}
              <button
                type="button"
                onClick={handleDoNotSell}
                className="text-[#BEAF88] underline underline-offset-2 hover:text-[#e0c36a] transition-colors cursor-pointer"
              >
                Do Not Sell or Share My Personal Information
              </button>
              {" | "}
              <a
                href="/privacy-request"
                className="text-[#BEAF88] underline underline-offset-2 hover:text-[#e0c36a] transition-colors"
              >
                Submit a Privacy Request
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
