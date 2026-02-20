"use client";

import { useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./PropertyApplicationForm.css";

type City = "Bogotá" | "Santa Marta";

const BOGOTA_LOCALIDADES = [
  "Usaquén",
  "Chapinero",
  "Santa Fe",
  "San Cristóbal",
  "Usme",
  "Tunjuelito",
  "Bosa",
  "Kennedy",
  "Fontibón",
  "Engativá",
  "Suba",
  "Barrios Unidos",
  "Teusaquillo",
  "Los Mártires",
  "Antonio Nariño",
  "Puente Aranda",
  "La Candelaria",
  "Rafael Uribe Uribe",
  "Ciudad Bolívar",
  "Sumapaz",
];

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
  // deja + y dígitos únicamente
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

export function PropertyApplicationForm() {
  const router = useRouter();
  const pathname = usePathname();

  const [step, setStep] = useState<number>(1);

  const [startToken, setStartToken] = useState<string | null>(null);
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);

  // page 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // phone with country code
  const [countryCode, setCountryCode] = useState<string>("+57");
  const [otherCountryCode, setOtherCountryCode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // otp
  const [otp, setOtp] = useState("");

  // page 2
  const [city, setCity] = useState<City | "">("");
  const [bogotaLocalidad, setBogotaLocalidad] = useState("");
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

  // page 5 photos (✅ min 2 / max 5)
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const MIN_PHOTOS = 2;
  const MAX_PHOTOS = 5;
  const minPhotosOk = photos.length >= MIN_PHOTOS;

  const [isSubmitting, setIsSubmitting] = useState(false);
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

      if (city === "Bogotá" && !bogotaLocalidad)
        return (alert("Selecciona la localidad."), false);

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

  function addPhotos(files: File[]) {
    const toAdd = files
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, Math.max(0, MAX_PHOTOS - photos.length))
      .map((file) => {
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
      return alert("No se pudo generar el ID de envío. Intenta de nuevo.");
    }

    const needsRoomsBaths =
      propertyType === "Apartamento" || propertyType === "Casa";

    const cc = getFinalCountryCodeOrEmpty();
    if (!cc) {
      setIsSubmitting(false);
      return alert("Falta el indicativo del país.");
    }
    const phoneE164 = `${cc}${onlyDigits(phoneNumber)}`;

    const payload = {
      submissionId,
      owner: { fullName, email, phone: phoneE164 },
      property: {
        city,
        bogotaLocalidad: city === "Bogotá" ? bogotaLocalidad : null,
        sectorGroup: city === "Santa Marta" ? smSectorGroup : null,
        sectorSub: city === "Santa Marta" ? smSectorSub : null,
        sectorFreeText: city === "Santa Marta" ? smSectorFreeText : null,
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
      const fd = new FormData();
      fd.append("verifiedToken", verified);
      fd.append("payload", JSON.stringify(payload));
      fd.append("submissionId", submissionId);
      photos.forEach((p) => fd.append("photos", p.file));

      const res = await fetch("/api/postula/submit", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        setIsSubmitting(false);
        return alert(data?.message || "No se pudo enviar el formulario.");
      }

      setShowSuccess(true);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
      alert("Ocurrió un error enviando la postulación. Intenta de nuevo.");
    }
  }

  return (
    <section
      className="arkaFormPage"
      style={{ padding: "calc(var(--header-h) + 24px) var(--edge-space) 56px" }}
    >
      <div className="arkaForm">
        <div className="arkaFormInner">
          <div className="formIntro">
            <h1 className="formTitle">Postula tu propiedad</h1>
            <p className="formSubtitle">
              Completa la información y te contactaremos en un plazo máximo de
              48 horas.
            </p>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h3 className="formSectionTitle">Datos del propietario</h3>

              <label>Nombre completo</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <label>Correo electrónico</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} />

              <label>Número de celular o WhatsApp</label>
              <div className="phoneRow">
                <select
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
                  value={phoneNumber}
                  inputMode="tel"
                  placeholder="Ej: 3158254384"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              {countryCode === "OTHER" && (
                <>
                  <label>Indicativo (ej: +49)</label>
                  <input
                    value={otherCountryCode}
                    onChange={(e) => setOtherCountryCode(e.target.value)}
                    placeholder="Ej: +49"
                    inputMode="tel"
                  />
                </>
              )}

              <button onClick={startEmailVerification}>Continuar</button>
            </div>
          )}

          {/* STEP 1.5 */}
          {step === 1.5 && (
            <div>
              <h3 className="formSectionTitle">Validación de correo</h3>
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
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Código"
              />

              <div className="arkaFormActions">
                <button onClick={back}>Atrás</button>
                <button onClick={verifyCode}>Validar y continuar</button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h3 className="formSectionTitle">Datos de la propiedad</h3>

              <label>Ciudad</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as any)}
              >
                <option value="">Selecciona</option>
                <option value="Bogotá">Bogotá</option>
                <option value="Santa Marta">Santa Marta</option>
              </select>

              {city === "Bogotá" && (
                <>
                  <label>Localidad</label>
                  <select
                    value={bogotaLocalidad}
                    onChange={(e) => setBogotaLocalidad(e.target.value)}
                  >
                    <option value="">Selecciona</option>
                    {BOGOTA_LOCALIDADES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {city === "Santa Marta" && (
                <>
                  <label>Sector</label>
                  <select
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
                      <label>Sub-sector</label>
                      <select
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
                      <label>
                        Describe en máximo 50 palabras la ubicación general
                      </label>
                      <textarea
                        value={smSectorFreeText}
                        onChange={(e) => setSmSectorFreeText(e.target.value)}
                      />
                    </>
                  )}
                </>
              )}

              <label>Tipo de propiedad</label>
              <select
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
                  <label>¿Cuántas habitaciones tiene?</label>
                  <input
                    type="number"
                    value={rooms}
                    onChange={(e) =>
                      setRooms(e.target.value ? Number(e.target.value) : "")
                    }
                    min={0}
                  />

                  <label>¿Cuántos baños tiene?</label>
                  <input
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
                  <label>Descríbelo en máximo 50 palabras</label>
                  <textarea
                    value={otherTypeText}
                    onChange={(e) => setOtherTypeText(e.target.value)}
                  />
                </>
              )}

              <label>¿La propiedad está actualmente amoblada?</label>
              <select
                value={furnished}
                onChange={(e) => setFurnished(e.target.value as any)}
              >
                <option value="">Selecciona</option>
                <option value="Sí">Sí</option>
                <option value="Parcialmente">Parcialmente</option>
                <option value="No">No</option>
              </select>

              <label>¿Hace parte de una propiedad horizontal?</label>
              <select
                value={isHOA}
                onChange={(e) => setIsHOA(e.target.value as any)}
              >
                <option value="">Selecciona</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>

              {isHOA === "Sí" && (
                <>
                  <label>
                    ¿El manual de propiedad horizontal permite rentas cortas?
                  </label>
                  <select
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

              <div className="arkaFormActions">
                <button onClick={back}>Atrás</button>
                <button onClick={next}>Continuar</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h3 className="formSectionTitle">Información operativa básica</h3>

              <label>¿Actualmente la propiedad está?</label>
              <select
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

              <label>
                ¿Desde cuándo estaría disponible para iniciar operación?
              </label>
              <select
                value={startWhen}
                onChange={(e) => setStartWhen(e.target.value as any)}
              >
                <option value="">Selecciona</option>
                <option value="Inmediato">Inmediato</option>
                <option value="En 1–3 meses">En 1–3 meses</option>
                <option value="Más adelante">Más adelante</option>
              </select>

              <div className="arkaFormActions">
                <button onClick={back}>Atrás</button>
                <button onClick={next}>Continuar</button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <h3 className="formSectionTitle">Expectativa del propietario</h3>

              <label>¿Qué busca principalmente?</label>
              <select
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

              <div className="arkaFormActions">
                <button onClick={back}>Atrás</button>
                <button onClick={next}>Continuar</button>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div>
              <h3 className="formSectionTitle">Fotos</h3>

              <p className="photoHelp">
                Sube al menos 2 fotos de la habitación principal y baño.
                Opcionalmente, sube otras que consideres importantes. Máximo: 5
                fotos en total.
              </p>

              <input
                type="file"
                accept="image/*"
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
                <div className="photoGrid">
                  {photos.map((p) => (
                    <div className="photoCard" key={p.id}>
                      <img className="photoImg" src={p.url} alt="Foto subida" />
                      <button
                        type="button"
                        className="photoRemove"
                        aria-label="Borrar foto"
                        onClick={() => removePhoto(p.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="arkaFormActions">
                <button onClick={back} disabled={isSubmitting}>
                  Atrás
                </button>
                <button onClick={submitAll} disabled={isSubmitting}>
                  {isSubmitting ? "Enviando…" : "Enviar postulación"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div
          className="modalOverlay"
          role="dialog"
          aria-modal="true"
          onClick={closeSuccessAndGoHome} // ✅ click fuera también redirige
        >
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <button
              className="modalClose"
              aria-label="Cerrar"
              onClick={closeSuccessAndGoHome}
            >
              ×
            </button>

            <h3 className="modalTitle">¡Gracias por postular tu propiedad!</h3>
            <p className="modalText">
              Revisaremos tu información y te contactaremos en un plazo máximo
              de 48 horas.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
