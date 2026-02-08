import Link from "next/link";

export function Hero() {
  return (
    <section className="hero" aria-label="ARKA Hero">
      {/* Placeholder poster (luego será video/poster inteligente) */}
      <div className="hero__media" aria-hidden="true" />

      <div className="hero__content">
        <p className="hero__slogan">Gestión inteligente de rentas cortas</p>
        <h1 className="hero__h1">Tu progreso en manos proactivas</h1>

        <div className="hero__actions">
          <Link className="btn" href="/postula-tu-propiedad">
            Postula tu propiedad
          </Link>
          <a className="btn btn--ghost" href="#s1">
            Ver cómo funciona
          </a>
        </div>
      </div>
    </section>
  );
}
