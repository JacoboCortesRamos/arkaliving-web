"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0); // 0..1 dentro del hero

  useEffect(() => {
    const read = () => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const height = heroRef.current.offsetHeight;

      // Progreso: 0 al inicio del hero, 1 cuando termina el hero
      // (hero es muy alto: varias pantallas)
      const scrolled = clamp(-rect.top, 0, height);
      const p = height > 0 ? clamp(scrolled / height, 0, 1) : 0;

      setProgress(p);
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        read();
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    read();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /**
   * 9 stages (0..8) por tramos iguales del progreso del hero
   * Esto elimina “saltos” por trackpad y asegura orden exacto.
   */
  const STAGES = 9;
  const stage = clamp(Math.floor(progress * STAGES), 0, 8);

  // Exponer stage al CSS global (CTA)
  useEffect(() => {
    document.documentElement.dataset.heroStage = String(stage);
  }, [stage]);

  // Overlay progresivo (suave)
  const overlayOpacity = 0.62 * clamp(progress * 1.2, 0, 1);

  // Reglas EXACTAS según tu guion
  const showOnlyBrand = stage <= 2;      // stages 0,1,2
  const showH1 = stage === 3;            // solo stage 3
  const showH3 = stage >= 4;             // desde stage 4
  const stepCount = stage >= 7 ? 3 : stage >= 6 ? 2 : stage >= 5 ? 1 : 0; // 5..7
  const brandCompact = stage >= 1;       // desde stage 1 se sube y se reduce

  return (
    <section ref={heroRef} className={styles.hero} aria-label="ARKA Landing">
      {/* Poster fijo */}
      <div className={styles.media} aria-hidden="true" />

      {/* Overlay oscuro progresivo */}
      <div className={styles.overlay} style={{ opacity: overlayOpacity }} aria-hidden="true" />

      {/* Brand (logo + slogan) */}
      <div className={`${styles.brand} ${brandCompact ? styles.brandCompact : ""}`}>
        <div className={styles.brandInner}>
          <Image
            src="/logo.png"
            alt="ARKA"
            width={320}
            height={90}
            priority
            className={styles.logo}
          />
          <h2 className={styles.slogan}>Gestión inteligente de rentas cortas</h2>
        </div>
      </div>

      {/* Stage 3: H1 desde abajo (y SOLO aquí) */}
      {showH1 && (
        <div className={styles.h1Wrap}>
          <h1 className={`${styles.h1} ${styles.in}`}>
            Administramos tu propiedad para rentas cortas en Santa Marta y Bogotá
          </h1>
        </div>
      )}

      {/* Stages 4..8: H3 + pasos progresivos */}
      {showH3 && (
        <div className={styles.stepsWrap}>
          <h3 className={`${styles.h3} ${styles.in}`}>
            Rentabiliza tu propiedad en 3 simples pasos:
          </h3>

          <ol className={styles.steps}>
            {stepCount >= 1 && (
              <li className={`${styles.step} ${styles.in}`}>1. Postula tu propiedad.</li>
            )}
            {stepCount >= 2 && (
              <li className={`${styles.step} ${styles.in}`}>
                2. Te presentamos una oferta clara y transparente.
              </li>
            )}
            {stepCount >= 3 && (
              <li className={`${styles.step} ${styles.in}`}>
                3. Firmamos y nos encargamos de todo.
              </li>
            )}
          </ol>
        </div>
      )}

      {/* No renderizamos nada más en stages 0..2 (solo brand) */}
      {showOnlyBrand ? null : null}
    </section>
  );
}
