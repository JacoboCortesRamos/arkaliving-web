import { NextResponse } from "next/server";
import crypto from "crypto";

function json(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function sign(data: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

export async function POST(req: Request) {
  const { fullName, email, phone } = await req.json();

  if (!fullName?.trim()) return json("Nombre requerido.");
  if (!isEmail(email || "")) return json("Correo inválido.");
  if (!phone?.trim()) return json("Celular/WhatsApp requerido.");

  const secret = process.env.FORM_TOKEN_SECRET;
  if (!secret) return json("Falta FORM_TOKEN_SECRET en env.", 500);

  const code = String(Math.floor(100000 + Math.random() * 900000)); // 6 dígitos
  const exp = Date.now() + 10 * 60 * 1000; // 10 min

  const payload = JSON.stringify({
    email: email.trim().toLowerCase(),
    exp,
    codeHash: sign(code, secret),
  });
  const token =
    Buffer.from(payload).toString("base64url") + "." + sign(payload, secret);

  // Email (Resend) — MVP
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = email.trim().toLowerCase();

  if (resendKey && from) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: "Tu código de verificación - ARKA Living",
        html: `<p>Tu código de verificación es:</p><p style="font-size:24px;font-weight:800;letter-spacing:2px">${code}</p><p>Vence en 10 minutos.</p>`,
      }),
    });
  } else {
    // DEV fallback
    console.log("[DEV] OTP code:", code, "for", to);
  }

  return NextResponse.json({ token });
}
