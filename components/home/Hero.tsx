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

  const STAGES = 9;
  const raw = progress * STAGES;
  const stage = clamp(Math.floor(raw), 0, 8);
  const stageProgress = clamp(raw - stage, 0, 1);

  useEffect(() => {
    document.documentElement.dataset.heroStage = String(stage);
  }, [stage]);

  // Overlay progresivo
  const overlayT = clamp(progress * 1.9, 0, 1);
  const overlayOpacity = 0.62 * easeOutCubic(overlayT);

  const showOnlyBrand = stage <= 1;
  const showH1 = stage === 2;
  const showH3 = stage >= 4;
  const stepCount = stage >= 7 ? 3 : stage >= 6 ? 2 : stage >= 5 ? 1 : 0;
  const brandCompact = stage >= 1;

  const baseBrandOpacity = stage === 2 ? 1 : brandCompact ? 0.92 : 0.28;
  const brandFade = stage === 3 ? 1 - stageProgress : stage >= 4 ? 0 : 1;
  const brandOpacity = baseBrandOpacity * brandFade;

  // H1 timings
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

  // H3 + Steps
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

  return (
    <section ref={heroRef} className={styles.hero} aria-label="ARKA Landing">
      <div className={styles.media} aria-hidden="true" />

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

      {/* Scroll Indicator (solo stages 0 a 7) */}
      {stage < 8 && (
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollCircle}>
            <div className={styles.scrollArrow}></div>
          </div>
        </div>
      )}

      {/* H3 + Steps */}
      {showH3 && (
        <div className={styles.stepsWrap}>
          <h3 className={styles.h3} style={enterStyle(4) ?? undefined}>
            Rentabiliza tu propiedad en 3 simples pasos:
          </h3>

          <ol className={styles.steps}>
            {stepCount >= 1 && (
              <li className={styles.step} style={enterStyle(5) ?? undefined}>
                1. Postula tu propiedad.
              </li>
            )}
            {stepCount >= 2 && (
              <li className={styles.step} style={enterStyle(6) ?? undefined}>
                2. Te presentamos una oferta clara y transparente.
              </li>
            )}
            {stepCount >= 3 && (
              <li className={styles.step} style={enterStyle(7) ?? undefined}>
                3. Firmamos y nos encargamos de todo.
              </li>
            )}
          </ol>
        </div>
      )}

      {showOnlyBrand ? null : null}
    </section>
  );
}
