// components/Footer.tsx
import Link from "next/link";
import styles from "./Footer.module.css";

const WHATSAPP_NUMBER_E164 = "573158254384";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER_E164}`;

function InstagramIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-2.1a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 2a9.9 9.9 0 0 0-8.53 15l-1 3.64 3.72-.98A9.97 9.97 0 1 0 12 2Zm0 2a8 8 0 0 1 0 16 7.9 7.9 0 0 1-4-1.08l-.33-.2-2.2.58.59-2.12-.22-.35A8 8 0 0 1 12 4Zm4.63 11.07c-.2.57-1.1 1.05-1.73 1.19-.44.1-1 .18-2.9-.62-2.43-1.01-4-3.48-4.12-3.64-.13-.16-1-1.33-1-2.54 0-1.2.63-1.79.86-2.03.22-.24.48-.3.64-.3h.46c.15 0 .35-.05.55.42.2.48.7 1.72.76 1.84.06.12.1.27.02.44-.08.16-.12.27-.24.42-.12.15-.25.33-.35.44-.12.12-.25.25-.1.5.15.24.66 1.09 1.42 1.77.98.88 1.8 1.16 2.05 1.28.24.12.38.1.52-.06.15-.16.6-.7.76-.95.16-.24.32-.2.54-.12.22.08 1.38.65 1.62.77.24.12.4.18.46.28.06.1.06.59-.14 1.16Z"
      />
    </svg>
  );
}

export function Footer() {
  // TODO: pon aquí tu URL real de Instagram cuando esté lista
  const instagramHref = "#";

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Línea 1: ¡Síguenos! + Instagram */}
        <div className={styles.iconRow}>
          <span className={styles.line}>¡Síguenos!</span>
          <a
            className={styles.iconLink}
            href={instagramHref}
            target={instagramHref === "#" ? undefined : "_blank"}
            rel={instagramHref === "#" ? undefined : "noopener noreferrer"}
            aria-label="Instagram de ARKA"
          >
            <InstagramIcon />
          </a>
        </div>

        {/* Línea 2 */}
        <p className={styles.line}>Operamos en Santa Marta y Bogotá</p>

        {/* Línea 3 */}
        <div className={styles.whatsRow}>
          <span className={styles.line}>¿Dudas? • ¡Hablemos!</span>
          <a
            className={styles.iconLink}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chatear por WhatsApp"
            title="Chatear por WhatsApp"
          >
            <WhatsAppIcon />
          </a>
        </div>

        {/* Línea 4 */}
        <div className={styles.bottomRow}>
          <div className={styles.bottomLinks}>
            <span
              className={`${styles.link} ${styles.muted}`}
              aria-label="Créditos"
            >
              © 2026 Sitio web creado por JCR-Code
            </span>
            <span className={styles.separator} aria-hidden="true">
              •
            </span>
            <Link className={styles.link} href="/terminos-y-condiciones">
              Términos y condiciones
            </Link>
          </div>
        </div>
      </div>

      {/* sentinel (por si lo quieres reutilizar luego) */}
      <div id="footer-sentinel" style={{ height: 1 }} aria-hidden="true" />
    </footer>
  );
}
