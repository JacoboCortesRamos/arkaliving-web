import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas/contact";

// ─── Rate limiting en memoria (MVP) ───────────────────────────────────────────
// Map: ip → timestamps de envíos recientes
// Limitación conocida: se resetea en cold start. Cloudflare WAF es la primera línea.
const rateMap = new Map<string, number[]>();
const RATE_LIMIT = 3; // máximo 3 envíos
const RATE_WINDOW = 10 * 60 * 1000; // en 10 minutos

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW,
  );

  if (timestamps.length >= RATE_LIMIT) return true;

  rateMap.set(ip, [...timestamps, now]);
  return false;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  // IP del cliente (Vercel pone la IP real en x-forwarded-for)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        message: "Demasiados intentos. Espera unos minutos e intenta de nuevo.",
      },
      { status: 429 },
    );
  }

  // Parsear body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Body inválido." }, { status: 400 });
  }

  // Validar con Zod (server-side, siempre)
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos.";
    return NextResponse.json({ message: firstError }, { status: 422 });
  }

  const { from, subject, message } = parsed.data;

  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM;
  // Destino temporal hasta tener el correo oficial de ARKA
  const to = process.env.CONTACT_TO ?? "jacobocortes90@hotmail.com";

  if (!resendKey || !resendFrom) {
    // DEV fallback — no bloquear en local
    console.log("[DEV] Contacto recibido:", { from, subject, message });
    return NextResponse.json({ success: true });
  }

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #4a3424;">
      <h2 style="font-size: 22px; margin-bottom: 4px;">Nuevo mensaje de contacto</h2>
      <p style="color: #a77e4d; margin-top: 0; font-size: 14px;">arkaliving.co — Formulario de contacto</p>
      <hr style="border: none; border-top: 1px solid #c8a67a; margin: 20px 0;" />

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-size: 13px; color: #6f5b4b; width: 110px; vertical-align: top;">De</td>
          <td style="padding: 8px 0; font-size: 15px; color: #4a3424; font-weight: 600;">${from}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; color: #6f5b4b; vertical-align: top;">Asunto</td>
          <td style="padding: 8px 0; font-size: 15px; color: #4a3424;">${subject}</td>
        </tr>
      </table>

      <hr style="border: none; border-top: 1px solid #c8a67a; margin: 20px 0;" />

      <p style="font-size: 13px; color: #6f5b4b; margin-bottom: 8px;">Mensaje</p>
      <p style="font-size: 16px; line-height: 1.7; color: #4a3424; white-space: pre-wrap;">${message}</p>

      <hr style="border: none; border-top: 1px solid #c8a67a; margin: 32px 0 20px;" />
      <p style="font-size: 12px; color: #a77e4d;">ARKA Living · arkaliving.co</p>
    </div>
  `;

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFrom,
      to,
      subject: `[ARKA Contacto] ${subject}`,
      html,
      reply_to: from.includes("@") ? from : undefined,
    }),
  });

  if (!resendRes.ok) {
    const err = await resendRes.text();
    console.error("[Resend] Error al enviar contacto:", err);
    return NextResponse.json(
      { message: "No se pudo enviar el mensaje. Intenta de nuevo." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
