"use client";

import { Instagram, MessageCircle } from "lucide-react";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Línea 1 */}
        <p className={styles.linePrimary}>Operamos en Santa Marta y Bogotá</p>

        {/* Línea 2 + 2.1 */}
        <div className={styles.socialRow}>
          {/* Instagram */}
          <div className={styles.socialItem}>
            <a
              href="https://instagram.com/arka_living.co"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <Instagram className={styles.socialIcon} />
            </a>
            <span className={styles.socialLabel}>¡Síguenos!</span>
          </div>

          {/* WhatsApp */}
          <div className={styles.socialItem}>
            <a
              href="https://wa.me/573158254384?text=Hola%20ARKA%2C%20quiero%20recibir%20informaci%C3%B3n."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="WhatsApp"
            >
              <MessageCircle className={styles.socialIcon} />
            </a>
            <span className={styles.socialLabel}>
              ¿Dudas?
              <br />
              ¡Escríbenos!
            </span>
          </div>
        </div>

        {/* Línea 3 */}
        <div className={styles.bottomRow}>
          <a href="/terminos-y-condiciones" className={styles.bottomLink}>
            Términos y condiciones
          </a>

          <span className={styles.separator}>•</span>

          <span className={styles.copyright}>
            © 2026 Sitio web creado por JCR-Code
          </span>
        </div>
      </div>
    </footer>
  );
}
