import { createHash } from "node:crypto";
import type { Request } from "express";

type FormScope = "contact" | "privacy-request" | "privacy-opt-out";

type FormSecurityResult =
  | { allowed: true }
  | { allowed: false; trap: true }
  | { allowed: false; trap: false; status: number; error: string };

type RateLimitWindow = { attempts: number; resetAt: number };

const rateLimitWindows = new Map<string, RateLimitWindow>();
const MAX_CONTENT_LENGTH = 24 * 1024;
const expectedHostnames = new Set(["www.c21citrus.com", "c21citrus.com"]);
const rateLimitConfig: Record<FormScope, { maximum: number; windowMs: number }> = {
  contact: { maximum: 5, windowMs: 15 * 60 * 1000 },
  "privacy-request": { maximum: 3, windowMs: 60 * 60 * 1000 },
  "privacy-opt-out": { maximum: 10, windowMs: 15 * 60 * 1000 },
};

function headerValue(req: Request, name: string): string {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function hashedClientIdentifier(req: Request): string {
  const forwarded = headerValue(req, "x-nf-client-connection-ip") || headerValue(req, "x-forwarded-for").split(",")[0]?.trim() || req.ip || "unknown";
  return createHash("sha256").update(`c21-form-throttle-v1:${forwarded}`).digest("hex");
}

function isOverContentLimit(req: Request): boolean {
  const contentLength = Number(headerValue(req, "content-length"));
  return Number.isFinite(contentLength) && contentLength > MAX_CONTENT_LENGTH;
}

function consumeRateLimit(req: Request, scope: FormScope): boolean {
  const config = rateLimitConfig[scope];
  const now = Date.now();
  const key = `${scope}:${hashedClientIdentifier(req)}`;
  const current = rateLimitWindows.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitWindows.set(key, { attempts: 1, resetAt: now + config.windowMs });
    return true;
  }
  if (current.attempts >= config.maximum) return false;

  current.attempts += 1;
  return true;
}

function extractHoneypot(body: unknown): string {
  if (!body || typeof body !== "object") return "";
  const value = (body as Record<string, unknown>).website;
  return typeof value === "string" ? value.trim() : "";
}

function extractTurnstileToken(body: unknown): string {
  if (!body || typeof body !== "object") return "";
  const value = (body as Record<string, unknown>).turnstileToken;
  return typeof value === "string" ? value.trim() : "";
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return false;
    const verdict = await response.json() as { success?: boolean; hostname?: string };
    return verdict.success === true && expectedHostnames.has(verdict.hostname ?? "");
  } catch {
    return false;
  }
}

export async function validateEmailFormSubmission(req: Request, scope: "contact" | "privacy-request"): Promise<FormSecurityResult> {
  if (isOverContentLimit(req)) {
    return { allowed: false, trap: false, status: 413, error: "Your submission is too large. Please shorten your message and try again." };
  }
  if (extractHoneypot(req.body)) return { allowed: false, trap: true };
  if (!await verifyTurnstile(extractTurnstileToken(req.body))) {
    return { allowed: false, trap: false, status: 400, error: "Please complete the verification and try again." };
  }
  if (!consumeRateLimit(req, scope)) {
    return { allowed: false, trap: false, status: 429, error: "Please wait a few minutes before submitting another request." };
  }
  return { allowed: true };
}

export function allowPrivacyOptOutAttempt(req: Request): boolean {
  return !isOverContentLimit(req) && consumeRateLimit(req, "privacy-opt-out");
}

export function resetFormSecurityRateLimitsForTest(): void {
  rateLimitWindows.clear();
}
