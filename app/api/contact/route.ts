import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

export const runtime = "edge";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = process.env.CONTACT_TO_EMAIL ?? "simonesanna.lavoro@gmail.com";
const FROM_DOMAIN = process.env.FROM_DOMAIN ?? "onboarding@resend.dev";
const FROM_NAME = process.env.FROM_NAME ?? "Portfolio Simone Sanna";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "invalid body" }, { status: 400 });

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "validation failed" }, { status: 422 });
  }

  const { name, email, subject, message, _honeypot } = parsed.data;

  if (_honeypot) return Response.json({ ok: true });

  const subjectLine = subject
    ? `[Portfolio] ${subject}`
    : `[Portfolio] Messaggio da ${name}`;

  const { error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_DOMAIN}>`,
    to: TO,
    replyTo: email,
    subject: subjectLine,
    text: `Nome: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<p><strong>Nome:</strong> ${name}<br><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p><p>${message.replace(/\n/g, "<br>")}</p>`,
  });

  if (error) {
    console.error("Resend error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
