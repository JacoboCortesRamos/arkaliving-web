// components/properties/PropertiesGrid.tsx
// Server Component async — obtiene propiedades via fetch a /api/properties.

import { fetchProperties } from "../../lib/api/fetchProperties";
import { PropertyCard } from "./PropertyCard";

export async function PropertiesGrid() {
  let properties;

  try {
    properties = await fetchProperties();
  } catch (error) {
    return (
      <p
        style={{
          textAlign: "center",
          color: "var(--arka-text-soft)",
          padding: "60px 0",
          fontSize: "17px",
        }}
      >
        No se pudieron cargar las propiedades. Intenta de nuevo más tarde.
      </p>
    );
  }

  if (properties.length === 0) {
    return (
      <p
        style={{
          textAlign: "center",
          color: "var(--arka-text-soft)",
          padding: "60px 0",
          fontSize: "17px",
        }}
      >
        Próximamente más propiedades disponibles.
      </p>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "28px",
      }}
    >
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
