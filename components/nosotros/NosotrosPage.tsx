"use client";

import { useEffect, useRef } from "react";
import styles from "./Nosotros.module.css";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const mode = target.dataset.reveal; // "stay" | "toggle"

          if (entry.isIntersecting) {
            target.classList.add(styles.revealed);
            if (mode === "stay") {
              observer.unobserve(target);
            }
          } else {
            if (mode === "toggle") {
              target.classList.remove(styles.revealed);
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
      },
    );

    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, []);

  return ref;
}

export function NosotrosPage() {
  const containerRef = useScrollReveal();

  return (
    <main className={styles.page} ref={containerRef}>
      {/* ─── HERO TITLE ─────────────────────────────────────────── */}
      <section className={styles.heroSection}>
        <div
          className={`${styles.heroTitle} ${styles.revealUp}`}
          data-reveal="stay"
        >
          <span className={styles.heroTitleLine}>Construyendo estructura</span>
          <span className={styles.heroTitleLine}>en casa.</span>
          <span className={`${styles.heroTitleLine} ${styles.heroTitleSoft}`}>
            Operando con cuidado.
          </span>
        </div>

        <div
          className={`${styles.heroDivider} ${styles.revealScale}`}
          data-reveal="stay"
        />
      </section>

      {/* ─── MANIFIESTO ─────────────────────────────────────────── */}
      <section className={styles.manifesto}>
        <p
          className={`${styles.bodyLarge} ${styles.revealFade}`}
          data-reveal="toggle"
        >
          Decidimos volver a Colombia en un momento en el que la decisión más
          cómoda era quedarnos afuera.
        </p>

        <p
          className={`${styles.body} ${styles.revealFade}`}
          data-reveal="toggle"
        >
          Habíamos migrado, estudiado, homologado títulos, proyectado maestrías
          y evaluado escenarios con la frialdad de quien entiende que el tiempo
          y el dinero son recursos finitos. Podríamos haber buscado un camino
          más predecible, pero elegimos algo distinto:{" "}
          <mark className={styles.highlight}>construir empresa en casa.</mark>
        </p>

        <blockquote
          className={`${styles.pullQuote} ${styles.revealUp}`}
          data-reveal="stay"
        >
          No volvimos por improvisación.
          <br />
          Volvimos por decisión.
        </blockquote>

        <p
          className={`${styles.body} ${styles.revealFade}`}
          data-reveal="toggle"
        >
          Durante años hemos trabajado en entornos donde el margen de error es
          mínimo. Coordinando proyectos arquitectónicos de gran escala que
          exigen precisión milimétrica y toma de decisiones bajo presión.
          Cuidando pacientes en unidades críticas donde la serenidad no es
          opcional y cualquier detalle puede cambiar de manera drásticamente el
          resultado.
        </p>

        <blockquote
          className={`${styles.pullQuoteSmall} ${styles.revealUp}`}
          data-reveal="stay"
        >
          Aprendimos algo fundamental: la improvisación siempre termina costando
          más.
        </blockquote>

        <p
          className={`${styles.body} ${styles.revealFade}`}
          data-reveal="toggle"
        >
          En Santa Marta encontramos inmuebles con enorme potencial, pero
          gestionados sin estándares. Espacios que podrían ser excelentes
          hospedajes, arruinados por fallas básicas de mantenimiento y limpieza.
          Experiencias que no fracasan por falta de lujo, sino por falta de
          rigor.
        </p>

        <div
          className={`${styles.insight} ${styles.revealUp}`}
          data-reveal="stay"
        >
          <span className={styles.insightLabel}>El diagnóstico</span>
          <p className={styles.insightText}>
            Entendimos que el problema no es el inmueble.
            <br />
            Es el sistema que lo opera.
          </p>
        </div>

        <div
          className={`${styles.arkaCallout} ${styles.revealUp}`}
          data-reveal="stay"
        >
          <span className={styles.insightLabel}>La solución</span>
          <p className={styles.arkaCalloutText}>ARKA nace para resolver eso.</p>
        </div>
      </section>

      {/* ─── CREENCIAS ──────────────────────────────────────────── */}
      <section className={styles.beliefsSection}>
        {/* No creemos — toggle: desaparecen al salir del viewport */}
        <ul className={styles.beliefsList}>
          {[
            "No creemos en crecer desmedidamente si el proceso no está listo para sostenerlo.",
            "No creemos en maximizar ingresos sacrificando calidad.",
            "No creemos en sobreprometer para captar propiedades.",
          ].map((text, i) => (
            <li
              key={i}
              className={`${styles.beliefItemSlow} ${styles.revealUp}`}
              data-reveal="toggle"
              style={{ "--delay": `${i * 220}ms` } as React.CSSProperties}
            >
              <span className={styles.beliefCross} aria-hidden="true">
                ✕
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ul>

        {/* Spacer: scroll vacío entre los dos grupos */}
        <div className={styles.beliefsSpacer} aria-hidden="true" />

        {/* Sí creemos — check ✓, toggle, con separación visual grande */}
        <ul className={styles.beliefsList}>
          {[
            "Creemos en construir un sistema que permita crecer con control.",
            "Creemos en generar empleo de calidad y profesionalizar un sector que todavía opera en la informalidad.",
          ].map((text, i) => (
            <li
              key={i}
              className={`${styles.beliefItemSlow} ${styles.revealUp}`}
              data-reveal="toggle"
              style={{ "--delay": `${i * 220}ms` } as React.CSSProperties}
            >
              <span className={styles.beliefCheck} aria-hidden="true">
                ✓
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ul>

        {/* Recuadro propietario — stay, aparece con los "Creemos" aún visibles */}
        <div
          className={`${styles.ownerCallout} ${styles.revealUp}`}
          data-reveal="stay"
        >
          <p className={styles.ownerCalloutText}>
            Queremos que cada propietario se sienta tranquilo, respaldado por el{" "}
            <strong>Sistema ARKA</strong> que opera con criterio. No libre de
            riesgo, pero acompañado por quienes saben lo que hacen.
          </p>
        </div>
      </section>

      {/* ─── VISIÓN ─────────────────────────────────────────────── */}
      <section className={styles.visionSection}>
        <div
          className={`${styles.visionCard} ${styles.revealUp}`}
          data-reveal="stay"
        >
          <p className={styles.visionText}>
            Hoy empezamos con una estructura pensada para escalar. Nuestra
            visión es clara: construir un sistema capaz de operar cientos de
            propiedades con el mismo rigor con el que empezamos la primera.
          </p>
          <p className={styles.visionClosure}>
            Si vamos a hacerlo, lo haremos bien.
          </p>
        </div>
      </section>

      {/* ─── FUNDADORES (sin título, pegados al card café) ───────── */}
      <section className={styles.foundersSection}>
        <div className={styles.foundersGrid}>
          {/* ── Jacobo ── */}
          <article
            className={`${styles.founderCard} ${styles.revealUp}`}
            data-reveal="stay"
            style={{ "--delay": "0ms" } as React.CSSProperties}
          >
            {/* Cabecera: círculo foto (sobresale) + firma a la derecha */}
            <div className={styles.founderHeader}>
              {/*
                FOTO: cuando tengas el archivo, reemplaza founderCirclePlaceholder por:
                <Image
                  src="/founders/jacobo.jpg"
                  alt="Jacobo Cortés Ramos"
                  fill
                  className={styles.founderCircleImg}
                />
              */}
              <div className={styles.founderCircle} aria-hidden="true">
                <span className={styles.founderInitial}>J</span>
              </div>

              {/*
                FIRMA: cuando tengas el PNG/SVG, reemplaza founderSignaturePlaceholder por:
                <Image
                  src="/founders/firma-jacobo.png"
                  alt="Firma Jacobo"
                  width={130} height={44}
                  className={styles.founderSignature}
                />
              */}
              <div
                className={styles.founderSignaturePlaceholder}
                aria-hidden="true"
              />
            </div>

            <div className={styles.founderBody}>
              <h3 className={styles.founderName}>Jacobo Cortés Ramos</h3>
              <p className={styles.founderRole}>
                Co-fundador · Operaciones & Crecimiento
              </p>
              <p className={styles.founderBio}>
                Arquitecto de la Universidad de los Andes con más de 10 años de
                experiencia en el desarrollo y coordinación de proyectos de gran
                escala que exigen precisión y control. Como viajero empedernido
                es capaz de ver el potencial de Santa Marta como destino
                turístico mundial. Su papel en ARKA es liderar la estructura
                operativa y el crecimiento controlado del sistema.
              </p>
            </div>
          </article>

          {/* ── Brenda ── */}
          <article
            className={`${styles.founderCard} ${styles.revealUp}`}
            data-reveal="stay"
            style={{ "--delay": "160ms" } as React.CSSProperties}
          >
            <div className={styles.founderHeader}>
              {/*
                FOTO: mismo patrón que Jacobo.
                <Image
                  src="/founders/brenda.jpg"
                  alt="Brenda Montaño Estrada"
                  fill
                  className={styles.founderCircleImg}
                />
              */}
              <div className={styles.founderCircle} aria-hidden="true">
                <span className={styles.founderInitial}>B</span>
              </div>

              {/*
                FIRMA: mismo patrón que Jacobo.
                <Image
                  src="/founders/firma-brenda.png"
                  alt="Firma Brenda"
                  width={130} height={44}
                  className={styles.founderSignature}
                />
              */}
              <div
                className={styles.founderSignaturePlaceholder}
                aria-hidden="true"
              />
            </div>

            <div className={styles.founderBody}>
              <h3 className={styles.founderName}>Brenda Montaño Estrada</h3>
              <p className={styles.founderRole}>
                Co-fundadora · Experiencia & Estándares
              </p>
              <p className={styles.founderBio}>
                Enfermera con maestría en Cuidados Paliativos de la Pontificia
                Universidad Javeriana y experiencia internacional en hospitales
                de primer nivel y unidades de atención geriátrica de Alemania.
                Ha trabajado en entornos de alta exigencia donde el cuidado y el
                criterio no son negociables. Orgullosamente samaria, con su
                vocación de cuidado y conexión con la ciudad, lidera en ARKA la
                experiencia del huésped y los estándares de servicio.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
