import { NextResponse } from "next/server";
import crypto from "crypto";

function json(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

function signHmac(data: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

function sha1(input: string) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Falta ${name} en env.`);
  return v;
}

async function fileToBase64DataUri(file: File) {
  const ab = await file.arrayBuffer();
  const buf = Buffer.from(ab);
  const b64 = buf.toString("base64");
  return `data:${file.type};base64,${b64}`;
}

function formatPhoneFolder(phoneE164: string) {
  const s = String(phoneE164 || "").trim();
  const m = s.match(/^(\+?)(\d{1,4})(\d+)$/);
  if (!m) return "unknown-phone";
  const cc = m[2];
  const rest = m[3];
  return `${cc}-${rest}`;
}

async function uploadToCloudinary(
  file: File,
  opts: { folder: string; publicId: string; overwrite: boolean },
) {
  const cloudName = requireEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = requireEnv("CLOUDINARY_API_KEY");
  const apiSecret = requireEnv("CLOUDINARY_API_SECRET");
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign = [
    `folder=${opts.folder}`,
    `overwrite=${opts.overwrite ? "true" : "false"}`,
    `public_id=${opts.publicId}`,
    `timestamp=${timestamp}`,
  ];

  const signature = sha1(paramsToSign.join("&") + apiSecret);
  const fileData = await fileToBase64DataUri(file);

  const body = new URLSearchParams();
  body.set("file", fileData);
  body.set("api_key", apiKey);
  body.set("timestamp", String(timestamp));
  body.set("signature", signature);
  body.set("folder", opts.folder);
  body.set("public_id", opts.publicId);
  body.set("overwrite", opts.overwrite ? "true" : "false");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body },
  );

  const out = await res.json();
  if (!res.ok)
    throw new Error(out?.error?.message || "Cloudinary upload failed");

  return {
    secure_url: out.secure_url as string,
    public_id: out.public_id as string,
  };
}

export async function POST(req: Request) {
  const secret = process.env.FORM_TOKEN_SECRET;
  if (!secret) return json("Falta FORM_TOKEN_SECRET en env.", 500);

  const form = await req.formData();
  const verifiedToken = String(form.get("verifiedToken") || "");
  const payloadStr = String(form.get("payload") || "");
  const submissionId = String(form.get("submissionId") || "");

  if (!verifiedToken) return json("Falta verifiedToken.");
  if (!payloadStr) return json("Falta payload.");
  if (!submissionId) return json("Falta submissionId.");

  // 1) Verificar token
  const [b64, sig] = verifiedToken.split(".");
  if (!b64 || !sig) return json("verifiedToken inválido.");

  const tokenPayloadStr = Buffer.from(b64, "base64url").toString("utf8");
  if (signHmac(tokenPayloadStr, secret) !== sig)
    return json("verifiedToken inválido.");

  const tokenPayload = JSON.parse(tokenPayloadStr);
  if (!tokenPayload.verified) return json("Correo no verificado.");
  if (Date.now() > tokenPayload.exp)
    return json("Sesión expirada, valida tu correo de nuevo.");

  const payload = JSON.parse(payloadStr);

  // 2) Validar fotos (min 2 / max 5)
  const photos = form.getAll("photos") as File[];
  const MIN_FILES = 2;
  const MAX_FILES = 5;
  const MAX_MB = 10;

  if (!photos?.length || photos.length < MIN_FILES) {
    return json(`Debes subir al menos ${MIN_FILES} fotos.`);
  }
  if (photos.length > MAX_FILES) {
    return json(`Máximo ${MAX_FILES} fotos.`);
  }

  for (const f of photos) {
    if (!f.type?.startsWith("image/"))
      return json("Solo se permiten imágenes.");
    const sizeMb = f.size / (1024 * 1024);
    if (sizeMb > MAX_MB)
      return json(`Cada foto debe pesar máximo ${MAX_MB}MB.`);
  }

  const disableIdempotency =
    process.env.NODE_ENV !== "production" &&
    process.env.POSTULA_DISABLE_IDEMPOTENCY === "1";

  // 3) Upload Cloudinary
  let photoUrls: string[] = [];
  try {
    requireEnv("CLOUDINARY_CLOUD_NAME");
    requireEnv("CLOUDINARY_API_KEY");
    requireEnv("CLOUDINARY_API_SECRET");

    const baseFolder = process.env.CLOUDINARY_FOLDER || "arka/postula";
    const phoneE164 = String(payload?.owner?.phone || "");
    const phoneFolder = formatPhoneFolder(phoneE164);

    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, "0");

    const folder = `${baseFolder}/${yyyy}/${mm}/${phoneFolder}`;

    const requestId = disableIdempotency
      ? crypto.randomBytes(6).toString("hex")
      : "";

    const uploads = await Promise.all(
      photos.map((f, idx) =>
        uploadToCloudinary(f, {
          folder,
          publicId: disableIdempotency
            ? `${submissionId}_${requestId}_photo_${idx + 1}`
            : `${submissionId}_photo_${idx + 1}`,
          overwrite: disableIdempotency ? true : false,
        }),
      ),
    );

    photoUrls = uploads.map((u) => u.secure_url);
  } catch (e: any) {
    const msg = String(e?.message || e);
    console.error("Cloudinary error:", msg);

    if (process.env.NODE_ENV !== "production") {
      return json(`Cloudinary: ${msg}`, 500);
    }

    return json(
      "No se pudieron subir las fotos. Intenta de nuevo en unos minutos.",
      500,
    );
  }

  // 4) Emails vía Resend
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const internalTo = process.env.POSTULA_INTERNAL_TO;
  const ownerTo = payload?.owner?.email;

  const p = payload.property;

  const summary = `
ARKA - Nueva postulación recibida
ID de postulación: ${submissionId}

PROPIETARIO
Nombre: ${payload.owner.fullName}
Correo: ${payload.owner.email}
Celular: ${payload.owner.phone}

UBICACIÓN
Ciudad: ${p.city}
// TODO (multi-ciudad): Localidad Bogotá: ${p.bogotaLocalidad || "N/A"}
Sector SM: ${p.sectorGroup || "N/A"}
Subsector SM: ${p.sectorSub || "N/A"}
Descripción libre: ${p.sectorFreeText || "N/A"}

TIPO
Tipo: ${p.type}
Habitaciones: ${p.rooms ?? "N/A"}
Baños: ${p.baths ?? "N/A"}
Otro tipo: ${p.otherTypeText || "N/A"}

CONDICIONES
Amoblada: ${p.furnished}
PH: ${p.isHOA}
Permite STR: ${p.hoaAllowsSTR || "N/A"}

OPERACIÓN
Estado: ${payload.ops.currentStatus}
Inicio: ${payload.ops.startWhen}

EXPECTATIVA
${payload.expectation.goal}

FOTOS (Cloudinary)
${photoUrls.map((u, i) => `${i + 1}) ${u}`).join("\n")}
`;

  if (resendKey && from && internalTo) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: internalTo,
        subject: "Nueva postulación de propiedad - ARKA",
        text: summary,
      }),
    });
  } else {
    console.log("[DEV] Nueva postulación:", summary);
  }

  if (resendKey && from && ownerTo) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: ownerTo,
        subject: "Recibimos tu postulación - ARKA Living",
        html: `<p>¡Gracias por postular tu propiedad!</p>
               <p>Revisaremos tu información y te contactaremos en un plazo máximo de <strong>48 horas</strong>.</p>
               <p>ARKA Living</p>`,
      }),
    });
  }

  return NextResponse.json({ ok: true, submissionId, photoUrls });
}
