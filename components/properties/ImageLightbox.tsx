"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./ImageLightbox.module.css";

interface Props {
  images: string[];
  alt: string;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ImageLightbox({
  images,
  alt,
  currentIndex,
  onClose,
  onNavigate,
}: Props) {
  const total = images.length;

  const prev = useCallback(() => {
    onNavigate(currentIndex === 0 ? total - 1 : currentIndex - 1);
  }, [currentIndex, total, onNavigate]);

  const next = useCallback(() => {
    onNavigate(currentIndex === total - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, total, onNavigate]);

  // Teclado: ← → Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, onClose]);

  // Bloquear scroll del body mientras está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Swipe táctil
  useEffect(() => {
    let startX = 0;

    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const onEnd = (e: TouchEvent) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) < 40) return;
      diff > 0 ? next() : prev();
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [prev, next]);

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de fotos — ${alt}`}
    >
      <div className={styles.box} onClick={(e) => e.stopPropagation()}>
        {/* Imagen principal */}
        <div className={styles.main}>
          {/* Cerrar — dentro de la imagen, esquina sup derecha */}
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Cerrar galería"
          >
            <X className={styles.closeIcon} strokeWidth={2} />
          </button>

          <Image
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${alt} — foto ${currentIndex + 1}`}
            fill
            className={styles.mainImg}
            sizes="(max-width: 960px) 100vw, 960px"
            priority
          />

          {/* Flecha izquierda */}
          {total > 1 && (
            <button
              className={`${styles.arrow} ${styles.arrowLeft}`}
              onClick={prev}
              aria-label="Foto anterior"
            >
              <ChevronLeft className={styles.arrowIcon} strokeWidth={2.5} />
            </button>
          )}

          {/* Flecha derecha */}
          {total > 1 && (
            <button
              className={`${styles.arrow} ${styles.arrowRight}`}
              onClick={next}
              aria-label="Foto siguiente"
            >
              <ChevronRight className={styles.arrowIcon} strokeWidth={2.5} />
            </button>
          )}

          {/* Counter */}
          {total > 1 && (
            <span className={styles.counter}>
              {currentIndex + 1} / {total}
            </span>
          )}
        </div>

        {/* Thumbnails */}
        {total > 1 && (
          <div className={styles.thumbs} role="list">
            {images.map((src, i) => (
              <button
                key={src}
                role="listitem"
                className={`${styles.thumb} ${
                  i === currentIndex ? styles.thumbActive : ""
                }`}
                onClick={() => onNavigate(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === currentIndex}
              >
                <Image
                  src={src}
                  alt={`${alt} miniatura ${i + 1}`}
                  fill
                  className={styles.thumbImg}
                  sizes="72px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
