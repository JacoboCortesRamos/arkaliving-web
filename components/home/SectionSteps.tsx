import Link from "next/link";

export function SectionSteps() {
  return (
    <section id="s2" className="section">
      <h2 className="section__h2">Tu progreso en tres simples pasos</h2>

      <ol className="steps">
        <li className="steps__item">
          <span className="steps__n">1</span>
          <div>
            <h3 className="steps__h3">Postula tu propiedad</h3>
            <p className="steps__p">Completa el formulario con la información básica.</p>
          </div>
        </li>
        <li className="steps__item">
          <span className="steps__n">2</span>
          <div>
            <h3 className="steps__h3">Estudia nuestra oferta</h3>
            <p className="steps__p">Te enviamos una propuesta clara y sin letras pequeñas.</p>
          </div>
        </li>
        <li className="steps__item">
          <span className="steps__n">3</span>
          <div>
            <h3 className="steps__h3">Firmemos el contrato</h3>
            <p className="steps__p">Arrancamos operación y preparación del inmueble.</p>
          </div>
        </li>
      </ol>

      <div className="section__cta">
        <Link className="btn" href="/postula-tu-propiedad">
          Postula tu propiedad aquí
        </Link>
      </div>
    </section>
  );
}
