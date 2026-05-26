// lib/api/fetchProperties.ts
// Función que encapsula el fetch a /api/properties.
// Se puede usar en cualquier Server Component o página que necesite las propiedades.

import type { IProperty } from "@/lib/properties";

export async function fetchProperties(): Promise<IProperty[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    `http://localhost:${process.env.PORT ?? 3000}`;

  const res = await fetch(`${baseUrl}/api/properties`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Error cargando propiedades: ${res.status}`);
  }

  return res.json();
}
