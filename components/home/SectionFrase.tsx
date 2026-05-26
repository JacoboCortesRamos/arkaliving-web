import styles from "./SectionFrase.module.css";

export function SectionFrase() {
  return (
    <section className={styles.section} aria-label="Frase ARKA">
      <div className={styles.inner}>
        <p className={styles.frase}>
          <span className={styles.linea1}>Nada en el mundo</span>
          <span className={styles.linea2}>de las rentas cortas</span>
          <span className={styles.linea3}>
            es fácil<span className={styles.coma}>,</span>
          </span>
        </p>
      </div>
    </section>
  );
}
