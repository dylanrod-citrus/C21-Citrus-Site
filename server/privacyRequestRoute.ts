import { Router, type Express, type Request, type Response } from "express";
import nodemailer from "nodemailer";

const privacyRecipients = ["oj@c21citrus.com", "gabi@c21citrus.com"];
const requestLabels: Record<string, string> = { know: "Right to Know", delete: "Right to Delete", correct: "Right to Correct", optout: "Right to Opt-Out", limit: "Limit Use of Sensitive Information", nondiscrimination: "Right to Non-Discrimination" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

function privacyTransport() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s/g, "");
  if (!user || !pass) throw new Error("SMTP is not configured");
  return { user, transporter: nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass } }) };
}

export function registerPrivacyRequestRoute(app: Express): void {
  const router = Router();
  router.post("/api/privacy-request", async (req: Request, res: Response) => {
    try {
      const { requestType, firstName, lastName, email, phone = "", relationship = "consumer", description = "", agentName = "", verified } = req.body as Record<string, string>;
      if (!requestType || !firstName || !lastName || !email) return res.status(400).json({ error: "Missing required fields." });
      if (!verified || verified === "false") return res.status(400).json({ error: "Identity verification checkbox is required." });
      if (!emailPattern.test(email)) return res.status(400).json({ error: "Invalid email address." });

      const label = requestLabels[requestType] ?? requestType;
      const { user, transporter } = privacyTransport();
      const safeName = escapeHtml(`${firstName} ${lastName}`);
      const safeEmail = escapeHtml(email);
      const details = `<p><strong>Request type:</strong> ${escapeHtml(label)}</p><p><strong>Requester:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><p><strong>Relationship:</strong> ${escapeHtml(relationship)}</p><p><strong>Agent:</strong> ${escapeHtml(agentName)}</p><p><strong>Details:</strong><br>${escapeHtml(description)}</p>`;
      await transporter.sendMail({ from: `"Century 21 Citrus Realty Website" <${user}>`, to: privacyRecipients.join(", "), replyTo: `"${firstName} ${lastName}" <${email}>`, subject: `[Privacy Request] ${label} — ${firstName} ${lastName}`, html: `<main><h1>Privacy Request Received</h1>${details}</main>` });
      await transporter.sendMail({ from: `"Century 21 Citrus Realty" <${user}>`, to: `"${firstName} ${lastName}" <${email}>`, subject: "Privacy Request Received — Century 21 Citrus Realty", html: `<main><p>Hi ${escapeHtml(firstName)},</p><p>We received your ${escapeHtml(label)} request and will verify your identity before responding.</p></main>` });
      return res.json({ ok: true });
    } catch (error) {
      console.error("[PrivacyRequest]", error);
      return res.status(500).json({ error: "Failed to submit request. Please email operations@c21citrus.com directly." });
    }
  });
  app.use(router);
}
