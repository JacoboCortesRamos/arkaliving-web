import { HousePlus, Gem, Handshake } from "lucide-react";
import styles from "./SectionPasos.module.css";

const PASOS = [
  {
    num: "1",
    icon: HousePlus,
    texto: "Postula tu propiedad.",
  },
  {
    num: "2",
    icon: Gem,
    texto: "Te presentamos una oferta clara y transparente.",
  },
  {
    num: "3",
    icon: Handshake,
    texto: "Firmamos y nos encargamos de todo.",
  },
];

export function SectionPasos() {
  return (
    <section className={styles.section} aria-labelledby="pasos-titulo">
      <div className={styles.inner}>
        <h2 id="pasos-titulo" className={styles.titulo}>
          ARKA lo hace <span className={styles.tituloFacil}>fácil</span> por ti
          en tres simples pasos
        </h2>

        <ol className={styles.pasos}>
          {PASOS.map(({ num, icon: Icon, texto }) => (
            <li key={num} className={styles.paso}>
              <span className={styles.pasoIconWrap} aria-hidden="true">
                <Icon size={32} strokeWidth={1.4} />
              </span>
              <span className={styles.pasoNum} aria-hidden="true">
                {num}.
              </span>
              <span className={styles.pasoTexto}>{texto}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
