"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Instagram,
  Mail,
  MessageCircleMore,
} from "lucide-react";
import { contactSchema, type ContactPayload } from "@/lib/schemas/contact";
import styles from "./Contacto.module.css";

// ─── Bloque 1 ─────────────────────────────────────────────
function BloquePostula() {
  return (
    <section className={`${styles.block} ${styles.postula}`}>
      <div className={styles.blockInner}>
        <span className={styles.postulaLabel}>Propietarios</span>
        <h2 className={styles.postulaTitle}>
          ¿Quieres postular
          <br />
          tu propiedad?
        </h2>
        <p className={styles.postulaBody}>
          Cuéntanos sobre tu inmueble. Te respondemos en máximo 48 horas con una
          propuesta clara y sin compromisos.
        </p>
        <Link href="/postula-tu-propiedad" className={styles.postulaBtn}>
          Postúlala aquí
          <ArrowRight />
        </Link>
      </div>
    </section>
  );
}

// ─── Bloque 2 ─────────────────────────────────────────────
type FormStatus = "idle" | "loading" | "success" | "error";

function BloqueFormulario() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactPayload>({
    resolver: zodResolver(contactSchema),
  });

  const isLoading = status === "loading";

  async function onSubmit(data: ContactPayload) {
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(
          json?.message ?? "No se pudo enviar el mensaje. Intenta de nuevo.",
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      reset();
    } catch {
      setErrorMsg(
        "Ocurrió un error de red. Verifica tu conexión e intenta de nuevo.",
      );
      setStatus("error");
    }
  }

  return (
    <section className={`${styles.block} ${styles.contact}`}>
      <div className={styles.blockInner}>
        <span className={styles.contactLabel}>Contacto</span>
        <h2 className={styles.contactTitle}>
          ¿Tienes dudas?
          <br />
          Hablemos.
        </h2>
        <p className={styles.contactSubtitle}>
          Estamos aquí para ti. Escríbenos y te respondemos pronto.
        </p>

        {/* Estado de éxito */}
        {status === "success" && (
          <div className={styles.statusSuccess}>
            <CheckCircle2 />
            <div className={styles.statusSuccessText}>
              <strong>Mensaje recibido.</strong>
              <span>
                Te respondemos a la brevedad. Gracias por escribirnos.
              </span>
            </div>
          </div>
        )}

        {/* Formulario — oculto tras éxito */}
        {status !== "success" && (
          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Campo: De */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-from">
                E-mail o teléfono
              </label>
              <input
                id="contact-from"
                className={styles.input}
                placeholder="tu@correo.com o +57 300 000 0000"
                disabled={isLoading}
                {...register("from")}
              />
              {errors.from && (
                <p className={styles.fieldError}>{errors.from.message}</p>
              )}
            </div>

            {/* Campo: Asunto */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-subject">
                Asunto
              </label>
              <input
                id="contact-subject"
                className={styles.input}
                placeholder="¿En qué podemos ayudarte?"
                disabled={isLoading}
                {...register("subject")}
              />
              {errors.subject && (
                <p className={styles.fieldError}>{errors.subject.message}</p>
              )}
            </div>

            {/* Campo: Mensaje */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-message">
                Mensaje
              </label>
              <textarea
                id="contact-message"
                className={styles.textarea}
                placeholder="Escribe tu mensaje aquí..."
                disabled={isLoading}
                {...register("message")}
              />
              {errors.message && (
                <p className={styles.fieldError}>{errors.message.message}</p>
              )}
            </div>

            {/* Error global */}
            {status === "error" && (
              <div className={styles.statusError}>
                <AlertCircle />
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 style={{ animation: "spin 1s linear infinite" }} />
                  Enviando…
                </>
              ) : (
                "Enviar mensaje"
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Bloque 3 ─────────────────────────────────────────────
function BloqueRedes() {
  return (
    <section className={`${styles.block} ${styles.social}`}>
      <div className={styles.blockInner}>
        <p className={styles.socialTitle}>Encuéntranos en</p>
        <div className={styles.socialLinks}>
          <a
            href="https://instagram.com/arka_living.co"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Instagram de ARKA Living"
          >
            <Instagram />
          </a>

          <a
            href="https://wa.me/573158254384?text=Hola%20ARKA%2C%20quiero%20recibir%20informaci%C3%B3n."
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="WhatsApp de ARKA Living"
          >
            <MessageCircleMore />
          </a>

          <a
            href="mailto:jacobocortes90@hotmail.com"
            className={styles.socialLink}
            aria-label="Correo electrónico de ARKA Living"
          >
            <Mail />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Export principal ──────────────────────────────────────
export function ContactoPage() {
  return (
    <div className={styles.page}>
      <BloquePostula />
      <BloqueFormulario />
      <BloqueRedes />
    </div>
  );
}
