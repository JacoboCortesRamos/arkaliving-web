"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";
import { Gem, Handshake, HousePlus } from "lucide-react";

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
    navStageRef.current = stage;

    return () => {
      delete document.documentElement.dataset.heroStage;
    };
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

  // Fade-out ocurre en stage 3 (S4)
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
   * H3 + Steps: entrada desde abajo con delay interno
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
   * Ajuste para snap/hold al navegar por click
   */
  const stageInner = (targetStage: number) => {
    // S3: caer en el HOLD del H1
    if (targetStage === 2) return 0.45;

    // S6..S9 (stages 5..8): forzar estado final de cada texto
    if (targetStage >= 5 && targetStage <= 8) return 0.95;

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

    // Stage 0 = inicio real del hero
    if (next === 0) {
      window.scrollTo({ top: heroTop, behavior: "smooth" });
      return;
    }

    const inner = stageInner(next);
    const targetProgress = (next + inner) / STAGES;

    window.scrollTo({
      top: heroTop + heroHeight * targetProgress,
      behavior: "smooth",
    });
  };

  // ✅ Listener: el Header puede disparar este evento para volver al stage 0
  useEffect(() => {
    const onGoStage0 = () => scrollToStage(0);
    window.addEventListener("arka:hero:stage0", onGoStage0);
    return () => window.removeEventListener("arka:hero:stage0", onGoStage0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Scroll por stages (wheel + touch)
  useEffect(() => {
    let isScrolling = false;
    let touchStartY = 0;

    const onWheel = (e: WheelEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const inHero = rect.top <= 0 && rect.bottom >= 0;
      if (!inHero) return;

      e.preventDefault();
      if (isScrolling) return;

      isScrolling = true;
      const direction = e.deltaY > 0 ? 1 : -1;
      const next = clamp(navStageRef.current + direction, 0, 9);
      scrollToStage(next);

      setTimeout(() => {
        isScrolling = false;
      }, 900);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const inHero = rect.top <= 0 && rect.bottom >= 0;
      if (!inHero) return;
      if (isScrolling) return;

      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 30) return; // ignora swipes muy cortos

      isScrolling = true;
      const direction = diff > 0 ? 1 : -1;
      const next = clamp(navStageRef.current + direction, 0, 9);
      scrollToStage(next);

      setTimeout(() => {
        isScrolling = false;
      }, 900);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showScrollIndicator = stage < 9;

  const onScrollIndicatorClick = () => {
    const currentNav = navStageRef.current;
    const next = clamp(currentNav + 1, 0, 9);
    navStageRef.current = next;
    scrollToStage(next);
  };

  return (
    <section ref={heroRef} className={styles.hero} aria-label="ARKA Landing">
      <div className={styles.media} aria-hidden="true">
        <video autoPlay muted loop playsInline className={styles.mediaVideo}>
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>
      <div
        className={styles.overlay}
        style={{ opacity: overlayOpacity }}
        aria-hidden="true"
      />

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
                <span className={styles.stepIconWrap} aria-hidden="true">
                  <HousePlus className={styles.stepIcon} strokeWidth={1.6} />
                </span>
                <span className={styles.stepText}>
                  1. Postula tu propiedad.
                </span>
              </li>
            )}

            {stepCount >= 2 && (
              <li className={styles.step} style={enterStyle(7) ?? undefined}>
                <span className={styles.stepIconWrap} aria-hidden="true">
                  <Gem className={styles.stepIcon} strokeWidth={1.6} />
                </span>
                <span className={styles.stepText}>
                  2. Te presentamos una oferta clara y transparente.
                </span>
              </li>
            )}

            {stepCount >= 3 && (
              <li className={styles.step} style={enterStyle(8) ?? undefined}>
                <span className={styles.stepIconWrap} aria-hidden="true">
                  <Handshake className={styles.stepIcon} strokeWidth={1.6} />
                </span>
                <span className={styles.stepText}>
                  3. Firmamos y nos encargamos de todo.
                </span>
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
