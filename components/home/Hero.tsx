"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  // stage de navegación por clicks
  const navStageRef = useRef(0);

  useEffect(() => {
    const read = () => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const height = heroRef.current.offsetHeight;

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
   * STAGES (0..9) -> S1..S10
   */
  const STAGES = 10;
  const raw = progress * STAGES;
  const stage = clamp(Math.floor(raw), 0, STAGES - 1);
  const stageProgress = clamp(raw - stage, 0, 1);

  useEffect(() => {
    document.documentElement.dataset.heroStage = String(stage);
    // sync si el usuario hace scroll manual
    navStageRef.current = stage;
  }, [stage]);

  // Overlay progresivo
  const overlayT = clamp(progress * 1.9, 0, 1);
  const overlayOpacity = 0.62 * easeOutCubic(overlayT);

  // Guion
  const showH1 = stage === 2;
  const showH3 = stage >= 5;
  const stepCount = stage >= 8 ? 3 : stage >= 7 ? 2 : stage >= 6 ? 1 : 0;
  const brandCompact = stage >= 1;

  /**
   * BRAND (ajustado para tus S1..S10):
   * S1 (stage 0): limpio -> brand 0
   * S2 (stage 1): brand visible
   * S3 (stage 2): brand + H1 (brand full)
   * S4 (stage 3): brand visible y aquí SE DESVANECE hacia el final
   * S5 (stage 4): limpio -> brand 0
   * S6+ (stage >=5): apagado -> brand 0
   */
  const baseBrandOpacity =
    stage === 0 ? 0 : stage === 2 ? 1 : brandCompact ? 0.92 : 0.28;

  // ✅ Cambio clave: el fade-out ocurre en stage 3 (S4), NO en stage 4 (S5)
  const brandFade = stage === 3 ? 1 - stageProgress : stage >= 4 ? 0 : 1;

  const brandOpacity = baseBrandOpacity * brandFade;

  // Stage 2 timings (H1)
  const h1InEnd = 0.18;
  const h1HoldEnd = 0.7;
  const h1OutStart = h1HoldEnd;

  const h1Enter = clamp(stageProgress / h1InEnd, 0, 1);

  const h1ExitT = clamp((stageProgress - h1OutStart) / (1 - h1OutStart), 0, 1);
  const h1Exit = easeOutCubic(h1ExitT);

  const h1Opacity = stageProgress < h1OutStart ? h1Enter : 1 - h1Exit;

  const yHold = -70;
  const yOutEnd = -170;
  const yStartH1 = 180;

  let h1Y: number;

  if (stageProgress < h1InEnd) {
    const tIn = easeOutCubic(clamp(stageProgress / h1InEnd, 0, 1));
    h1Y = lerp(yStartH1, yHold, tIn);
  } else if (stageProgress < h1OutStart) {
    h1Y = yHold;
  } else {
    h1Y = lerp(yHold, yOutEnd, h1Exit);
  }

  /**
   * H3 + Steps: entrada desde abajo con delay interno (igual)
   */
  const enterStyle = (itemStage: number) => {
    if (stage < itemStage) return null;

    const t = stage === itemStage ? stageProgress : 1;

    const delayStart = 0.35;
    const duration = 0.65;

    const normalized =
      t < delayStart ? 0 : clamp((t - delayStart) / duration, 0, 1);

    const eased = easeOutCubic(normalized);

    const yStart = 160;
    const yEnd = -20;

    return {
      opacity: eased,
      transform: `translateY(${lerp(yStart, yEnd, eased)}px)`,
    } as const;
  };

  /**
   * ✅ Click -> siguiente stage exacto
   * Ajuste clave para S6..S9:
   * - aterrizamos MUY cerca del final del stage (0.95) para que el enterStyle quede completo
   */
  const stageInner = (targetStage: number) => {
    // S3: caer en el HOLD del H1
    if (targetStage === 2) return 0.45;

    // S6..S9 (stages 5..8): forzar "snap" a estado final de cada texto
    if (targetStage >= 5 && targetStage <= 8) return 0.95;

    // resto: centro seguro
    return 0.55;
  };

  const scrollToStage = (targetStage: number) => {
    if (!heroRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    const heroTop = window.scrollY + rect.top;
    const heroHeight = heroRef.current.offsetHeight;

    const next = clamp(targetStage, 0, 9);

    // Último stage: salir del hero para ver Footer (S10)
    if (next >= 9) {
      const padding = Math.max(24, window.innerHeight * 0.15);
      window.scrollTo({
        top: heroTop + heroHeight + padding,
        behavior: "smooth",
      });
      return;
    }

    const inner = stageInner(next);
    const targetProgress = (next + inner) / STAGES;

    window.scrollTo({
      top: heroTop + heroHeight * targetProgress,
      behavior: "smooth",
    });
  };

  const showScrollIndicator = stage < 9;

  const onScrollIndicatorClick = () => {
    const currentNav = navStageRef.current;
    const next = clamp(currentNav + 1, 0, 9);

    navStageRef.current = next;
    scrollToStage(next);
  };

  return (
    <section ref={heroRef} className={styles.hero} aria-label="ARKA Landing">
      <div className={styles.media} aria-hidden="true" />
      <div
        className={styles.overlay}
        style={{ opacity: overlayOpacity }}
        aria-hidden="true"
      />

      {/* Label S1..S10 */}
      <div className={styles.stageLabel} aria-hidden="true">
        S{stage + 1}
      </div>

      {/* Brand */}
      <div
        className={`${styles.brand} ${brandCompact ? styles.brandCompact : ""}`}
      >
        <div className={styles.brandInner} style={{ opacity: brandOpacity }}>
          <Image
            src="/logo.png"
            alt="ARKA"
            width={320}
            height={90}
            priority
            className={styles.logo}
          />
          <h2 className={styles.slogan}>
            Gestión inteligente de rentas cortas
          </h2>
        </div>
      </div>

      {/* H1 */}
      {showH1 && (
        <div className={styles.h1Wrap}>
          <h1
            className={styles.h1}
            style={{
              opacity: h1Opacity,
              transform: `translateY(${h1Y}px)`,
            }}
          >
            Administramos tu propiedad para rentas cortas en Santa Marta y
            Bogotá
          </h1>
        </div>
      )}

      {/* H3 + pasos */}
      {showH3 && (
        <div className={styles.stepsWrap}>
          <h3 className={styles.h3} style={enterStyle(5) ?? undefined}>
            Rentabiliza tu propiedad en 3 simples pasos:
          </h3>

          <ol className={styles.steps}>
            {stepCount >= 1 && (
              <li className={styles.step} style={enterStyle(6) ?? undefined}>
                1. Postula tu propiedad.
              </li>
            )}
            {stepCount >= 2 && (
              <li className={styles.step} style={enterStyle(7) ?? undefined}>
                2. Te presentamos una oferta clara y transparente.
              </li>
            )}
            {stepCount >= 3 && (
              <li className={styles.step} style={enterStyle(8) ?? undefined}>
                3. Firmamos y nos encargamos de todo.
              </li>
            )}
          </ol>
        </div>
      )}

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <button
          type="button"
          className={styles.scrollIndicator}
          onClick={onScrollIndicatorClick}
          aria-label="Scroll to next stage"
        >
          <span className={styles.scrollCircle} aria-hidden="true">
            <span className={styles.scrollArrow} aria-hidden="true" />
          </span>
        </button>
      )}
    </section>
  );
}
