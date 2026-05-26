// app/api/properties/route.ts
// Endpoint GET que expone las propiedades activas como JSON.
// MVP: lee de lib/properties.ts
// A FUTURO: reemplazar getActiveProperties() por query a MongoDB cuando esté conectado.

import { NextResponse } from "next/server";
import { getActiveProperties } from "@/lib/properties";

export async function GET() {
  try {
    const properties = getActiveProperties();
    return NextResponse.json(properties);
  } catch (error) {
    console.error("[/api/properties] Error:", error);
    return NextResponse.json(
      { message: "No se pudieron cargar las propiedades." },
      { status: 500 },
    );
  }
}
