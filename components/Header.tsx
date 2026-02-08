"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MenuOverlay } from "./MenuOverlay";
import { OwnerLoginModal } from "./OwnerLoginModal";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll when overlays are open
  useEffect(() => {
    const anyOpen = menuOpen || ownerOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, ownerOpen]);

  return (
    <>
      <header className={`header ${scrolled ? "header--solid" : "header--clear"}`}>
        <div className="header__inner">
          <Link className="header__logo" href="/">
            ARKA
          </Link>

          <button
            className="header__menuBtn"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            Menú
          </button>
        </div>
      </header>

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
