import { getActiveProperties } from "../../lib/properties";
import { PropertyCard } from "./PropertyCard";

// Server Component — sin "use client", se puede pre-renderizar
// Cuando haya fetch a MongoDB: hacer este componente async y await los datos

export function PropertiesGrid() {
  const properties = getActiveProperties();

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
