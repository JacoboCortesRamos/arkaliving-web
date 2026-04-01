"use client";

import { X } from "lucide-react";
import styles from "./OwnerLoginModal.module.css";

export function OwnerLoginModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Soy propietario"
    >
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.panel}>
        <button className={styles.close} onClick={onClose} aria-label="Cerrar">
          <X className={styles.closeIcon} />
        </button>

        <div className={styles.content}>
          <span className={styles.label}>Portal propietarios</span>

          <h2 className={styles.title}>¿Eres propietario?</h2>

          <p className={styles.body}>
            Estamos construyendo el portal ARKA para que puedas ver en tiempo
            real el desempeño de tu propiedad: ocupación, ingresos y bloqueos de
            calendario.
          </p>

          <p className={styles.body}>
            Muy pronto estará disponible. Si ya haces parte de ARKA, te
            notificaremos en cuanto puedas acceder.
          </p>

          <div className={styles.badge}>Muy pronto</div>
        </div>
      </div>
    </div>
  );
}
