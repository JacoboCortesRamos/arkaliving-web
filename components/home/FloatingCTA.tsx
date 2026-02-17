import styles from "./FloatingCTA.module.css";

export function FloatingCTA() {
  return (
    <div className={styles.wrap} data-cta="float" aria-live="polite">
      <a className={styles.btn} data-cta-btn href="/postula-tu-propiedad">
        <span className={styles.label}>
          <span>POSTULA TU PROPIEDAD AQUÍ</span>
        </span>
      </a>
    </div>
  );
}
