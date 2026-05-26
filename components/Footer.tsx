"use client";

import { Instagram, MessageCircleMore, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";
import ctaStyles from "./home/FloatingCTA.module.css";

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [takeoverSignal, setTakeoverSignal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Estado visual congelado: no cambia mientras el menú está abierto
  const [takeoverFrozen, setTakeoverFrozen] = useState(false);

  useEffect(() => {
    const el = document.documentElement;

    const read = () => {
      const isMenuOpen = el.dataset.menuOpen === "true";
      const isTakeover = el.dataset.takeoverActive === "true";
      setMenuOpen(isMenuOpen);
      setTakeoverSignal(isTakeover);
      // Solo actualizar el estado visual cuando el menú está cerrado
      if (!isMenuOpen) {
        setTakeoverFrozen(isTakeover);
      }
    };

    read();

    const obs = new MutationObserver(read);
    obs.observe(el, {
      attributes: true,
      attributeFilter: ["data-takeover-active", "data-menu-open"],
    });

    window.addEventListener("arka:hero:stage0", read);

    return () => {
      obs.disconnect();
      window.removeEventListener("arka:hero:stage0", read);
    };
  }, []);

  // El estado visual usa takeoverFrozen — congelado mientras el menú está abierto
  const takeoverActive = useMemo(() => {
    return isHome && takeoverFrozen;
  }, [isHome, takeoverFrozen]);

  return (
    <>
      {isHome && (
        <section
          className={`${styles.takeover} ${
            takeoverActive ? styles.takeoverActive : ""
          }`}
          aria-label="ARKA Footer Takeover"
        >
          <div className={styles.takeoverInner}>
            <div className={styles.takeoverMain}>
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

              <div className={styles.takeoverActions}>
                <Link
                  href="/postula-tu-propiedad"
                  className={`${styles.takeoverCTAWrapper} ${ctaStyles.btn}`}
                >
                  POSTULA TU PROPIEDAD
                </Link>
                <p className={styles.takeoverOp}>Operamos en Santa Marta</p>
              </div>
            </div>

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
                  <MessageCircleMore className={styles.takeoverSocialIcon} />
                </a>
                <a
                  href="mailto:jacobocortes90@hotmail.com"
                  className={styles.takeoverSocialLink}
                  aria-label="Email"
                >
                  <Mail className={styles.takeoverSocialIcon} />
                </a>
              </div>

              <div className={styles.takeoverLegalLinks}>
                <a
                  href="/terminos-y-condiciones"
                  className={styles.takeoverTerms}
                >
                  Términos y condiciones
                </a>
                <span className={styles.takeoverLegalDot} aria-hidden="true">
                  ·
                </span>
                <a
                  href="/politica-de-privacidad"
                  className={styles.takeoverTerms}
                >
                  Política de Privacidad
                </a>
              </div>

              <p className={styles.takeoverCopyright}>
                © 2026 Sitio web creado por JCR-Code
              </p>
            </div>
          </div>
        </section>
      )}

      <footer className={styles.footerSlim}>
        <div className={styles.footerSlimInner}>
          <div className={styles.footerSlimSocial}>
            <a
              href="https://instagram.com/arka_living.co"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className={styles.footerSlimIcon} />
            </a>
            <a
              href="https://wa.me/573158254384?text=Hola%20ARKA%2C%20quiero%20recibir%20informaci%C3%B3n."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <MessageCircleMore className={styles.footerSlimIcon} />
            </a>
            <a href="mailto:jacobocortes90@hotmail.com" aria-label="Email">
              <Mail className={styles.footerSlimIcon} />
            </a>
          </div>

          <div className={styles.footerSlimLegalLinks}>
            <a
              href="/terminos-y-condiciones"
              className={styles.footerSlimTerms}
            >
              Términos y condiciones
            </a>
            <span className={styles.footerSlimLegalDot} aria-hidden="true">
              ·
            </span>
            <a
              href="/politica-de-privacidad"
              className={styles.footerSlimTerms}
            >
              Política de Privacidad
            </a>
          </div>

          <p className={styles.footerSlimCopy}>
            © 2026 Sitio web creado por JCR-Code
          </p>
        </div>
      </footer>
    </>
  );
}
