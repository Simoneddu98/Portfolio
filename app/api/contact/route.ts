import { contactSchema } from "@/lib/contact-schema";

export const runtime = "edge";

const ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY!;

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

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      name,
      email,
      replyto: email,
      subject: subjectLine,
      message: `Nome: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.success) {
    console.error("Web3Forms error:", data);
    return Response.json({ error: data.message ?? "invio fallito" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
