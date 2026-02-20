"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MenuOverlay } from "./MenuOverlay";
import { OwnerLoginModal } from "./OwnerLoginModal";
import styles from "./Header.module.css";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ lock scroll solo cuando overlay o modal están abiertos
  useEffect(() => {
    const anyOpen = menuOpen || ownerOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, ownerOpen]);

  // ✅ señal global para cambiar color del burger / X
  useEffect(() => {
    const el = document.documentElement;
    if (menuOpen) el.dataset.menuOpen = "true";
    else delete el.dataset.menuOpen;
  }, [menuOpen]);

  const goHomeStage0 = (e?: React.MouseEvent) => {
    e?.preventDefault();

    setMenuOpen(false);
    setOwnerOpen(false);

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
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.solid : styles.clear}`}
      >
        <div className={styles.inner}>
          <Link
            className={styles.logo}
            href="/"
            aria-label="Ir al inicio"
            onClick={goHomeStage0}
          >
            <img
              src="/logo-crema.png"
              alt="ARKA Living"
              className={styles.logoImg}
            />
          </Link>
        </div>
      </header>

      <button
        className={styles.burger}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
      >
        <span
          className={`${styles.line} ${menuOpen ? styles.openTop : styles.top}`}
        />
        <span
          className={`${styles.line} ${menuOpen ? styles.openBot : styles.bot}`}
        />
      </button>

      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenOwner={() => {
          setMenuOpen(false);
          setOwnerOpen(true);
        }}
      />

      <OwnerLoginModal open={ownerOpen} onClose={() => setOwnerOpen(false)} />
    </>
  );
}
