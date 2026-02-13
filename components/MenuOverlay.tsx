"use client";

import Link from "next/link";
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
          <Link className={styles.link} href="/" onClick={onClose}>
            HOME
          </Link>
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

        <div className={styles.socials}>
          <a
            className={styles.socialLink}
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img src="/instagram-bn.png" alt="Instagram" />
          </a>
          <a
            className={styles.socialLink}
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <img src="/facebook-bn.png" alt="Facebook" />
          </a>
        </div>
      </div>
    </div>
  );
}
