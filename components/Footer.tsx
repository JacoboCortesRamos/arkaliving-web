"use client";

import { Instagram, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";
import ctaStyles from "./home/FloatingCTA.module.css";

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [heroStage, setHeroStage] = useState<string | null>(null);

  // ✅ Stage sync robusto: observa cambios en <html data-hero-stage="...">
  useEffect(() => {
    const el = document.documentElement;

    const readStage = () => {
      setHeroStage(el.dataset.heroStage ?? null);
    };

    readStage();

    const obs = new MutationObserver(readStage);
    obs.observe(el, { attributes: true, attributeFilter: ["data-hero-stage"] });

    // Fallback (por si algún flujo dispara eventos custom)
    window.addEventListener("arka:hero:stage0", readStage);

    return () => {
      obs.disconnect();
      window.removeEventListener("arka:hero:stage0", readStage);
    };
  }, []);

  const takeoverActive = useMemo(() => {
    return isHome && heroStage === "9";
  }, [isHome, heroStage]);

  return (
    <>
      {/* ✅ HOME: solo takeover (montado siempre en home; activo solo en stage 9) */}
      {isHome && (
        <section
          className={`${styles.takeover} ${
            takeoverActive ? styles.takeoverActive : ""
          }`}
          aria-label="ARKA Footer Takeover"
        >
          <div className={styles.takeoverInner}>
            {/* Centro (contenedores 1 y 2) */}
            <div className={styles.takeoverMain}>
              {/* Contenedor 1: Logo + slogan */}
              <div className={styles.takeoverBrand}>
                <img
                  src="/logo.png"
                  alt="ARKA"
                  className={styles.takeoverLogo}
                />
                <p className={styles.takeoverSlogan}>
                  Gestión inteligente de rentas cortas
                </p>
              </div>

              {/* Contenedor 2: CTA + Operamos */}
              <div className={styles.takeoverActions}>
                <Link
                  href="/postula-tu-propiedad"
                  className={`${styles.takeoverCTAWrapper} ${ctaStyles.btn}`}
                  // Si creaste noPulse, descomenta:
                  // className={`${styles.takeoverCTAWrapper} ${ctaStyles.btn} ${ctaStyles.noPulse}`}
                >
                  POSTULA TU PROPIEDAD AQUÍ
                </Link>

                <p className={styles.takeoverOp}>
                  Operamos en Santa Marta y Bogotá
                </p>
              </div>
            </div>

            {/* Contenedor 3: iconos + términos + copyright (anclado abajo) */}
            <div className={styles.takeoverLegal}>
              <div className={styles.takeoverLegalSocial}>
                <a
                  href="https://instagram.com/arka_living.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.takeoverSocialLink}
                  aria-label="Instagram"
                >
                  <Instagram className={styles.takeoverSocialIcon} />
                </a>

                <a
                  href="https://wa.me/573158254384?text=Hola%20ARKA%2C%20quiero%20recibir%20informaci%C3%B3n."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.takeoverSocialLink}
                  aria-label="WhatsApp"
                >
                  <MessageCircle className={styles.takeoverSocialIcon} />
                </a>
              </div>

              <a
                href="/terminos-y-condiciones"
                className={styles.takeoverTerms}
              >
                Términos y condiciones
              </a>

              <p className={styles.takeoverCopyright}>
                © 2026 Sitio web creado por JCR-Code
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ✅ NO HOME: footer normal siempre */}
      {!isHome && (
        <footer className={styles.footer} aria-label="ARKA Footer">
          <div className={styles.inner}>
            {/* Línea 1 */}
            <p className={styles.linePrimary}>
              Operamos en Santa Marta y Bogotá
            </p>

            {/* Línea 2 + 2.1 */}
            <div className={styles.socialRow}>
              {/* Instagram */}
              <div className={styles.socialItem}>
                <a
                  href="https://instagram.com/arka_living.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Instagram"
                >
                  <Instagram className={styles.socialIcon} />
                </a>
                <span className={styles.socialLabel}>¡Síguenos!</span>
              </div>

              {/* WhatsApp */}
              <div className={styles.socialItem}>
                <a
                  href="https://wa.me/573158254384?text=Hola%20ARKA%2C%20quiero%20recibir%20informaci%C3%B3n."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="WhatsApp"
                >
                  <MessageCircle className={styles.socialIcon} />
                </a>
                <span className={styles.socialLabel}>
                  ¿Dudas?
                  <br />
                  ¡Escríbenos!
                </span>
              </div>
            </div>

            {/* Línea 3 */}
            <div className={styles.bottomRow}>
              <a href="/terminos-y-condiciones" className={styles.bottomLink}>
                Términos y condiciones
              </a>

              <span className={styles.separator}>•</span>

              <span className={styles.copyright}>
                © 2026 Sitio web creado por JCR-Code
              </span>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
