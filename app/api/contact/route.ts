import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

export const runtime = "edge";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = process.env.CONTACT_TO_EMAIL ?? "hello@simonesanna.it";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "invalid body" }, { status: 400 });

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "validation failed" }, { status: 422 });
  }

  const { name, email, subject, message, _honeypot } = parsed.data;

  // silently drop spam
  if (_honeypot) return Response.json({ ok: true });

  const subjectLine = subject
    ? `[Portfolio] ${subject}`
    : `[Portfolio] Messaggio da ${name}`;

  await resend.emails.send({
    from: "Portfolio <noreply@simonesanna.it>",
    to: TO,
    replyTo: email,
    subject: subjectLine,
    text: `Nome: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<p><strong>Nome:</strong> ${name}<br><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p><p>${message.replace(/\n/g, "<br>")}</p>`,
  });

  await resend.emails.send({
    from: "Simone Sanna <noreply@simonesanna.it>",
    to: email,
    subject: "Ho ricevuto il tuo messaggio",
    text: `Ciao ${name},\n\nho ricevuto il tuo messaggio e ti risponderò entro 48 ore.\n\nSimone`,
    html: `<p>Ciao ${name},</p><p>ho ricevuto il tuo messaggio e ti risponderò entro 48 ore.</p><p>Simone</p>`,
  });

  return Response.json({ ok: true });
}
