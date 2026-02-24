import Link from "next/link";
import { Gem, Handshake, HousePlus } from "lucide-react";

export function SectionSteps() {
  return (
    <section id="s2" className="section">
      <h2 className="section__h2">Tu progreso en tres simples pasos</h2>

      <ol className="steps mt-10 flex flex-col gap-6">
        {/* Step 1 */}
        <li className="steps__item flex items-start gap-4">
          <div className="steps__iconWrap flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[rgba(167,126,77,0.14)]">
            <HousePlus
              className="steps__icon h-6 w-6 text-[var(--arka-brown-mid)]"
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </div>

          <div className="steps__content">
            <h3 className="steps__h3 m-0 text-[18px] leading-tight">
              Postula tu propiedad
            </h3>
            <p className="steps__p mt-2 mb-0 text-[14px] leading-snug text-[var(--arka-text-soft)]">
              Completa el formulario con la información básica.
            </p>
          </div>
        </li>

        {/* Step 2 */}
        <li className="steps__item flex items-start gap-4">
          <div className="steps__iconWrap flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[rgba(167,126,77,0.14)]">
            <Gem
              className="steps__icon h-6 w-6 text-[var(--arka-brown-mid)]"
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </div>

          <div className="steps__content">
            <h3 className="steps__h3 m-0 text-[18px] leading-tight">
              Estudia nuestra oferta
            </h3>
            <p className="steps__p mt-2 mb-0 text-[14px] leading-snug text-[var(--arka-text-soft)]">
              Te enviamos una propuesta clara y sin letras pequeñas.
            </p>
          </div>
        </li>

        {/* Step 3 */}
        <li className="steps__item flex items-start gap-4">
          <div className="steps__iconWrap flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[rgba(167,126,77,0.14)]">
            <Handshake
              className="steps__icon h-6 w-6 text-[var(--arka-brown-mid)]"
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </div>

          <div className="steps__content">
            <h3 className="steps__h3 m-0 text-[18px] leading-tight">
              Firmemos el contrato
            </h3>
            <p className="steps__p mt-2 mb-0 text-[14px] leading-snug text-[var(--arka-text-soft)]">
              Arrancamos operación y preparación del inmueble.
            </p>
          </div>
        </li>
      </ol>

      <div className="section__cta mt-10">
        <Link className="btn" href="/postula-tu-propiedad">
          Postula tu propiedad aquí
        </Link>
      </div>
    </section>
  );
}
