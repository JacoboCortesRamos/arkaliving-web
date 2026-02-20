"use client";

import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();

  if (!open) return null;

  const goHomeStage0 = () => {
    onClose();

    const fire = () => {
      window.dispatchEvent(new Event("arka:hero:stage0"));
    };

    if (pathname !== "/") {
      router.push("/");
      window.setTimeout(fire, 80);
    } else {
      fire();
    }
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.panel}>
        <nav className={styles.nav}>
          <button className={styles.linkBtn} onClick={goHomeStage0}>
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
