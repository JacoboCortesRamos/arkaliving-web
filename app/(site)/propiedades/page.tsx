import type { Metadata } from "next";
import { PropertiesGrid } from "@/components/properties/PropertiesGrid";
import { getActiveProperties } from "@/lib/properties";

// ── Metadata SEO ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Propiedades ARKA | Alojamientos de renta corta en Santa Marta",
  description:
    "Descubre las propiedades gestionadas por ARKA Living en Santa Marta. Apartamentos y casas diseñados y operados con estándares profesionales para rentas cortas.",
  openGraph: {
    title: "Propiedades ARKA | Alojamientos en Santa Marta",
    description:
      "Apartamentos y casas en Santa Marta operados por ARKA Living. Calidad, cuidado y rigor en cada detalle.",
    url: "https://arkaliving.co/propiedades",
    siteName: "ARKA Living",
    locale: "es_CO",
    type: "website",
  },
  alternates: {
    canonical: "https://arkaliving.co/propiedades",
  },
};

// ── JSON-LD ───────────────────────────────────────────────────
function JsonLd() {
  const properties = getActiveProperties();

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Propiedades ARKA Living en Santa Marta",
    url: "https://arkaliving.co/propiedades",
    numberOfItems: properties.length,
    itemListElement: properties.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      description: p.shortDescription,
      url:
        p.airbnbUrl && p.airbnbUrl !== "#"
          ? p.airbnbUrl
          : "https://arkaliving.co/propiedades",
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function PropiedadesPage() {
  return (
    <>
      <JsonLd />

      <main
        style={{
          paddingTop: "calc(var(--header-h) + 48px)",
          paddingBottom: 120,
          background: "var(--arka-white)",
          minHeight: "100vh",
        }}
      >
        {/* ── Header de sección ── */}
        <section
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 var(--edge-space) 64px",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--arka-brown-mid)",
              marginBottom: 16,
            }}
          >
            Santa Marta, Colombia
          </p>

          <h1
            style={{
              fontFamily: "var(--font-display, Georgia, serif)",
              fontSize: "clamp(38px, 6vw, 72px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "var(--arka-brown-dark)",
              margin: "0 0 24px",
            }}
          >
            Propiedades ARKA
          </h1>

          <p
            style={{
              fontSize: "clamp(17px, 2vw, 20px)",
              lineHeight: 1.65,
              color: "var(--arka-text-soft)",
              maxWidth: 560,
              margin: 0,
            }}
          >
            Espacios diseñados, operados y cuidados bajo el{" "}
            <strong
              style={{ color: "var(--arka-brown-dark)", fontWeight: 600 }}
            >
              Sistema ARKA
            </strong>
            . Cada propiedad refleja nuestro estándar de rigor y detalle.
          </p>

          {/* Divisor de marca */}
          <div
            style={{
              marginTop: 36,
              height: 2,
              width: 72,
              background: "var(--arka-brown-light)",
              borderRadius: 2,
            }}
          />
        </section>

        {/* ── Grid ── */}
        <section
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 var(--edge-space)",
          }}
        >
          <PropertiesGrid />
        </section>

        {/* ── CTA propietario ── */}
        <section
          style={{
            maxWidth: 720,
            margin: "80px auto 0",
            padding: "0 var(--edge-space)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              padding: "40px 36px",
              background: "rgba(167, 126, 77, 0.07)",
              border: "1px solid rgba(167, 126, 77, 0.18)",
              borderRadius: 20,
            }}
          >
            <p
              style={{
                fontSize: "clamp(18px, 2vw, 22px)",
                fontWeight: 600,
                color: "var(--arka-brown-dark)",
                margin: "0 0 8px",
              }}
            >
              ¿Tienes una propiedad en Santa Marta?
            </p>
            <p
              style={{
                fontSize: 15,
                color: "var(--arka-text-soft)",
                margin: "0 0 24px",
                lineHeight: 1.6,
              }}
            >
              Postúlala y te mostramos cómo puede rendir más bajo nuestra
              gestión.
            </p>
            <a
              href="/postula-tu-propiedad"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 28px",
                background: "var(--arka-brown-dark)",
                color: "var(--arka-white)",
                borderRadius: 100,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.03em",
                textDecoration: "none",
              }}
            >
              Postula tu propiedad
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
