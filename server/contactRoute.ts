import type { Express, Request, Response } from "express";
import { sendContactEmails, type ContactFormData } from "./contact";
import { validateEmailFormSubmission } from "./formSecurity";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function registerContactRoute(app: Express): void {
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const formSecurity = await validateEmailFormSubmission(req, "contact");
      if (!formSecurity.allowed) {
        if (formSecurity.trap) return res.json({ success: true });
        return res.status(formSecurity.status).json({ success: false, error: formSecurity.error });
      }

      const { name, email, phone, subject, message, recipientOverride } = req.body as Partial<ContactFormData> & { recipientOverride?: string };
      if (!name || typeof name !== "string" || !name.trim()) return res.status(400).json({ success: false, error: "Name is required." });
      if (!email || typeof email !== "string" || !emailPattern.test(email)) return res.status(400).json({ success: false, error: "A valid email address is required." });
      if (!message || typeof message !== "string" || !message.trim()) return res.status(400).json({ success: false, error: "Message is required." });
      if (name.length > 160 || email.length > 254 || message.length > 5_000 || (typeof phone === "string" && phone.length > 50) || (typeof subject === "string" && subject.length > 200) || (typeof recipientOverride === "string" && recipientOverride.length > 250)) {
        return res.status(400).json({ success: false, error: "One or more fields are too long. Please shorten your message and try again." });
      }

      await sendContactEmails({ name: name.trim(), email: email.trim().toLowerCase(), phone: typeof phone === "string" ? phone.trim() || undefined : undefined, subject: typeof subject === "string" ? subject.trim() || undefined : undefined, message: message.trim() }, typeof recipientOverride === "string" ? recipientOverride : undefined);
      return res.json({ success: true });
    } catch (error) {
      console.error("[/api/contact]", error);
      return res.status(500).json({ success: false, error: "Failed to send your message. Please try again or call us at 909.592.8500." });
    }
  });
}
