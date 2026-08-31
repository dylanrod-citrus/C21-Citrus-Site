import { Router, type Express, type Request, type Response } from "express";
import nodemailer from "nodemailer";
import { recordPrivacyOptOut, recordPrivacyRequest } from "./db";
import { allowPrivacyOptOutAttempt, validateEmailFormSubmission } from "./formSecurity";

const privacyRecipients = ["oj@c21citrus.com", "gabi@c21citrus.com"];
const requestLabels: Record<string, string> = { know: "Right to Know", delete: "Right to Delete", correct: "Right to Correct", optout: "Right to Opt-Out", limit: "Limit Use of Sensitive Information", nondiscrimination: "Right to Non-Discrimination" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

export type PrivacyRequestInput = Record<string, string | boolean | undefined>;

export function validatePrivacyRequest(input: PrivacyRequestInput): string | null {
  const { requestType, firstName, lastName, email, verified } = input;
  if (typeof requestType !== "string" || typeof firstName !== "string" || typeof lastName !== "string" || typeof email !== "string" || !requestType || !firstName || !lastName || !email) return "Missing required fields.";
  if (!emailPattern.test(email)) return "Invalid email address.";
  if (requestType !== "optout" && (!verified || verified === "false")) return "Identity verification checkbox is required.";
  return null;
}

function privacyTransport() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s/g, "");
  if (!user || !pass) throw new Error("SMTP is not configured");
  return { user, transporter: nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass } }) };
}

export function registerPrivacyRequestRoute(app: Express): void {
  const router = Router();
  router.post("/api/privacy-opt-out", async (req: Request, res: Response) => {
    if (!allowPrivacyOptOutAttempt(req)) {
      return res.status(429).json({ error: "Please wait a few minutes before trying again." });
    }
    const source = req.body?.source;
    if (source !== "banner" && source !== "footer" && source !== "gpc") {
      return res.status(400).json({ error: "Invalid opt-out source." });
    }
    await recordPrivacyOptOut(source);
    return res.json({ ok: true });
  });

  router.post("/api/privacy-request", async (req: Request, res: Response) => {
    try {
      const formSecurity = await validateEmailFormSubmission(req, "privacy-request");
      if (!formSecurity.allowed) {
        if (formSecurity.trap) return res.json({ ok: true });
        return res.status(formSecurity.status).json({ error: formSecurity.error });
      }

      const { requestType, firstName, lastName, email, phone = "", relationship = "consumer", description = "", agentName = "", verified } = req.body as Record<string, string>;
      const validationError = validatePrivacyRequest({ requestType, firstName, lastName, email, verified });
      if (validationError) return res.status(400).json({ error: validationError });
      if (firstName.length > 100 || lastName.length > 100 || email.length > 254 || phone.length > 50 || relationship.length > 80 || description.length > 5_000 || agentName.length > 160) {
        return res.status(400).json({ error: "One or more fields are too long. Please shorten your request and try again." });
      }

      const label = requestLabels[requestType] ?? requestType;
      await recordPrivacyRequest({
        requestType,
        requesterEmail: email,
        requesterFirstName: firstName,
        requesterLastName: lastName,
      });
      const { user, transporter } = privacyTransport();
      const safeName = escapeHtml(`${firstName} ${lastName}`);
      const safeEmail = escapeHtml(email);
      const details = `<p><strong>Request type:</strong> ${escapeHtml(label)}</p><p><strong>Requester:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><p><strong>Relationship:</strong> ${escapeHtml(relationship)}</p><p><strong>Agent:</strong> ${escapeHtml(agentName)}</p><p><strong>Details:</strong><br>${escapeHtml(description)}</p>`;
      await transporter.sendMail({ from: `"Century 21 Citrus Realty Website" <${user}>`, to: privacyRecipients.join(", "), replyTo: `"${firstName} ${lastName}" <${email}>`, subject: `[Privacy Request] ${label} — ${firstName} ${lastName}`, html: `<main><h1>Privacy Request Received</h1>${details}</main>` });
      const confirmation = requestType === "optout"
        ? "We received your opt-out request. We will process your privacy preference as soon as feasible."
        : `We received your ${escapeHtml(label)} request and may contact you to verify your identity before responding.`;
      await transporter.sendMail({ from: `"Century 21 Citrus Realty" <${user}>`, to: `"${firstName} ${lastName}" <${email}>`, subject: "Privacy Request Received — Century 21 Citrus Realty", html: `<main><p>Hi ${escapeHtml(firstName)},</p><p>${confirmation}</p></main>` });
      return res.json({ ok: true });
    } catch (error) {
      console.error("[PrivacyRequest]", error);
      return res.status(500).json({ error: "Failed to submit request. Please email operations@c21citrus.com directly." });
    }
  });
  app.use(router);
}
