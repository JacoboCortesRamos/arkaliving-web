"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function FloatingCTA() {
  // Por ahora NO ocultamos el CTA.
  // Solo detectamos si el footer está entrando en viewport (via sentinel)
  // y dejamos un flag listo para futuros comportamientos.
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("footer-sentinel");
    if (!sentinel) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const isInView = entry.isIntersecting;
        setFooterInView(isInView);

        // Flag global opcional (no hace nada por sí solo).
        // Te permite luego hacer CSS tipo:
        // html[data-footer-in-view="true"] .ctaFloat { ... }
        document.documentElement.dataset.footerInView = String(isInView);
      },
      { threshold: 0.1 }
    );

    io.observe(sentinel);

    return () => {
      io.disconnect();
      delete document.documentElement.dataset.footerInView;
    };
  }, []);

  return (
    <div className="ctaFloat" data-footer-in-view={footerInView ? "true" : "false"}>
      <Link className="ctaFloat__btn" href="/postula-tu-propiedad">
        POSTULA TU PROPIEDAD AQUÍ
      </Link>
    </div>
  );
}
