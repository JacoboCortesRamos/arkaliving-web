"use client";

import { useState } from "react";
import {
  ChartNoAxesCombined,
  KeyRound,
  FileText,
  Plus,
  Minus,
} from "lucide-react";
import styles from "./SectionBeneficios.module.css";

const BENEFICIOS = [
  {
    id: "ingresos",
    icon: ChartNoAxesCombined,
    titulo: "Mejoramos tus ingresos",
    detalle: [
      "Precio dinámico ajustado día a día según demanda.",
      "Optimización de tarifas en temporada alta y baja.",
      "Reporte mensual de ingresos y ocupación.",
      "Comparativa de rendimiento frente al mercado local.",
    ],
  },
  {
    id: "gestion",
    icon: KeyRound,
    titulo: "Nos encargamos de la gestión completa de tu propiedad",
    detalle: [
      "Check-in y check-out sin que tengas que mover un dedo.",
      "Limpieza y mantenimiento coordinados profesionalmente.",
      "Atención al huésped 24/7 en todas las plataformas.",
      "Gestión de reviews para mantener alta calificación.",
    ],
  },
  {
    id: "reporte",
    icon: FileText,
    titulo: "Te presentamos un reporte semanal detallado",
    detalle: [
      "Resumen de reservas confirmadas y canceladas.",
      "Estado de la propiedad y novedades de mantenimiento.",
      "Proyección de ingresos para las próximas semanas.",
      "Acceso a historial completo desde tu portal.",
    ],
  },
];

export function SectionBeneficios() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className={styles.section} aria-labelledby="beneficios-titulo">
      <div className={styles.inner}>
        <h2 id="beneficios-titulo" className={styles.titulo}>
          Hacemos que tu propiedad trabaje para ti, sin dolores de cabeza
        </h2>

        <div className={styles.cards}>
          {BENEFICIOS.map(({ id, icon: Icon, titulo, detalle }) => {
            const isOpen = expanded.has(id);
            return (
              <article
                key={id}
                className={`${styles.card} ${isOpen ? styles.cardOpen : ""}`}
              >
                {/* Zona estática: texto → icono → botón, todo centrado */}
                <div className={styles.cardFace}>
                  <p className={styles.cardTitulo}>{titulo}</p>

                  <span className={styles.cardIcon} aria-hidden="true">
                    <Icon size={94} strokeWidth={1.2} />
                  </span>

                  <button
                    className={styles.cardToggle}
                    onClick={() => toggle(id)}
                    aria-expanded={isOpen}
                    aria-controls={`beneficio-detalle-${id}`}
                    aria-label={isOpen ? "Cerrar" : "Expandir"}
                  >
                    {isOpen ? (
                      <Minus size={20} strokeWidth={2} />
                    ) : (
                      <Plus size={20} strokeWidth={2} />
                    )}
                  </button>
                </div>

                {/* Panel expandible */}
                <div
                  id={`beneficio-detalle-${id}`}
                  className={styles.cardDetalle}
                  aria-hidden={!isOpen}
                >
                  <ul className={styles.detalleList}>
                    {detalle.map((item) => (
                      <li key={item} className={styles.detalleItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
