// ============================================================
// lib/properties.ts
// Source of truth de propiedades para el MVP.
// TODO: reemplazar `PROPERTIES` por fetch a /api/properties
//       cuando MongoDB esté conectado (Paso 4 del roadmap).
// ============================================================

export interface IProperty {
  id: string;
  slug: string;
  name: string;
  city: "Santa Marta";
  sector: string;
  type: "Estudio" | "Apartamento" | "Casa";
  bedrooms: number;
  bathrooms: number;
  beds: number;
  guests: number;
  coverImage: string;
  images: string[];
  shortDescription: string;
  features: string[];
  airbnbUrl?: string;
  bookingUrl?: string;
  active: boolean;
}

export const PROPERTIES: IProperty[] = [
  {
    id: "terraz-santa-marta",
    slug: "apartamento-terraz-santa-marta",
    name: "Apartamento Terraz",
    city: "Santa Marta",
    sector: "Bello Horizonte",
    type: "Apartamento",
    bedrooms: 1,
    bathrooms: 1,
    beds: 2,
    guests: 4,
    // TODO: reemplazar con URL Cloudinary cuando estén disponibles
    coverImage: "/properties/terraz/cover.png",
    images: [
      "/properties/terraz/cover.png",
      "/properties/terraz/photo-1.png",
      "/properties/terraz/photo-2.png",
      "/properties/terraz/photo-3.png",
      "/properties/terraz/photo-4.png",
    ],
    shortDescription:
      "Apartamento moderno con vista al mar en el exclusivo sector de Bello Horizonte. Diseñado y operado bajo los estándares ARKA.",
    features: [
      "Vista al mar",
      "Aire acondicionado",
      "WiFi de alta velocidad",
      "Piscina",
      "Parqueadero",
      "Cocina equipada",
    ],
    // TODO: reemplazar con URL real de Airbnb/Booking
    airbnbUrl: "#",
    active: true,
  },
];

/** Devuelve solo propiedades activas */
export function getActiveProperties(): IProperty[] {
  return PROPERTIES.filter((p) => p.active);
}
