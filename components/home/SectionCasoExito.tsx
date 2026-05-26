"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./SectionCasoExito.module.css";

const FOTOS = [
  {
    src: "/properties/terraz/cover.png",
    alt: "Apartamento Terraz - vista principal",
  },
  { src: "/properties/terraz/photo-1.png", alt: "Apartamento Terraz - foto 1" },
  { src: "/properties/terraz/photo-2.png", alt: "Apartamento Terraz - foto 2" },
  { src: "/properties/terraz/photo-3.png", alt: "Apartamento Terraz - foto 3" },
  { src: "/properties/terraz/photo-4.png", alt: "Apartamento Terraz - foto 4" },
];

const PLATAFORMAS = [
  { nombre: "Airbnb", color: "#FF5A5F" },
  { nombre: "Booking.com", color: "#003580" },
  { nombre: "Expedia", color: "#1C67B5" },
];

export function SectionCasoExito() {
  const [idx, setIdx] = useState(0);

  // Activa el takeover cuando el usuario llega al fondo real de la página.
  // Usa scroll listener en lugar de IntersectionObserver para mayor precisión.
  useEffect(() => {
    const check = () => {
      const atBottom =
        window.scrollY + window.innerHeight >= document.body.scrollHeight - 120;
      if (atBottom) {
        document.documentElement.dataset.takeoverActive = "true";
      } else {
        delete document.documentElement.dataset.takeoverActive;
      }
    };

    window.addEventListener("scroll", check, { passive: true });
    check();

    return () => {
      window.removeEventListener("scroll", check);
      delete document.documentElement.dataset.takeoverActive;
    };
  }, []);

  const prev = () => setIdx((i) => (i === 0 ? FOTOS.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === FOTOS.length - 1 ? 0 : i + 1));

  return (
    <section className={styles.section} aria-labelledby="caso-titulo">
      <div className={styles.inner}>
        {/* Título */}
        <h2 id="caso-titulo" className={styles.tituloSeccion}>
          Caso de éxito
        </h2>

        {/* Carrusel */}
        <div
          className={styles.carrusel}
          aria-label="Fotos del apartamento Terraz"
        >
          <div className={styles.carruselTrack}>
            <Image
              key={idx}
              src={FOTOS[idx].src}
              alt={FOTOS[idx].alt}
              fill
              className={styles.carruselImg}
              sizes="(max-width: 768px) 100vw, 800px"
              priority={idx === 0}
            />
          </div>

          <button
            className={`${styles.navBtn} ${styles.navPrev}`}
            onClick={prev}
            aria-label="Foto anterior"
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
          <button
            className={`${styles.navBtn} ${styles.navNext}`}
            onClick={next}
            aria-label="Foto siguiente"
          >
            <ChevronRight size={24} strokeWidth={2} />
          </button>

          <div
            className={styles.dots}
            role="tablist"
            aria-label="Navegación de fotos"
          >
            {FOTOS.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === idx}
                aria-label={`Foto ${i + 1}`}
                className={`${styles.dot} ${i === idx ? styles.dotActive : ""}`}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
        </div>

        {/* Info del caso */}
        <div className={styles.info}>
          <h3 className={styles.propNombre}>Apartamento Terraz Santa Marta</h3>

          <p className={styles.propDesc}>
            Optimización del espacio para albergar hasta 4 huéspedes sin perder
            ambiente premium.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValor}>85%</span>
              <span className={styles.statLabel}>Ocupación</span>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.stat}>
              <span className={styles.statValor}>3.2M – 5.5M</span>
              <span className={styles.statLabel}>Ingresos mensuales</span>
            </div>
          </div>

          <p className={styles.plataformasLabel}>Gestión automatizada en:</p>
          <div className={styles.plataformas}>
            {PLATAFORMAS.map(({ nombre, color }) => (
              <span
                key={nombre}
                className={styles.plataformaBadge}
                style={{ "--badge-color": color } as React.CSSProperties}
              >
                {nombre}
              </span>
            ))}
          </div>
        </div>

        {/* Divisor */}
        <div className={styles.divisor} aria-hidden="true" />

        {/* CTA final */}
        <div className={styles.ctaWrap}>
          <h2 className={styles.ctaTitulo}>Sé el próximo caso de éxito</h2>
          <div className={styles.ctaCard}>
            <p className={styles.ctaTexto}>
              Postula tu propiedad ahora y te contactaremos en las próximas{" "}
              <strong>48 horas</strong> para agendar una visita.
            </p>
            <Link href="/postula-tu-propiedad" className={styles.ctaBtn}>
              Postula tu propiedad
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
