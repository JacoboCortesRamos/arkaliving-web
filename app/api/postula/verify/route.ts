import { NextResponse } from "next/server";
import crypto from "crypto";

function json(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}
function sign(data: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

export async function POST(req: Request) {
  const { token, code } = await req.json();
  const secret = process.env.FORM_TOKEN_SECRET;
  if (!secret) return json("Falta FORM_TOKEN_SECRET en env.", 500);
  if (!token || !code) return json("Token y código requeridos.");

  const [b64, sig] = String(token).split(".");
  if (!b64 || !sig) return json("Token inválido.");

  const payloadStr = Buffer.from(b64, "base64url").toString("utf8");
  if (sign(payloadStr, secret) !== sig) return json("Token inválido.");

  const payload = JSON.parse(payloadStr);
  if (Date.now() > payload.exp) return json("Código expirado.");

  const codeHash = sign(String(code).trim(), secret);
  if (codeHash !== payload.codeHash) return json("Código incorrecto.");

  const verifiedPayload = JSON.stringify({
    email: payload.email,
    verified: true,
    exp: Date.now() + 60 * 60 * 1000,
  });
  const verifiedToken =
    Buffer.from(verifiedPayload).toString("base64url") +
    "." +
    sign(verifiedPayload, secret);

  return NextResponse.json({ verifiedToken });
}
