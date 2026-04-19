"use client";

import { useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import styles from "./PropertyApplicationForm.module.css";

// TODO (multi-ciudad): cuando se reactive Bogotá, descomentar este tipo
// type City = "Bogotá" | "Santa Marta";
type City = "Santa Marta";

// TODO (multi-ciudad): descomentar cuando se active Bogotá
// const BOGOTA_LOCALIDADES = [
//   "Usaquén",
//   "Chapinero",
//   "Santa Fe",
//   "San Cristóbal",
//   "Usme",
//   "Tunjuelito",
//   "Bosa",
//   "Kennedy",
//   "Fontibón",
//   "Engativá",
//   "Suba",
//   "Barrios Unidos",
//   "Teusaquillo",
//   "Los Mártires",
//   "Antonio Nariño",
//   "Puente Aranda",
//   "La Candelaria",
//   "Rafael Uribe Uribe",
//   "Ciudad Bolívar",
//   "Sumapaz",
// ];

const SM_SECTORES: Array<{
  group: string;
  subs?: string[];
  freeText?: boolean;
}> = [
  {
    group: "Centro",
    subs: ["Centro Histórico", "El Centro", "Pescaíto", "San Francisco"],
  },
  {
    group: "Rodadero – Gaira",
    subs: [
      "El Rodadero",
      "Rodadero Sur",
      "Rodadero Reservado",
      "Gaira",
      "Playa Salguero",
    ],
  },
  {
    group: "Corredor Pozos Colorados – Bello Horizonte",
    subs: ["Pozos Colorados", "Bello Horizonte", "Aeropuerto", "Cabo Tortuga"],
  },
  {
    group: "Zona Urbana Tradicional",
    subs: [
      "Bavaria",
      "Los Almendros",
      "Jardín",
      "María Eugenia",
      "Mamatoco",
      "Olaya Herrera",
    ],
  },
  { group: "Zonas Alternativas", subs: ["Taganga", "Bonda"] },
  { group: "Otro / No estoy seguro", freeText: true },
];

// ✅ Lista reducida + "Otro"
const COUNTRY_CODES = [
  { label: "Colombia (+57)", code: "+57" },
  { label: "Estados Unidos (+1)", code: "+1" },
  { label: "Canadá (+1)", code: "+1" },
  { label: "México (+52)", code: "+52" },
  { label: "España (+34)", code: "+34" },
  { label: "Panamá (+507)", code: "+507" },
  { label: "Venezuela (+58)", code: "+58" },
  { label: "Brasil (+55)", code: "+55" },
  { label: "Perú (+51)", code: "+51" },
  { label: "Otro", code: "OTHER" },
] as const;

// [FIX #3] Tipos MIME permitidos explícitamente en el selector de fotos
const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

// [FIX #2] Límite de tamaño antes de intentar comprimir (rechaza archivos absurdos)
const MAX_INPUT_MB = 50;

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function onlyDigits(v: string) {
  return v.replace(/[^\d]/g, "");
}

function normalizeCountryCode(raw: string) {
  const s = raw.trim();
  if (!s) return "";
  const withPlus = s.startsWith("+") ? s : `+${s}`;
  return "+" + onlyDigits(withPlus);
}

type PhotoItem = { id: string; file: File; url: string };

function makeClientId() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c: any = globalThis.crypto;
  return (
    c?.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`
  );
}

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 4.8,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.8,
    });

    const safeName =
      file.name && file.name.trim() ? file.name : `photo-${Date.now()}.jpg`;

    return new File([compressed], safeName, {
      type: compressed.type || file.type || "image/jpeg",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Error compressing image:", error);
    return file;
  }
}

export function PropertyApplicationForm() {
  const router = useRouter();
  const pathname = usePathname();

  const [step, setStep] = useState<number>(1);

  const [startToken, setStartToken] = useState<string | null>(null);
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);

  // page 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // phone with country code
  const [countryCode, setCountryCode] = useState<string>("+57");
  const [otherCountryCode, setOtherCountryCode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // otp
  const [otp, setOtp] = useState("");

  // page 2
  const [city, setCity] = useState<City | "">("");
  // TODO (multi-ciudad): descomentar cuando se active Bogotá
  // const [bogotaLocalidad, setBogotaLocalidad] = useState("");
  const [smSectorGroup, setSmSectorGroup] = useState("");
  const [smSectorSub, setSmSectorSub] = useState("");
  const [smSectorFreeText, setSmSectorFreeText] = useState("");

  const [propertyType, setPropertyType] = useState<
    "" | "Studio o único espacio" | "Apartamento" | "Casa" | "Otro"
  >("");
  const [rooms, setRooms] = useState<number | "">("");
  const [baths, setBaths] = useState<number | "">("");
  const [otherTypeText, setOtherTypeText] = useState("");

  const [furnished, setFurnished] = useState<"" | "Sí" | "Parcialmente" | "No">(
    "",
  );
  const [isHOA, setIsHOA] = useState<"" | "Sí" | "No">("");
  const [hoaAllowsSTR, setHoaAllowsSTR] = useState<
    "" | "Sí" | "No" | "No estoy seguro"
  >("");

  // page 3
  const [currentStatus, setCurrentStatus] = useState<
    "" | "Desocupada" | "Arrendada a largo plazo" | "Ya en Airbnb / Booking"
  >("");
  const [startWhen, setStartWhen] = useState<
    "" | "Inmediato" | "En 1–3 meses" | "Más adelante"
  >("");

  // page 4
  const [goal, setGoal] = useState<
    | ""
    | "Ingreso fijo mensual"
    | "Ingreso optimizado por noche"
    | "Mezcla de ambos"
    | "Aún no lo tengo claro"
  >("");

  // page 5 photos
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const MIN_PHOTOS = 3;
  const MAX_PHOTOS = 5;
  const minPhotosOk = photos.length >= MIN_PHOTOS;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitPhase, setSubmitPhase] = useState<
    "idle" | "compressing" | "sending"
  >("idle");
  const submissionIdRef = useRef<string | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const smGroupObj = useMemo(
    () => SM_SECTORES.find((s) => s.group === smSectorGroup),
    [smSectorGroup],
  );

  function goHomeStage0() {
    const fire = () => window.dispatchEvent(new Event("arka:hero:stage0"));

    if (pathname !== "/") {
      router.push("/");
      window.setTimeout(fire, 80);
    } else {
      fire();
    }
  }

  function closeSuccessAndGoHome() {
    setShowSuccess(false);
    goHomeStage0();
  }

  function back() {
    if (step === 1.5) setStep(1);
    else setStep((s) => Math.max(1, s - 1));
  }

  function validateStepOrAlert(current: number): boolean {
    if (current === 2) {
      if (!city) return (alert("Selecciona la ciudad."), false);

      // TODO (multi-ciudad): descomentar cuando se active Bogotá
      // if (city === "Bogotá" && !bogotaLocalidad)
      //   return (alert("Selecciona la localidad."), false);

      if (city === "Santa Marta") {
        if (!smSectorGroup) return (alert("Selecciona el sector."), false);
        if (smGroupObj?.subs?.length && !smSectorSub)
          return (alert("Selecciona el sub-sector."), false);
        if (smGroupObj?.freeText && !smSectorFreeText.trim())
          return (
            alert("Describe la ubicación general (máx. 50 palabras)."),
            false
          );
      }

      if (!propertyType)
        return (alert("Selecciona el tipo de propiedad."), false);

      const needsRoomsBaths =
        propertyType === "Apartamento" || propertyType === "Casa";
      if (needsRoomsBaths && (rooms === "" || baths === ""))
        return (alert("Indica habitaciones y baños."), false);

      if (propertyType === "Otro" && !otherTypeText.trim())
        return (alert("Describe el tipo (máx. 50 palabras)."), false);

      if (!furnished) return (alert("Indica si está amoblada."), false);
      if (!isHOA)
        return (alert("Indica si hace parte de propiedad horizontal."), false);
      if (isHOA === "Sí" && !hoaAllowsSTR)
        return (alert("Indica si permite rentas cortas."), false);

      return true;
    }

    if (current === 3) {
      if (!currentStatus) return (alert("Indica el estado actual."), false);
      if (!startWhen)
        return (alert("Indica desde cuándo estaría disponible."), false);
      return true;
    }

    if (current === 4) {
      if (!goal) return (alert("Indica tu expectativa."), false);
      return true;
    }

    if (current === 5) {
      if (!minPhotosOk)
        return (
          alert(
            `Sube al menos ${MIN_PHOTOS} fotos (habitación principal y baño).`,
          ),
          false
        );
      return true;
    }

    return true;
  }

  function next() {
    if (!validateStepOrAlert(step)) return;
    setStep((s) => Math.min(5, s + 1));
  }

  function getFinalCountryCodeOrEmpty() {
    if (countryCode === "OTHER") return normalizeCountryCode(otherCountryCode);
    return countryCode;
  }

  async function startEmailVerification() {
    const phoneDigits = onlyDigits(phoneNumber);

    if (!fullName.trim()) return alert("Ingresa tu nombre completo.");
    if (!isEmail(email)) return alert("Ingresa un correo válido.");

    const cc = getFinalCountryCodeOrEmpty();
    if (!cc) return alert("Selecciona el indicativo del país.");
    if (countryCode === "OTHER" && !cc)
      return alert("Escribe el indicativo (ej: +49).");

    if (!phoneDigits) return alert("Ingresa tu número de celular o WhatsApp.");
    if (phoneDigits.length < 7)
      return alert("El número parece demasiado corto.");

    const phoneE164 = `${cc}${phoneDigits}`;

    if (!privacyAccepted) {
      return alert("Debes aceptar la Política de Privacidad para continuar.");
    }

    const res = await fetch("/api/postula/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone: phoneE164 }),
    });

    const data = await res.json();
    if (!res.ok)
      return alert(
        data?.message || "No se pudo enviar el correo de validación.",
      );

    setStartToken(data.token);
    setStep(1.5);
  }

  async function verifyCode() {
    if (!startToken) return alert("No hay verificación iniciada.");
    if (!otp.trim()) return alert("Ingresa el código.");

    const res = await fetch("/api/postula/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: startToken, code: otp.trim() }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data?.message || "Código inválido o expirado.");

    setVerifiedToken(data.verifiedToken);
    setStep(2);
  }

  // [FIX #2 + #3] Validar tipo MIME y tamaño máximo ANTES de agregar al estado
  function addPhotos(files: File[]) {
    const availableSlots = Math.max(0, MAX_PHOTOS - photos.length);
    const rejected: string[] = [];

    const validated = files.filter((f) => {
      if (!ALLOWED_PHOTO_TYPES.includes(f.type)) {
        rejected.push(
          `"${f.name}" tiene un formato no soportado (${f.type || "desconocido"}).`,
        );
        return false;
      }
      const sizeMb = f.size / (1024 * 1024);
      if (sizeMb > MAX_INPUT_MB) {
        rejected.push(
          `"${f.name}" es demasiado grande (${sizeMb.toFixed(0)}MB, máximo ${MAX_INPUT_MB}MB).`,
        );
        return false;
      }
      return true;
    });

    if (rejected.length > 0) {
      alert(
        `Las siguientes fotos no se pudieron agregar:\n\n${rejected.join("\n")}\n\nUsa archivos JPG, PNG o WebP de menos de ${MAX_INPUT_MB}MB.`,
      );
    }

    const toAdd = validated.slice(0, availableSlots).map((file) => {
      const id = makeClientId();
      const url = URL.createObjectURL(file);
      return { id, file, url };
    });

    setPhotos((prev) => [...prev, ...toAdd]);
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  async function submitAll() {
    if (isSubmitting) return;

    const verified = verifiedToken;
    if (!verified) return alert("Debes validar tu correo para continuar.");

    if (
      !validateStepOrAlert(2) ||
      !validateStepOrAlert(3) ||
      !validateStepOrAlert(4) ||
      !validateStepOrAlert(5)
    ) {
      return;
    }

    setIsSubmitting(true);

    if (!submissionIdRef.current) {
      submissionIdRef.current = makeClientId();
    }
    const submissionId = submissionIdRef.current;
    if (!submissionId) {
      setIsSubmitting(false);
      setSubmitPhase("idle");
      return alert("No se pudo generar el ID de envío. Intenta de nuevo.");
    }

    const needsRoomsBaths =
      propertyType === "Apartamento" || propertyType === "Casa";

    const cc = getFinalCountryCodeOrEmpty();
    if (!cc) {
      setIsSubmitting(false);
      setSubmitPhase("idle");
      return alert("Falta el indicativo del país.");
    }
    const phoneE164 = `${cc}${onlyDigits(phoneNumber)}`;

    const payload = {
      submissionId,
      owner: { fullName, email, phone: phoneE164 },
      property: {
        city,
        // TODO (multi-ciudad): descomentar cuando se active Bogotá
        // bogotaLocalidad: city === "Bogotá" ? bogotaLocalidad : null,
        sectorGroup: smSectorGroup || null,
        sectorSub: smSectorSub || null,
        sectorFreeText: smSectorFreeText || null,
        type: propertyType,
        rooms: needsRoomsBaths ? rooms : null,
        baths: needsRoomsBaths ? baths : null,
        otherTypeText: propertyType === "Otro" ? otherTypeText : null,
        furnished,
        isHOA,
        hoaAllowsSTR: isHOA === "Sí" ? hoaAllowsSTR : null,
      },
      ops: { currentStatus, startWhen },
      expectation: { goal },
    };

    try {
      // [FIX #1] setSubmitPhase("compressing") va INMEDIATAMENTE antes del Promise.all
      setSubmitPhase("compressing");
      const compressedFiles = await Promise.all(
        photos.map(async (p) => compressImage(p.file)),
      );

      setSubmitPhase("sending");

      const fd = new FormData();
      fd.append("verifiedToken", verified);
      fd.append("payload", JSON.stringify(payload));
      fd.append("submissionId", submissionId);

      compressedFiles.forEach((file) => fd.append("photos", file));

      // [FIX #4] Timeout global de 2 minutos para el fetch de submit
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120_000);

      let res: Response;
      try {
        res = await fetch("/api/postula/submit", {
          method: "POST",
          body: fd,
          signal: controller.signal,
        });
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        setIsSubmitting(false);
        setSubmitPhase("idle");
        if (fetchErr?.name === "AbortError") {
          return alert(
            "El envío tardó demasiado y fue cancelado. Verifica tu conexión e intenta de nuevo.",
          );
        }
        throw fetchErr;
      }
      clearTimeout(timeoutId);

      const raw = await res.text();
      let data: { message?: string } | null = null;

      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = { message: raw || "Respuesta inválida del servidor." };
      }

      if (!res.ok) {
        setIsSubmitting(false);
        setSubmitPhase("idle");

        if (res.status === 413) {
          return alert(
            "Las fotos pesan demasiado incluso después de optimizarlas. Intenta con imágenes más livianas.",
          );
        }

        return alert(
          data?.message ||
            `No se pudo enviar el formulario. Error ${res.status}.`,
        );
      }

      setIsSubmitting(false);
      setSubmitPhase("idle");
      setShowSuccess(true);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
      setSubmitPhase("idle");
      alert(
        "Ocurrió un error enviando la postulación. Verifica tu conexión e intenta de nuevo.",
      );
    }
  }

  function getSubmitLabel() {
    if (!isSubmitting) return "Enviar postulación";
    if (submitPhase === "compressing") return "Optimizando imágenes…";
    if (submitPhase === "sending") return "Enviando…";
    return "Enviando…";
  }

  return (
    <section
      className={styles.arkaFormPage}
      style={{ padding: "calc(var(--header-h) + 24px) var(--edge-space) 56px" }}
    >
      <div className={styles.arkaForm}>
        <div className={styles.arkaFormInner}>
          <div className={styles.formIntro}>
            <h1 className={styles.formTitle}>Postula tu propiedad</h1>
            <p className={styles.formSubtitle}>
              Completa la información y te contactaremos en un plazo máximo de
              48 horas.
            </p>
          </div>

          {step === 1 && (
            <div>
              <h3 className={styles.formSectionTitle}>Datos del propietario</h3>

              <label className={styles.label}>Nombre completo</label>
              <input
                className={styles.input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <label className={styles.label}>Correo electrónico</label>
              <input
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className={styles.label}>
                Número de celular o WhatsApp
              </label>
              <div className={styles.phoneRow}>
                <select
                  className={styles.select}
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={`${c.label}_${c.code}`} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <input
                  className={styles.input}
                  value={phoneNumber}
                  inputMode="tel"
                  placeholder="Ej: 3158254384"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              {countryCode === "OTHER" && (
                <>
                  <label className={styles.label}>Indicativo (ej: +49)</label>
                  <input
                    className={styles.input}
                    value={otherCountryCode}
                    onChange={(e) => setOtherCountryCode(e.target.value)}
                    placeholder="Ej: +49"
                    inputMode="tel"
                  />
                </>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  margin: "18px 0 4px",
                }}
              >
                <input
                  type="checkbox"
                  id="privacy-accept"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  style={{
                    marginTop: 3,
                    accentColor: "var(--arka-brown-mid)",
                    flexShrink: 0,
                    width: 16,
                    height: 16,
                  }}
                />
                <label
                  htmlFor="privacy-accept"
                  style={{
                    fontWeight: 400,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: "var(--arka-text-soft)",
                    margin: 0,
                    cursor: "pointer",
                  }}
                >
                  Acepto la{" "}
                  <a
                    href="/politica-de-privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--arka-brown-mid)",
                      textDecoration: "underline",
                    }}
                  >
                    Política de Privacidad
                  </a>{" "}
                  y el tratamiento de mis datos personales.
                </label>
              </div>

              <button className={styles.btn} onClick={startEmailVerification}>
                Continuar
              </button>
            </div>
          )}

          {step === 1.5 && (
            <div>
              <h3 className={styles.formSectionTitle}>Validación de correo</h3>
              <p>
                <strong>
                  Para continuar, revisa tu correo electrónico y valida tu
                  cuenta.
                </strong>
              </p>
              <p style={{ color: "var(--arka-text-soft)" }}>
                Te enviamos un código de verificación. Escríbelo aquí:
              </p>

              <input
                className={styles.input}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Código"
              />

              <div className={styles.arkaFormActions}>
                <button className={styles.btn} onClick={back}>
                  Atrás
                </button>
                <button className={styles.btn} onClick={verifyCode}>
                  Validar y continuar
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className={styles.formSectionTitle}>Datos de la propiedad</h3>

              <label className={styles.label}>Ciudad</label>
              <select
                className={styles.select}
                value={city}
                onChange={(e) => setCity(e.target.value as City)}
              >
                <option value="">Selecciona</option>
                <option value="Santa Marta">Santa Marta</option>
              </select>

              {city === "Santa Marta" && (
                <>
                  <label className={styles.label}>Sector</label>
                  <select
                    className={styles.select}
                    value={smSectorGroup}
                    onChange={(e) => {
                      setSmSectorGroup(e.target.value);
                      setSmSectorSub("");
                      setSmSectorFreeText("");
                    }}
                  >
                    <option value="">Selecciona</option>
                    {SM_SECTORES.map((s) => (
                      <option key={s.group} value={s.group}>
                        {s.group}
                      </option>
                    ))}
                  </select>

                  {!!smGroupObj?.subs?.length && (
                    <>
                      <label className={styles.label}>Sub-sector</label>
                      <select
                        className={styles.select}
                        value={smSectorSub}
                        onChange={(e) => setSmSectorSub(e.target.value)}
                      >
                        <option value="">Selecciona</option>
                        {smGroupObj.subs!.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </>
                  )}

                  {smGroupObj?.freeText && (
                    <>
                      <label className={styles.label}>
                        Describe en máximo 50 palabras la ubicación general
                      </label>
                      <textarea
                        className={styles.textarea}
                        value={smSectorFreeText}
                        onChange={(e) => setSmSectorFreeText(e.target.value)}
                      />
                    </>
                  )}
                </>
              )}

              <label className={styles.label}>Tipo de propiedad</label>
              <select
                className={styles.select}
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as any)}
              >
                <option value="">Selecciona</option>
                <option value="Studio o único espacio">
                  Studio o único espacio
                </option>
                <option value="Apartamento">
                  Apartamento de 1 o más habitaciones
                </option>
                <option value="Casa">Casa</option>
                <option value="Otro">Otro</option>
              </select>

              {(propertyType === "Apartamento" || propertyType === "Casa") && (
                <>
                  <label className={styles.label}>
                    ¿Cuántas habitaciones tiene?
                  </label>
                  <input
                    className={styles.input}
                    type="number"
                    value={rooms}
                    onChange={(e) =>
                      setRooms(e.target.value ? Number(e.target.value) : "")
                    }
                    min={0}
                  />

                  <label className={styles.label}>¿Cuántos baños tiene?</label>
                  <input
                    className={styles.input}
                    type="number"
                    value={baths}
                    onChange={(e) =>
                      setBaths(e.target.value ? Number(e.target.value) : "")
                    }
                    min={0}
                  />
                </>
              )}

              {propertyType === "Otro" && (
                <>
                  <label className={styles.label}>
                    Descríbelo en máximo 50 palabras
                  </label>
                  <textarea
                    className={styles.textarea}
                    value={otherTypeText}
                    onChange={(e) => setOtherTypeText(e.target.value)}
                  />
                </>
              )}

              <label className={styles.label}>
                ¿La propiedad está actualmente amoblada?
              </label>
              <select
                className={styles.select}
                value={furnished}
                onChange={(e) => setFurnished(e.target.value as any)}
              >
                <option value="">Selecciona</option>
                <option value="Sí">Sí</option>
                <option value="Parcialmente">Parcialmente</option>
                <option value="No">No</option>
              </select>

              <label className={styles.label}>
                ¿Hace parte de una propiedad horizontal?
              </label>
              <select
                className={styles.select}
                value={isHOA}
                onChange={(e) => setIsHOA(e.target.value as any)}
              >
                <option value="">Selecciona</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>

              {isHOA === "Sí" && (
                <>
                  <label className={styles.label}>
                    ¿El manual de propiedad horizontal permite rentas cortas?
                  </label>
                  <select
                    className={styles.select}
                    value={hoaAllowsSTR}
                    onChange={(e) => setHoaAllowsSTR(e.target.value as any)}
                  >
                    <option value="">Selecciona</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                    <option value="No estoy seguro">No estoy seguro</option>
                  </select>
                </>
              )}

              <div className={styles.arkaFormActions}>
                <button className={styles.btn} onClick={back}>
                  Atrás
                </button>
                <button className={styles.btn} onClick={next}>
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className={styles.formSectionTitle}>
                Información operativa básica
              </h3>

              <label className={styles.label}>
                ¿Actualmente la propiedad está?
              </label>
              <select
                className={styles.select}
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as any)}
              >
                <option value="">Selecciona</option>
                <option value="Desocupada">Desocupada</option>
                <option value="Arrendada a largo plazo">
                  Arrendada a largo plazo
                </option>
                <option value="Ya en Airbnb / Booking">
                  Ya en Airbnb / Booking
                </option>
              </select>

              <label className={styles.label}>
                ¿Desde cuándo estaría disponible para iniciar operación?
              </label>
              <select
                className={styles.select}
                value={startWhen}
                onChange={(e) => setStartWhen(e.target.value as any)}
              >
                <option value="">Selecciona</option>
                <option value="Inmediato">Inmediato</option>
                <option value="En 1–3 meses">En 1–3 meses</option>
                <option value="Más adelante">Más adelante</option>
              </select>

              <div className={styles.arkaFormActions}>
                <button className={styles.btn} onClick={back}>
                  Atrás
                </button>
                <button className={styles.btn} onClick={next}>
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className={styles.formSectionTitle}>
                Expectativa del propietario
              </h3>

              <label className={styles.label}>¿Qué busca principalmente?</label>
              <select
                className={styles.select}
                value={goal}
                onChange={(e) => setGoal(e.target.value as any)}
              >
                <option value="">Selecciona</option>
                <option value="Ingreso fijo mensual">
                  Ingreso fijo mensual
                </option>
                <option value="Ingreso optimizado por noche">
                  Ingreso optimizado por noche
                </option>
                <option value="Mezcla de ambos">Mezcla de ambos</option>
                <option value="Aún no lo tengo claro">
                  Aún no lo tengo claro
                </option>
              </select>

              <div className={styles.arkaFormActions}>
                <button className={styles.btn} onClick={back}>
                  Atrás
                </button>
                <button className={styles.btn} onClick={next}>
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 className={styles.formSectionTitle}>Fotos</h3>

              <p className={styles.photoHelp}>
                Sube al menos 3 fotos de la habitación principal, baño y una
                vista adicional de la propiedad. Opcionalmente, sube otras que
                consideres importantes. Máximo: 5 fotos en total.
              </p>

              <input
                className={styles.input}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
                multiple
                onChange={(e) => {
                  const list = Array.from(e.target.files || []);
                  addPhotos(list);
                  e.currentTarget.value = "";
                }}
              />

              <p style={{ color: minPhotosOk ? "inherit" : "crimson" }}>
                {minPhotosOk
                  ? `OK: ${photos.length} archivos`
                  : `Faltan fotos: tienes ${photos.length}/${MIN_PHOTOS}`}
              </p>

              {photos.length > 0 && (
                <div className={styles.photoGrid}>
                  {photos.map((p) => (
                    <div className={styles.photoCard} key={p.id}>
                      <img
                        className={styles.photoImg}
                        src={p.url}
                        alt="Foto subida"
                      />
                      <button
                        type="button"
                        className={styles.photoRemove}
                        aria-label="Borrar foto"
                        onClick={() => removePhoto(p.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.arkaFormActions}>
                <button
                  className={styles.btn}
                  onClick={back}
                  disabled={isSubmitting}
                >
                  Atrás
                </button>
                <button
                  className={styles.btn}
                  onClick={submitAll}
                  disabled={isSubmitting}
                >
                  {getSubmitLabel()}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSuccess && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          onClick={closeSuccessAndGoHome}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              aria-label="Cerrar"
              onClick={closeSuccessAndGoHome}
            >
              ×
            </button>

            <h3 className={styles.modalTitle}>
              ¡Gracias por postular tu propiedad!
            </h3>
            <p className={styles.modalText}>
              Revisaremos tu información y te contactaremos en un plazo máximo
              de 48 horas.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
