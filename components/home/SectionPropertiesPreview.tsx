import Link from "next/link";

const preview = [
  { name: "Apartamento Terraz", city: "Santa Marta" },
  { name: "Apartamento Vitra", city: "Bogotá" },
  { name: "Habitaciones (Casa)", city: "Bogotá" },
];

export function SectionPropertiesPreview() {
  return (
    <section id="s3" className="section">
      <h2 className="section__h2">Propiedades ARKA</h2>
      <p className="section__p">
        Previsualización del portafolio. (Fotos y links finales pendientes)
      </p>

      <div className="grid">
        {preview.map((p) => (
          <div key={p.name} className="card">
            <div className="card__img" aria-hidden="true" />
            <div className="card__body">
              <h3 className="card__h3">{p.name}</h3>
              <p className="card__p">{p.city}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="section__cta">
        <Link className="btn btn--ghost" href="/propiedades">
          Ver todas las propiedades
        </Link>
      </div>
    </section>
  );
}
