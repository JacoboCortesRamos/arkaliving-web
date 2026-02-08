"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function FloatingCTA() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("footer-sentinel");
    if (!sentinel) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setHidden(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`ctaFloat ${hidden ? "ctaFloat--hidden" : ""}`}>
      <Link className="ctaFloat__btn" href="/postula-tu-propiedad">
        POSTULA TU PROPIEDAD AQUÍ
      </Link>
    </div>
  );
}
