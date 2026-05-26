"use client";

import { useEffect, useState } from "react";

export function OrientationLock() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const check = () => {
      // Solo activar en dispositivos donde el ancho EN PORTRAIT sería <= 768px.
      // Usamos el mínimo entre ancho y alto para inferir el ancho natural del device.
      const narrowSide = Math.min(window.innerWidth, window.innerHeight);
      const isMobileDevice = narrowSide <= 480;
      setIsLandscape(isMobileDevice && window.innerWidth > window.innerHeight);
    };

    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  if (!isLandscape) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#4a3424",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "0 40px",
        textAlign: "center",
      }}
    >
      {/* Ícono de rotación en marrón claro */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#c8a67a"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ opacity: 0.9 }}
      >
        <path d="M17 1l4 4-4 4" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <path d="M7 23l-4-4 4-4" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>

      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-display, serif)",
          fontSize: "clamp(18px, 4vw, 22px)",
          fontWeight: 600,
          color: "#fdfcf9",
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
        }}
      >
        Por favor rota tu dispositivo
      </p>

      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-body, sans-serif)",
          fontSize: "clamp(13px, 3vw, 15px)",
          color: "rgba(253, 252, 249, 0.6)",
          lineHeight: 1.6,
        }}
      >
        Esta experiencia está optimizada para verse en vertical.
      </p>
    </div>
  );
}
