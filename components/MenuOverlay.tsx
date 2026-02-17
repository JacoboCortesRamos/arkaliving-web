"use client";

import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import styles from "./MenuOverlay.module.css";

export function MenuOverlay({
  open,
  onClose,
  onOpenOwner,
}: {
  open: boolean;
  onClose: () => void;
  onOpenOwner: () => void;
}) {
  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.panel}>
        <nav className={styles.nav}>
          <button
            className={styles.linkBtn}
            onClick={() => {
              onClose();

              // Ir al inicio
              window.scrollTo({ top: 0, behavior: "instant" });

              // Resetear stage
              document.documentElement.setAttribute("data-hero-stage", "0");
            }}
          >
            HOME
          </button>

          <Link className={styles.link} href="/nosotros" onClick={onClose}>
            NOSOTROS
          </Link>

          <Link className={styles.link} href="/propiedades" onClick={onClose}>
            PROPIEDADES ARKA
          </Link>

          <button className={styles.linkBtn} onClick={onOpenOwner}>
            SOY PROPIETARIO
          </button>

          <Link
            className={styles.link}
            href="/postula-tu-propiedad"
            onClick={onClose}
          >
            POSTULA TU PROPIEDAD
          </Link>

          <Link className={styles.link} href="/contacto" onClick={onClose}>
            CONTACTO
          </Link>
        </nav>

        {/* Social Icons */}
        <div className={styles.socials}>
          <a
            href="https://instagram.com/arka_living.co"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Instagram"
          >
            <Instagram className={styles.socialIcon} />
          </a>

          <a
            href="https://wa.me/573158254384?text=Hola%20ARKA%2C%20quiero%20recibir%20informaci%C3%B3n."
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="WhatsApp"
          >
            <MessageCircle className={styles.socialIcon} />
          </a>
        </div>
      </div>
    </div>
  );
}
