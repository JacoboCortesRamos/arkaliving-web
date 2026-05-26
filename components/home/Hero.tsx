"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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

function rangeFraction(t: number, start: number, end: number) {
  return clamp((t - start) / (end - start), 0, 1);
}

// Solo 4 stages activos: 0 (video puro), 1 (logo fade in), 2 (logo+H1), 3 (H1 fade out → libera scroll)
const STAGES = 4;

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [progress, setProgress] = useState(0);
  const navStageRef = useRef(0);

  // ── Mobile detection ─────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Video loader bar ─────────────────────────────────────────
  const [barVisible, setBarVisible] = useState(true);
  const barStartRef = useRef<number>(Date.now());
  const barTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideBar = useCallback(() => {
    setBarVisible(false);
    if (barTimerRef.current) clearTimeout(barTimerRef.current);
    videoRef.current?.play().catch(() => {});
  }, []);

  const onVideoReady = useCallback(() => {
    if (videoRef.current && isMobile) {
      videoRef.current.playbackRate = 0.9;
    }
    const elapsed = Date.now() - barStartRef.current;
    const remaining = Math.max(0, 2000 - elapsed);
    setTimeout(hideBar, remaining);
  }, [hideBar, isMobile]);

  const onVideoError = useCallback(() => {
    setBarVisible(false);
    if (barTimerRef.current) clearTimeout(barTimerRef.current);
  }, []);

  const onTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const endAt = video.duration - 1;
    if (video.currentTime >= endAt) {
      video.pause();
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 1;
          videoRef.current.play().catch(() => {});
        }
      }, 300);
    }
  }, []);

  useEffect(() => {
    barTimerRef.current = setTimeout(hideBar, 5000);
    return () => {
      if (barTimerRef.current) clearTimeout(barTimerRef.current);
    };
  }, [hideBar]);

  // ── Leer scroll ──────────────────────────────────────────────
  useEffect(() => {
    const read = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const height = heroRef.current.offsetHeight;
      const scrollable = height - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, scrollable);
      const p = scrollable > 0 ? clamp(scrolled / scrollable, 0, 1) : 0;
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

  // ── Calcular stage ───────────────────────────────────────────
  const raw = progress * STAGES;
  const stage = clamp(Math.floor(raw), 0, STAGES - 1);
  const sp = clamp(raw - stage, 0, 1);

  useEffect(() => {
    document.documentElement.dataset.heroStage = String(stage);
    navStageRef.current = stage;
    return () => {
      delete document.documentElement.dataset.heroStage;
    };
  }, [stage]);

  // ── Hero done — se activa cuando el usuario ya salió del hero ──
  useEffect(() => {
    const check = () => {
      if (!heroRef.current) return;
      const bottom = heroRef.current.getBoundingClientRect().bottom;
      if (bottom <= 0) {
        document.documentElement.dataset.heroDone = "true";
        delete document.documentElement.dataset.heroExiting;
      } else {
        delete document.documentElement.dataset.heroDone;
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", check);
      delete document.documentElement.dataset.heroDone;
      delete document.documentElement.dataset.heroExiting;
    };
  }, []);

  // ── exitHero ─────────────────────────────────────────────────
  // Escribe data-hero-exiting ANTES de hacer scroll para que el
  // CSS inicie el fade-out mientras el scroll está en curso.
  // No espera: el fade visual y el movimiento de scroll arrancan juntos.
  const exitHero = useCallback(() => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const heroTop = window.scrollY + rect.top;
    const heroHeight = heroRef.current.offsetHeight;

    // Fade-out visual inmediato (CSS transition vía data attribute)
    document.documentElement.dataset.heroExiting = "true";

    // En el siguiente frame empezar el scroll suave para que el
    // navegador ya haya pintado el estado fade-out antes de mover
    requestAnimationFrame(() => {
      window.scrollTo({
        top: heroTop + heroHeight + 8,
        behavior: "smooth",
      });
    });
  }, []);

  // ── Overlay ──────────────────────────────────────────────────
  const overlayT = clamp(progress * 2.5, 0, 1);
  const overlayOpacity = 0.62 * easeOutCubic(overlayT);

  // ── BRAND (logo + slogan) ────────────────────────────────────
  let brandOpacity: number;
  if (stage === 0) {
    brandOpacity = 0;
  } else if (stage === 1) {
    brandOpacity = easeOutCubic(sp);
  } else if (stage === 2) {
    brandOpacity = 1;
  } else if (stage === 3) {
    const fadeOut = easeOutCubic(rangeFraction(sp, 0.4, 0.7));
    brandOpacity = 1 - fadeOut;
  } else {
    brandOpacity = 0;
  }

  const brandCompact = stage >= 1;

  // ── H1 ───────────────────────────────────────────────────────
  const showH1 = stage === 2 || stage === 3;

  const h1EnterT = easeOutCubic(rangeFraction(sp, 0, 0.25));
  const h1ExitT = easeOutCubic(rangeFraction(sp, 0, 0.5));

  let h1Opacity: number;
  let h1Y: number;

  if (stage === 2) {
    h1Opacity = h1EnterT;
    h1Y = lerp(160, -60, h1EnterT);
  } else if (stage === 3) {
    h1Opacity = 1 - h1ExitT;
    h1Y = lerp(-60, -180, h1ExitT);
  } else {
    h1Opacity = 0;
    h1Y = 0;
  }

  // ── scrollToStage ────────────────────────────────────────────
  const stageInner = (targetStage: number) => {
    if (targetStage === 2) return 0.5;
    if (targetStage === 3) return 0.85;
    return 0.55;
  };

  const scrollToStage = (targetStage: number) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const heroTop = window.scrollY + rect.top;
    const heroHeight = heroRef.current.offsetHeight;
    const scrollable = heroHeight - window.innerHeight;
    const next = clamp(targetStage, 0, STAGES - 1);

    // Stage 3 completo → salir del hero al primer bloque
    if (next >= STAGES - 1 && sp > 0.6) {
      const padding = Math.max(24, window.innerHeight * 0.15);
      window.scrollTo({
        top: heroTop + heroHeight + padding,
        behavior: "smooth",
      });
      return;
    }

    if (next === 0) {
      window.scrollTo({ top: heroTop, behavior: "smooth" });
      return;
    }

    const inner = stageInner(next);
    const targetProgress = (next + inner) / STAGES;
    window.scrollTo({
      top: heroTop + scrollable * targetProgress,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const onGoStage0 = () => scrollToStage(0);
    window.addEventListener("arka:hero:stage0", onGoStage0);
    return () => window.removeEventListener("arka:hero:stage0", onGoStage0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Wheel / touch snap ───────────────────────────────────────
  useEffect(() => {
    let isScrolling = false;
    let touchStartY = 0;

    const inHero = () => {
      if (!heroRef.current) return false;
      const rect = heroRef.current.getBoundingClientRect();
      return rect.top <= 0 && rect.bottom >= 0;
    };

    const goToStage = (direction: number) => {
      if (isScrolling) return;
      const currentStage = parseInt(
        document.documentElement.dataset.heroStage ?? "0",
        10,
      );
      // Si estamos en el último stage y scrolleamos hacia abajo → salir del hero
      if (direction > 0 && currentStage >= STAGES - 1) {
        isScrolling = true;
        exitHero();
        setTimeout(() => {
          isScrolling = false;
        }, 900);
        return;
      }
      isScrolling = true;
      const next = clamp(currentStage + direction, 0, STAGES - 1);
      navStageRef.current = next;
      scrollToStage(next);
      setTimeout(() => {
        isScrolling = false;
      }, 700);
    };

    const onWheel = (e: WheelEvent) => {
      if (!inHero()) return;
      e.preventDefault();
      goToStage(e.deltaY > 0 ? 1 : -1);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!inHero()) return;
      e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!inHero()) return;
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 30) return;
      goToStage(diff > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exitHero]);

  // ── Scroll indicator ─────────────────────────────────────────
  // Visible en stages 0, 1 y 2. En el tercer click (current === 2) sale del hero.
  const showScrollIndicator = stage < STAGES - 1;

  const onScrollIndicatorClick = () => {
    const current = navStageRef.current;
    // Tercer click: current llega a 2 (STAGES - 2) → salir del hero directamente
    if (current >= STAGES - 2) {
      exitHero();
      return;
    }
    const next = clamp(current + 1, 0, STAGES - 1);
    navStageRef.current = next;
    scrollToStage(next);
  };

  // ── JSX ──────────────────────────────────────────────────────
  return (
    <section ref={heroRef} className={styles.hero} aria-label="ARKA Landing">
      {/* Video loader bar */}
      {barVisible && (
        <div className={styles.videoLoader} aria-hidden="true">
          <div className={styles.videoLoaderBar} />
        </div>
      )}

      {/* Video */}
      <div className={styles.media} aria-hidden="true">
        <video
          key={isMobile ? "mobile" : "desktop"}
          ref={videoRef}
          muted
          playsInline
          className={styles.mediaVideo}
          onCanPlayThrough={onVideoReady}
          onError={onVideoError}
          onTimeUpdate={onTimeUpdate}
          poster="/hero-poster.webp"
        >
          <source
            src={isMobile ? "/hero-video-mobile.mp4" : "/hero-video.mp4"}
            type="video/mp4"
          />
        </video>
      </div>

      {/* Overlay oscuro progresivo */}
      <div
        className={styles.overlay}
        style={{ opacity: overlayOpacity }}
        aria-hidden="true"
      />

      {/* Brand: logo + slogan */}
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
            style={{ opacity: h1Opacity, transform: `translateY(${h1Y}px)` }}
          >
            Administramos tu propiedad para rentas cortas en Santa Marta
          </h1>
        </div>
      )}

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <button
          className={styles.scrollIndicator}
          onClick={onScrollIndicatorClick}
          aria-label="Continuar"
        >
          <span className={styles.scrollCircle}>
            <span className={styles.scrollArrow} />
          </span>
        </button>
      )}
    </section>
  );
}
