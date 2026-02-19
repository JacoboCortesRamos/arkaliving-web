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

async function uploadToCloudinary(
  file: File,
  opts: { folder: string; publicId?: string },
) {
  const cloudName = requireEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = requireEnv("CLOUDINARY_API_KEY");
  const apiSecret = requireEnv("CLOUDINARY_API_SECRET");

  const timestamp = Math.floor(Date.now() / 1000);

  // Firma Cloudinary: params ordenados alfabéticamente + api_secret (SHA1)
  // Firmamos: folder, public_id (si existe), timestamp
  const paramsToSign = [
    `folder=${opts.folder}`,
    opts.publicId ? `public_id=${opts.publicId}` : null,
    `timestamp=${timestamp}`,
  ].filter(Boolean) as string[];

  const signature = sha1(paramsToSign.join("&") + apiSecret);

  const fileData = await fileToBase64DataUri(file);

  const body = new URLSearchParams();
  body.set("file", fileData);
  body.set("api_key", apiKey);
  body.set("timestamp", String(timestamp));
  body.set("signature", signature);
  body.set("folder", opts.folder);
  if (opts.publicId) body.set("public_id", opts.publicId);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body },
  );

  const out = await res.json();
  if (!res.ok) {
    throw new Error(out?.error?.message || "Cloudinary upload failed");
  }

  return {
    secure_url: out.secure_url as string,
    public_id: out.public_id as string,
  };
}

export async function POST(req: Request) {
  // =========================
  // 1) Token verification
  // =========================
  const secret = process.env.FORM_TOKEN_SECRET;
  if (!secret) return json("Falta FORM_TOKEN_SECRET en env.", 500);

  const form = await req.formData();
  const verifiedToken = String(form.get("verifiedToken") || "");
  const payloadStr = String(form.get("payload") || "");

  if (!verifiedToken) return json("Falta verifiedToken.");
  if (!payloadStr) return json("Falta payload.");

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

  // =========================
  // 2) Photos validation
  // =========================
  const photos = form.getAll("photos") as File[];
  const MIN_FILES = 3;
  const MAX_FILES = 10;
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

  // =========================
  // 3) Upload to Cloudinary
  // =========================
  const submissionId = crypto.randomBytes(10).toString("hex"); // único para TODO el submit
  let photoUrls: string[] = [];

  try {
    // valida env
    requireEnv("CLOUDINARY_CLOUD_NAME");
    requireEnv("CLOUDINARY_API_KEY");
    requireEnv("CLOUDINARY_API_SECRET");

    const baseFolder = process.env.CLOUDINARY_FOLDER || "arka/postula";
    const email = String(payload?.owner?.email || "unknown").toLowerCase();
    const emailHash = sha1(email).slice(0, 10);
    const ym = new Date().toISOString().slice(0, 7); // YYYY-MM
    const folder = `${baseFolder}/${ym}/${emailHash}`;

    const uploads = await Promise.all(
      photos.map((f, idx) =>
        uploadToCloudinary(f, {
          folder,
          publicId: `${submissionId}_photo_${idx + 1}`,
        }),
      ),
    );

    photoUrls = uploads.map((u) => u.secure_url);
  } catch (e: any) {
    console.error("Cloudinary error:", e?.message || e);
    return json(
      "No se pudieron subir las fotos. Intenta de nuevo en unos minutos.",
      500,
    );
  }

  // =========================
  // 4) Email sending (Resend)
  // =========================
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const internalTo = process.env.POSTULA_INTERNAL_TO;
  const ownerTo = payload?.owner?.email;

  const p = payload.property;

  const summary = `
ARKA - Nueva postulación recibida
ID de postulación: ${submissionId}

==============================
PROPIETARIO
==============================
Nombre: ${payload.owner.fullName}
Correo: ${payload.owner.email}
Celular: ${payload.owner.phone}

==============================
UBICACIÓN
==============================
Ciudad: ${p.city}
Localidad Bogotá: ${p.bogotaLocalidad || "N/A"}
Sector SM: ${p.sectorGroup || "N/A"}
Subsector SM: ${p.sectorSub || "N/A"}
Descripción libre: ${p.sectorFreeText || "N/A"}

==============================
TIPO DE PROPIEDAD
==============================
Tipo: ${p.type}
Habitaciones: ${p.rooms ?? "N/A"}
Baños: ${p.baths ?? "N/A"}
Otro tipo descripción: ${p.otherTypeText || "N/A"}

==============================
CONDICIONES
==============================
Amoblada: ${p.furnished}
Propiedad Horizontal: ${p.isHOA}
Permite rentas cortas: ${p.hoaAllowsSTR || "N/A"}

==============================
OPERACIÓN
==============================
Estado actual: ${payload.ops.currentStatus}
Disponible desde: ${payload.ops.startWhen}

==============================
EXPECTATIVA
==============================
${payload.expectation.goal}

==============================
FOTOS (Cloudinary)
==============================
${photoUrls.map((u, i) => `${i + 1}) ${u}`).join("\n")}
`;

  // correo interno
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

  // confirmación al propietario (sin links por privacidad)
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

  // =========================
  // 5) Response
  // =========================
  return NextResponse.json({ ok: true, submissionId, photoUrls });
}
