"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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

function rangeFraction(t: number, start: number, end: number) {
  return clamp((t - start) / (end - start), 0, 1);
}

const STAGES = 8;

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

  // ── Overlay ──────────────────────────────────────────────────
  const overlayT = clamp(progress * 1.9, 0, 1);
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
    const fadeOut = easeOutCubic(rangeFraction(sp, 0.4, 0.65));
    brandOpacity = 1 - fadeOut;
  } else {
    brandOpacity = 0;
  }

  const brandCompact = stage >= 1;

  // ── H1 ───────────────────────────────────────────────────────
  const showH1 = stage === 2 || stage === 3;
  const H1_IN_END = 0.25;
  const h1EnterT = easeOutCubic(rangeFraction(sp, 0, H1_IN_END));
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

  // ── H3 + pasos ───────────────────────────────────────────────
  const showH3 = stage >= 3;
  const stepCount = stage >= 6 ? 3 : stage >= 5 ? 2 : stage >= 4 ? 1 : 0;

  const h3T =
    stage === 3
      ? easeOutCubic(rangeFraction(sp, 0.75, 1.0))
      : stage > 3
        ? 1
        : 0;

  const h3Style = {
    opacity: h3T,
    transform: `translateY(${lerp(80, -20, h3T)}px)`,
  } as const;

  const enterStyle = (itemStage: number) => {
    if (stage < itemStage) return { opacity: 0, transform: "translateY(80px)" };
    const t =
      stage === itemStage ? easeOutCubic(rangeFraction(sp, 0.2, 0.9)) : 1;
    return {
      opacity: t,
      transform: `translateY(${lerp(80, -20, t)}px)`,
    } as const;
  };

  // ── scrollToStage ────────────────────────────────────────────
  const stageInner = (targetStage: number) => {
    if (targetStage === 2) return 0.5;
    if (targetStage === 3) return 0.85;
    if (targetStage >= 4 && targetStage <= 6) return 0.9;
    return 0.55;
  };

  const scrollToStage = (targetStage: number) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const heroTop = window.scrollY + rect.top;
    const heroHeight = heroRef.current.offsetHeight;
    const next = clamp(targetStage, 0, 7);

    if (next >= 7) {
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
      top: heroTop + heroHeight * targetProgress,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const onGoStage0 = () => scrollToStage(0);
    window.addEventListener("arka:hero:stage0", onGoStage0);
    return () => window.removeEventListener("arka:hero:stage0", onGoStage0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      isScrolling = true;
      const currentStage = parseInt(
        document.documentElement.dataset.heroStage ?? "0",
        10,
      );
      const next = clamp(currentStage + direction, 0, 7);
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
  }, []);

  const showScrollIndicator = stage < 7;

  const onScrollIndicatorClick = () => {
    const next = clamp(navStageRef.current + 1, 0, 7);
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

      {/* H3 + pasos */}
      {showH3 && (
        <div className={styles.stepsWrap}>
          <h3 className={styles.h3} style={h3Style}>
            Rentabiliza tu propiedad en 3 simples pasos:
          </h3>

          <ol className={styles.steps}>
            {stepCount >= 1 && (
              <li className={styles.step} style={enterStyle(4)}>
                <span className={styles.stepIconWrap} aria-hidden="true">
                  <HousePlus className={styles.stepIcon} strokeWidth={1.6} />
                </span>
                <span className={styles.stepText}>
                  1. Postula tu propiedad.
                </span>
              </li>
            )}
            {stepCount >= 2 && (
              <li className={styles.step} style={enterStyle(5)}>
                <span className={styles.stepIconWrap} aria-hidden="true">
                  <Gem className={styles.stepIcon} strokeWidth={1.6} />
                </span>
                <span className={styles.stepText}>
                  2. Te presentamos una oferta clara y transparente.
                </span>
              </li>
            )}
            {stepCount >= 3 && (
              <li className={styles.step} style={enterStyle(6)}>
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
