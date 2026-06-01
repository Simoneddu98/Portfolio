const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL!;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "invalid body" }, { status: 400 });

  const { nome, email, messaggio } = body;
  if (!nome || !email || !messaggio) {
    return Response.json({ error: "missing fields" }, { status: 422 });
  }

  let res: Response;
  try {
    res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, messaggio }),
      signal: AbortSignal.timeout(25_000),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Apps Script unreachable:", msg);
    return Response.json({ error: "apps script unreachable" }, { status: 502 });
  }

  const text = await res.text();
  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(text);
  } catch {
    console.error("Apps Script non-JSON response:", text.slice(0, 300));
    return Response.json({ error: "risposta non valida da apps script" }, { status: 502 });
  }

  if (data.status !== "success") {
    console.error("Apps Script error:", data);
    return Response.json({ error: data.message ?? "invio fallito" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
