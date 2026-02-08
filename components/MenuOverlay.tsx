"use client";

import Link from "next/link";

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
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Menú">
      <div className="overlay__backdrop" onClick={onClose} />
      <div className="overlay__panel">
        <div className="overlay__top">
          <span className="overlay__title">Menú</span>
          <button className="overlay__close" onClick={onClose} aria-label="Cerrar menú">
            ✕
          </button>
        </div>

        <nav className="overlay__nav">
          <Link className="overlay__link" href="/" onClick={onClose}>
            HOME
          </Link>
          <Link className="overlay__link" href="/nosotros" onClick={onClose}>
            NOSOTROS
          </Link>
          <Link className="overlay__link" href="/propiedades" onClick={onClose}>
            PROPIEDADES ARKA
          </Link>

          <button className="overlay__linkBtn" onClick={onOpenOwner}>
            SOY PROPIETARIO
          </button>

          <Link className="overlay__link" href="/postula-tu-propiedad" onClick={onClose}>
            POSTULA TU PROPIEDAD
          </Link>
          <Link className="overlay__link" href="/contacto" onClick={onClose}>
            CONTACTO
          </Link>
        </nav>

        <div className="overlay__social">
          <a className="overlay__socialLink" href="#" target="_blank" rel="noreferrer">
            Instagram (pendiente)
          </a>
          <a className="overlay__socialLink" href="#" target="_blank" rel="noreferrer">
            Facebook (pendiente)
          </a>
        </div>
      </div>
    </div>
  );
}
