"use client";

import Link from "next/link";
import { Instagram, MessageCircleMore, Mail } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
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
  const scrollYRef = useRef(0);

  // ✅ Scroll lock sin jump y sin resetear stage
  useEffect(() => {
    if (!open) return;

    scrollYRef.current = window.scrollY;

    document.body.classList.add("menu-open");
    document.body.style.top = `-${scrollYRef.current}px`;

    return () => {
      document.body.classList.remove("menu-open");
      document.body.style.top = "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, [open]);

  if (!open) return null;

  // 🔥 FIX REAL: mismo comportamiento estable que el logo
  const goHomeStage0 = () => {
    onClose();

    const fireWhenReady = () => {
      const start = Date.now();

      const check = () => {
        const heroMounted =
          document.documentElement.dataset.heroStage !== undefined;

        if (heroMounted) {
          window.dispatchEvent(new Event("arka:hero:stage0"));
          return;
        }

        if (Date.now() - start > 1000) {
          window.dispatchEvent(new Event("arka:hero:stage0"));
          return;
        }

        requestAnimationFrame(check);
      };

      requestAnimationFrame(check);
    };

    if (pathname === "/") {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("arka:hero:stage0"));
      });
    } else {
      router.push("/");
      fireWhenReady();
    }
  };

  const onOwnerClick = () => {
    onClose();
    onOpenOwner();
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

          <button className={styles.linkBtn} onClick={onOwnerClick}>
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
            <MessageCircleMore className={styles.socialIcon} />
          </a>

          <a
            href="mailto:jacobocortes90@hotmail.com"
            className={styles.socialLink}
            aria-label="Email"
          >
            <Mail className={styles.socialIcon} />
          </a>
        </div>
      </div>
    </div>
  );
}
