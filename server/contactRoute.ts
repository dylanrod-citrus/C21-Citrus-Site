import type { Express, Request, Response } from "express";
import { sendContactEmails, type ContactFormData } from "./contact";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function registerContactRoute(app: Express): void {
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const { name, email, phone, subject, message, recipientOverride } = req.body as Partial<ContactFormData> & { recipientOverride?: string };
      if (!name || typeof name !== "string" || !name.trim()) return res.status(400).json({ success: false, error: "Name is required." });
      if (!email || typeof email !== "string" || !emailPattern.test(email)) return res.status(400).json({ success: false, error: "A valid email address is required." });
      if (!message || typeof message !== "string" || !message.trim()) return res.status(400).json({ success: false, error: "Message is required." });

      await sendContactEmails({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone?.trim() || undefined, subject: subject?.trim() || undefined, message: message.trim() }, typeof recipientOverride === "string" ? recipientOverride : undefined);
      return res.json({ success: true });
    } catch (error) {
      console.error("[/api/contact]", error);
      return res.status(500).json({ success: false, error: "Failed to send your message. Please try again or call us at 909.592.8500." });
    }
  });
}
