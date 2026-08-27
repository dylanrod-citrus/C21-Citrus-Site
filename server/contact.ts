import nodemailer from "nodemailer";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

const routeRecipientEmails = new Set([
  "andrew@c21citrus.com",
  "frontdesk@c21citrus.com",
  "janeth@c21citrus.com",
]);

function splitEmails(value: string | undefined): string[] {
  return (value ?? "").split(",").map((email) => email.trim().toLowerCase()).filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
}

export function resolveContactRecipients(recipientOverride?: string): string[] {
  const requested = splitEmails(recipientOverride);
  if (requested.length > 0 && requested.every((email) => routeRecipientEmails.has(email))) return requested;
  return splitEmails(process.env.CONTACT_RECIPIENTS);
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function createTransporter() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS?.replace(/\s/g, "");
  if (!smtpUser || !smtpPass) throw new Error("SMTP_USER and SMTP_PASS must be configured");
  return { smtpUser, transporter: nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user: smtpUser, pass: smtpPass } }) };
}

export async function verifyContactTransport(): Promise<void> {
  const { transporter } = createTransporter();
  await transporter.verify();
}

export async function sendContactEmails(data: ContactFormData, recipientOverride?: string): Promise<void> {
  const recipients = resolveContactRecipients(recipientOverride);
  if (!recipients.length) throw new Error("No contact recipients configured");
  const { smtpUser, transporter } = createTransporter();
  const subject = data.subject ? `New Contact Form: ${data.subject}` : `New Contact Form Submission from ${data.name}`;
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = data.phone ? escapeHtml(data.phone) : "Not provided";
  const safeMessage = escapeHtml(data.message);

  await transporter.sendMail({
    from: `"Century 21 Citrus Realty Website" <${smtpUser}>`,
    to: recipients.join(", "),
    replyTo: `"${data.name}" <${data.email}>`,
    subject,
    html: `<main style="font-family:Arial,sans-serif;max-width:640px;margin:auto"><header style="background:#171717;color:#c8a951;padding:24px;text-align:center;font-weight:700">CENTURY 21 CITRUS REALTY</header><section style="padding:28px;background:#fff"><h1 style="font-size:22px">${escapeHtml(subject)}</h1><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p><p><strong>Phone:</strong> ${safePhone}</p><p><strong>Message:</strong></p><p style="white-space:pre-wrap">${safeMessage}</p></section></main>`,
  });

  await transporter.sendMail({
    from: `"Century 21 Citrus Realty" <${smtpUser}>`,
    to: `"${data.name}" <${data.email}>`,
    subject: "We received your message — Century 21 Citrus Realty",
    html: `<main style="font-family:Arial,sans-serif;max-width:640px;margin:auto"><header style="background:#171717;color:#c8a951;padding:24px;text-align:center;font-weight:700">CENTURY 21 CITRUS REALTY</header><section style="padding:28px;background:#fff"><p>Hi ${safeName},</p><p>Thank you for contacting Century 21 Citrus Realty. We have received your message and a member of our team will be in touch shortly.</p><p>For immediate assistance, call 909.592.8500.</p></section></main>`,
  });
}
