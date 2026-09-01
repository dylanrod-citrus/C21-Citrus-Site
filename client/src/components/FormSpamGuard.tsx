import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SCRIPT_ID = "c21-turnstile-script";
const TURNSTILE_SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
// A Turnstile site key is designed to be publicly visible in browser code. The
// matching TURNSTILE_SECRET_KEY remains only in the server-side Netlify function.
export const TURNSTILE_SITE_KEY = "0x4AAAAAAEjHiIqGr3Sk6b-o";

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Verification could not load.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Verification could not load."));
    document.head.appendChild(script);
  });
}

export type FormSpamPayload = {
  turnstileToken: string;
  website: string;
};

export function readTurnstileToken(data: FormData): string {
  for (const fieldName of ["turnstileToken", "cf-turnstile-response"]) {
    const value = data.get(fieldName);
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function readFormSpamPayload(form: HTMLFormElement): FormSpamPayload {
  const data = new FormData(form);
  return {
    turnstileToken: readTurnstileToken(data),
    website: String(data.get("website") ?? "").trim(),
  };
}

/**
 * Visible human-verification control plus an intentionally hidden field that
 * ordinary visitors never interact with. The token is always verified again by
 * the server before a form can trigger an email.
 */
export function FormSpamGuard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!containerRef.current) return;
    let active = true;

    loadTurnstile()
      .then(() => {
        if (!active || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "auto",
          "response-field": true,
          "response-field-name": "turnstileToken",
          "expired-callback": () => setError("Verification expired. Please complete it again."),
          "error-callback": () => setError("Verification could not be completed. Please try again."),
          callback: () => setError(""),
        });
      })
      .catch(() => {
        if (active) setError("Verification could not load. Please refresh the page or call us at 909.592.8500.");
      });

    return () => {
      active = false;
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
    };
  }, []);

  return (
    <div>
      <div aria-label="Human verification" ref={containerRef} />
      <input
        aria-hidden="true"
        autoComplete="off"
        name="website"
        tabIndex={-1}
        type="text"
        style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}
      />
      {error && <p role="alert" style={{ color: "#b42318", fontSize: "0.82rem", lineHeight: 1.5, marginTop: "0.5rem" }}>{error}</p>}
    </div>
  );
}
