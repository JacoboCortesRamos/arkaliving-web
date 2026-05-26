"use client";

import { useState } from "react";
import Image from "next/image";
import { BedDouble, Bath, Users, ArrowRight, Home, Images } from "lucide-react";
import type { IProperty } from "@/lib/properties";
import { ImageLightbox } from "./ImageLightbox";
import styles from "./PropertyCard.module.css";

interface Props {
  property: IProperty;
}

export function PropertyCard({ property }: Props) {
  const {
    name,
    city,
    sector,
    bedrooms,
    bathrooms,
    beds,
    guests,
    coverImage,
    images,
    shortDescription,
    features,
    airbnbUrl,
    bookingUrl,
  } = property;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const ctaUrl = airbnbUrl && airbnbUrl !== "#" ? airbnbUrl : bookingUrl;
  const hasRealImage = coverImage && coverImage !== "";
  const hasRealCta = ctaUrl && ctaUrl !== "#";

  // Galería: usa images si existen, si no solo la cover
  const gallery =
    images && images.length > 0 ? images : hasRealImage ? [coverImage] : [];
  const hasGallery = gallery.length > 0;

  function openLightbox(index = 0) {
    if (!hasGallery) return;
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  return (
    <>
      <article className={styles.card}>
        {/* ── Imagen ── */}
        <div
          className={`${styles.imageWrap} ${hasGallery ? styles.imageWrapClickable : ""}`}
          onClick={() => openLightbox(0)}
          role={hasGallery ? "button" : undefined}
          tabIndex={hasGallery ? 0 : undefined}
          aria-label={hasGallery ? `Ver fotos de ${name}` : undefined}
          onKeyDown={(e) => {
            if (hasGallery && (e.key === "Enter" || e.key === " "))
              openLightbox(0);
          }}
        >
          {hasRealImage ? (
            <Image
              src={coverImage}
              alt={`${name} — ${city}`}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <Home className={styles.placeholderIcon} strokeWidth={1.2} />
            </div>
          )}

          <span className={styles.badge}>{city}</span>

          {/* Badge con número de fotos */}
          {gallery.length > 1 && (
            <span className={styles.galleryBadge} aria-hidden="true">
              <Images size={13} strokeWidth={2} />
              {gallery.length}
            </span>
          )}
        </div>

        {/* ── Cuerpo ── */}
        <div className={styles.body}>
          <p className={styles.sector}>{sector}</p>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.description}>{shortDescription}</p>

          {/* Meta */}
          <div className={styles.meta}>
            <div className={styles.metaRow}>
              <span className={styles.metaItem}>
                <BedDouble className={styles.metaIcon} strokeWidth={1.6} />
                {bedrooms} {bedrooms === 1 ? "habitación" : "habitaciones"}
              </span>
              <span className={styles.metaItem}>
                <Bath className={styles.metaIcon} strokeWidth={1.6} />
                {bathrooms} {bathrooms === 1 ? "baño" : "baños"}
              </span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaItem}>
                <Users className={styles.metaIcon} strokeWidth={1.6} />
                {beds} {beds === 1 ? "cama" : "camas"} · {guests}{" "}
                {guests === 1 ? "huésped" : "huéspedes"}
              </span>
            </div>
          </div>

          {/* Features */}
          {features.length > 0 && (
            <ul className={styles.features} aria-label="Características">
              {features.slice(0, 5).map((f) => (
                <li key={f} className={styles.feature}>
                  {f}
                </li>
              ))}
            </ul>
          )}

          <hr className={styles.divider} />

          {/* CTA */}
          {hasRealCta ? (
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
              aria-label={`Ver ${name} en ${
                airbnbUrl && airbnbUrl !== "#" ? "Airbnb" : "Booking"
              }`}
            >
              Ver en {airbnbUrl && airbnbUrl !== "#" ? "Airbnb" : "Booking"}
              <ArrowRight className={styles.ctaIcon} strokeWidth={2} />
            </a>
          ) : (
            <a
              href={`https://wa.me/573158254384?text=Hola%20ARKA%2C%20me%20interesa%20${encodeURIComponent(
                name,
              )}%20en%20${encodeURIComponent(city)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
              aria-label={`Consultar disponibilidad de ${name} por WhatsApp`}
            >
              Consultar disponibilidad
              <ArrowRight className={styles.ctaIcon} strokeWidth={2} />
            </a>
          )}
        </div>
      </article>

      {/* Lightbox */}
      {lightboxOpen && hasGallery && (
        <ImageLightbox
          images={gallery}
          alt={name}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
