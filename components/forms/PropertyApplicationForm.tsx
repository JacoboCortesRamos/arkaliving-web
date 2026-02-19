"use client";

import { useMemo, useState } from "react";

type City = "Bogotá" | "Santa Marta";

const BOGOTA_LOCALIDADES = [
  "Usaquén","Chapinero","Santa Fe","San Cristóbal","Usme","Tunjuelito","Bosa",
  "Kennedy","Fontibón","Engativá","Suba","Barrios Unidos","Teusaquillo","Los Mártires",
  "Antonio Nariño","Puente Aranda","La Candelaria","Rafael Uribe Uribe","Ciudad Bolívar","Sumapaz",
];

const SM_SECTORES: Array<{
  group: string;
  subs?: string[];
  freeText?: boolean;
}> = [
  { group: "Centro", subs: ["Centro Histórico","El Centro","Pescaíto","San Francisco"] },
  { group: "Rodadero – Gaira", subs: ["El Rodadero","Rodadero Sur","Rodadero Reservado","Gaira","Playa Salguero"] },
  { group: "Corredor Pozos Colorados – Bello Horizonte", subs: ["Pozos Colorados","Bello Horizonte","Aeropuerto","Cabo Tortuga"] },
  { group: "Zona Urbana Tradicional", subs: ["Bavaria","Los Almendros","Jardín","María Eugenia","Mamatoco","Olaya Herrera"] },
  { group: "Zonas Alternativas", subs: ["Taganga","Bonda"] },
  { group: "Otro / No estoy seguro", freeText: true },
];

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function PropertyApplicationForm() {
  const [step, setStep] = useState(1);

  // auth tokens
  const [startToken, setStartToken] = useState<string | null>(null);
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);

  // page 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

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

  const [furnished, setFurnished] = useState<"" | "Sí" | "Parcialmente" | "No">("");
  const [isHOA, setIsHOA] = useState<"" | "Sí" | "No">("");
  const [hoaAllowsSTR, setHoaAllowsSTR] = useState<"" | "Sí" | "No" | "No estoy seguro">("");

  // page 3
  const [currentStatus, setCurrentStatus] = useState<
    "" | "Desocupada" | "Arrendada a largo plazo" | "Ya en Airbnb / Booking"
  >("");
  const [startWhen, setStartWhen] = useState<"" | "Inmediato" | "En 1–3 meses" | "Más adelante">("");

  // page 4
  const [goal, setGoal] = useState<
    "" | "Ingreso fijo mensual" | "Ingreso variable maximizado por estadía" | "Mezcla de ambos" | "Aún no lo tengo claro"
  >("");

  // page 5
  const [photos, setPhotos] = useState<File[]>([]);
  const minPhotosOk = photos.length >= 3;

  const smGroupObj = useMemo(
    () => SM_SECTORES.find((s) => s.group === smSectorGroup),
    [smSectorGroup]
  );

  function next() { setStep((s) => Math.min(6, s + 1)); }
  function back() { setStep((s) => Math.max(1, s - 1)); }

  async function startEmailVerification() {
    if (!fullName.trim()) return alert("Ingresa tu nombre completo.");
    if (!isEmail(email)) return alert("Ingresa un correo válido.");
    if (!phone.trim()) return alert("Ingresa tu número de celular o WhatsApp.");

    const res = await fetch("/api/postula/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data?.message || "No se pudo enviar el correo de validación.");

    setStartToken(data.token);
    setStep(1.5 as any); // step intermedio: “revisa tu correo”
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

  async function submitAll() {
    if (!verifiedToken) return alert("Debes validar tu correo para continuar.");

    // Validaciones mínimas según doc
    if (!city) return alert("Selecciona la ciudad.");
    if (city === "Bogotá" && !bogotaLocalidad) return alert("Selecciona la localidad.");
    if (city === "Santa Marta" && !smSectorGroup) return alert("Selecciona el sector.");
    if (city === "Santa Marta" && smGroupObj?.freeText && !smSectorFreeText.trim())
      return alert("Describe la ubicación general (máx. 50 palabras).");

    if (!propertyType) return alert("Selecciona el tipo de propiedad.");
    const needsRoomsBaths = propertyType === "Apartamento" || propertyType === "Casa";
    if (needsRoomsBaths && (rooms === "" || baths === "")) return alert("Indica habitaciones y baños.");
    if (propertyType === "Otro" && !otherTypeText.trim()) return alert("Describe el tipo (máx. 50 palabras).");

    if (!furnished) return alert("Indica si está amoblada.");
    if (!isHOA) return alert("Indica si hace parte de propiedad horizontal.");
    if (isHOA === "Sí" && !hoaAllowsSTR) return alert("Indica si permite rentas cortas.");

    if (!currentStatus) return alert("Indica el estado actual.");
    if (!startWhen) return alert("Indica desde cuándo estaría disponible.");
    if (!goal) return alert("Indica tu expectativa.");
    if (!minPhotosOk) return alert("Sube al menos 3 fotos (habitación, baño, fachada).");

    const payload = {
      owner: { fullName, email, phone },
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

    const fd = new FormData();
    fd.append("verifiedToken", verifiedToken);
    fd.append("payload", JSON.stringify(payload));
    photos.forEach((f) => fd.append("photos", f));

    const res = await fetch("/api/postula/submit", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) return alert(data?.message || "No se pudo enviar el formulario.");

    setStep(6); // success
  }

  return (
    <section style={{ padding: "calc(var(--header-h) + 24px) var(--edge-space) 56px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ color: "var(--arka-brown-dark)", marginBottom: 8 }}>
          Postula tu propiedad
        </h1>
        <p style={{ color: "var(--arka-text-soft)", marginTop: 0 }}>
          Completa la información y te contactaremos en un plazo máximo de 48 horas.
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h3>Datos del propietario (página 1)</h3>

            <label>Nombre completo</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} />

            <label>Correo electrónico</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />

            <label>Número de celular o WhatsApp</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />

            <button onClick={startEmailVerification}>Continuar</button>
          </div>
        )}

        {/* STEP 1.5 — email verification */}
        {step === (1.5 as any) && (
          <div>
            <h3>Validación de correo</h3>
            <p><strong>Para continuar, revisa tu correo electrónico y valida tu cuenta.</strong></p>
            <p style={{ color: "var(--arka-text-soft)" }}>
              Te enviamos un código de verificación. Escríbelo aquí:
            </p>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Código" />
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={back}>Atrás</button>
              <button onClick={verifyCode}>Validar y continuar</button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h3>Datos de la propiedad (página 2)</h3>

            <label>Ciudad</label>
            <select value={city} onChange={(e) => setCity(e.target.value as any)}>
              <option value="">Selecciona</option>
              <option value="Bogotá">Bogotá</option>
              <option value="Santa Marta">Santa Marta</option>
            </select>

            {city === "Bogotá" && (
              <>
                <label>Localidad</label>
                <select value={bogotaLocalidad} onChange={(e) => setBogotaLocalidad(e.target.value)}>
                  <option value="">Selecciona</option>
                  {BOGOTA_LOCALIDADES.map((l) => (
                    <option key={l} value={l}>{l}</option>
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
                    <option key={s.group} value={s.group}>{s.group}</option>
                  ))}
                </select>

                {!!smGroupObj?.subs?.length && (
                  <>
                    <label>Sub-sector</label>
                    <select value={smSectorSub} onChange={(e) => setSmSectorSub(e.target.value)}>
                      <option value="">Selecciona</option>
                      {smGroupObj.subs.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </>
                )}

                {smGroupObj?.freeText && (
                  <>
                    <label>Describe en máximo 50 palabras la ubicación general</label>
                    <textarea value={smSectorFreeText} onChange={(e) => setSmSectorFreeText(e.target.value)} />
                  </>
                )}
              </>
            )}

            <label>Tipo de propiedad</label>
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value as any)}>
              <option value="">Selecciona</option>
              <option value="Studio o único espacio">Studio o único espacio</option>
              <option value="Apartamento">Apartamento de 1 o más habitaciones</option>
              <option value="Casa">Casa</option>
              <option value="Otro">Otro</option>
            </select>

            {(propertyType === "Apartamento" || propertyType === "Casa") && (
              <>
                <label>¿Cuántas habitaciones tiene?</label>
                <input
                  type="number"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value ? Number(e.target.value) : "")}
                />

                <label>¿Cuántos baños tiene?</label>
                <input
                  type="number"
                  value={baths}
                  onChange={(e) => setBaths(e.target.value ? Number(e.target.value) : "")}
                />
              </>
            )}

            {propertyType === "Otro" && (
              <>
                <label>Descríbelo en máximo 50 palabras</label>
                <textarea value={otherTypeText} onChange={(e) => setOtherTypeText(e.target.value)} />
              </>
            )}

            <label>¿La propiedad está actualmente amoblada?</label>
            <select value={furnished} onChange={(e) => setFurnished(e.target.value as any)}>
              <option value="">Selecciona</option>
              <option value="Sí">Sí</option>
              <option value="Parcialmente">Parcialmente</option>
              <option value="No">No</option>
            </select>

            <label>¿Hace parte de una propiedad horizontal?</label>
            <select value={isHOA} onChange={(e) => setIsHOA(e.target.value as any)}>
              <option value="">Selecciona</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>

            {isHOA === "Sí" && (
              <>
                <label>¿El manual de propiedad horizontal permite rentas cortas?</label>
                <select value={hoaAllowsSTR} onChange={(e) => setHoaAllowsSTR(e.target.value as any)}>
                  <option value="">Selecciona</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                  <option value="No estoy seguro">No estoy seguro</option>
                </select>
              </>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={back}>Atrás</button>
              <button onClick={next}>Continuar</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h3>Información operativa básica (página 3)</h3>

            <label>¿Actualmente la propiedad está?</label>
            <select value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value as any)}>
              <option value="">Selecciona</option>
              <option value="Desocupada">Desocupada</option>
              <option value="Arrendada a largo plazo">Arrendada a largo plazo</option>
              <option value="Ya en Airbnb / Booking">Ya en Airbnb / Booking</option>
            </select>

            <label>¿Desde cuándo estaría disponible para iniciar operación?</label>
            <select value={startWhen} onChange={(e) => setStartWhen(e.target.value as any)}>
              <option value="">Selecciona</option>
              <option value="Inmediato">Inmediato</option>
              <option value="En 1–3 meses">En 1–3 meses</option>
              <option value="Más adelante">Más adelante</option>
            </select>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={back}>Atrás</button>
              <button onClick={next}>Continuar</button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div>
            <h3>Expectativa del propietario (página 4)</h3>

            <label>¿Qué busca principalmente?</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value as any)}>
              <option value="">Selecciona</option>
              <option value="Ingreso fijo mensual">Ingreso fijo mensual</option>
              <option value="Ingreso variable maximizado por estadía">Ingreso variable maximizado por estadía</option>
              <option value="Mezcla de ambos">Mezcla de ambos</option>
              <option value="Aún no lo tengo claro">Aún no lo tengo claro</option>
            </select>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={back}>Atrás</button>
              <button onClick={next}>Continuar</button>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div>
            <h3>Fotos (página 5)</h3>

            <p style={{ color: "var(--arka-text-soft)" }}>
              Sube al menos 3 fotos: habitación, baño, fachada. (Opcional) cocina / zona social / vista.
            </p>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const list = Array.from(e.target.files || []);
                setPhotos(list);
              }}
            />

            <p style={{ color: minPhotosOk ? "inherit" : "crimson" }}>
              {minPhotosOk ? `OK: ${photos.length} archivos` : `Faltan fotos: tienes ${photos.length}/3`}
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={back}>Atrás</button>
              <button onClick={submitAll}>Enviar postulación</button>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {step === 6 && (
          <div>
            <h3>¡Listo!</h3>
            <p><strong>Revisaremos tu información y te contactaremos en un plazo máximo de 48 horas.</strong></p>
          </div>
        )}
      </div>

      {/* Inputs minimal styling (MVP) */}
      <style jsx>{`
        label { display:block; margin: 14px 0 6px; color: var(--arka-brown-dark); font-weight: 600; }
        input, select, textarea {
          width: 100%;
          padding: 12px 12px;
          border-radius: 12px;
          border: 1px solid rgba(74,52,36,.25);
          background: var(--arka-white);
          color: var(--arka-brown-dark);
          outline: none;
        }
        textarea { min-height: 96px; resize: vertical; }
        button {
          margin-top: 16px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(74,52,36,.25);
          background: var(--arka-white);
          color: var(--arka-brown-dark);
          cursor: pointer;
          font-weight: 700;
        }
        button:hover { transform: translateY(-1px); }
      `}</style>
    </section>
  );
}
