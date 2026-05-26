# ARKA Living — Web

Sitio web oficial de **ARKA Living**, gestora de rentas cortas en Colombia (Santa Marta).

Enfoque del proyecto:

- SEO fuerte
- Performance
- Seguridad
- Arquitectura limpia y escalable
- Preparado para portal de propietarios y pagos

---

## Stack

**Frontend**

- Next.js 16 (App Router)
- React 19
- TypeScript
- CSS Modules
- Tailwind CSS
- lucide-react (iconografía SVG)
- React Hook Form + Zod (formularios y validación)

**Backend actual**

- Next.js API Routes (endpoints en `app/api/`)
- Resend (envío de emails transaccionales)
- Cloudinary (almacenamiento de imágenes)

**Backend (próxima fase)**

- NestJS + MongoDB Atlas + Mongoose
- API documentada con Swagger, versionada en `/v1`

**Infra**

- Vercel (frontend)
- Cloudflare (DNS + CDN + WAF)
- Sentry + GA4 + GTM + Microsoft Clarity (observabilidad y analytics)

---

## Proyecto final de TripleTen

Este proyecto fue presentado como proyecto final del curso de Desarrollo Web de
**TripleTen**, y cumple con los criterios del enfoque para "APLICACIÓN FRONT-END".

### Estructura y JSX

El proyecto está construido íntegramente en **React con JSX/TSX**. Cada sección
de la interfaz vive en su propio componente dentro de `components/`, con su
archivo de estilos CSS Module asociado. El layout principal se define en
`app/(site)/layout.tsx` y cada página corresponde a un `page.tsx` dentro de la
carpeta de ruta correspondiente.

El diseño es completamente **responsive** desde 320px, utiliza `clamp()` para
tipografía fluida y `var(--edge-space)` para márgenes adaptables. No hay
`overflow: hidden` que oculte contenido ni scroll horizontal en ninguna
resolución.

Se utilizan **etiquetas semánticas** en toda la aplicación: `<main>`, `<header>`,
`<footer>`, `<nav>`, `<section>`, `<article>`. El árbol del DOM no está compuesto
únicamente de `<div>`.

Los formularios (`PropertyApplicationForm`, `ContactoPage`) incluyen
placeholders, campos `required`, y resaltan el foco mediante estilos CSS. Los
modales (`OwnerLoginModal`) pueden cerrarse con el botón de cierre y mediante
overlay.

### Conexión a API y renderización de datos

La sección **Propiedades ARKA** (`/propiedades`) demuestra el flujo completo de
consumo de API:

**Flujo actual (MVP):**

```
lib/properties.ts            → fuente de datos (array TypeScript)
      ↓
app/api/properties/route.ts  → endpoint GET /api/properties → responde JSON
      ↓
lib/api/fetchProperties.ts   → función fetch() encapsulada en archivo separado
      ↓
components/properties/PropertiesGrid.tsx  → Server Component async que consume la API
      ↓
components/properties/PropertyCard.tsx   → renderiza cada propiedad en pantalla
```

El endpoint `GET /api/properties` responde con un array JSON de propiedades
activas. `PropertiesGrid` es un **Server Component async** que llama a
`fetchProperties()` —función encapsulada en `lib/api/fetchProperties.ts`— y
renderiza una `PropertyCard` por cada propiedad recibida.

Las solicitudes se realizan con la **API Fetch nativa**, sin librerías
third-party. Los errores están manejados con `try/catch` y el usuario recibe un
mensaje claro en pantalla si la carga falla.

### Escalabilidad hacia MongoDB

La arquitectura está diseñada para que la migración a una base de datos real
requiera cambiar **únicamente el interior de `app/api/properties/route.ts`**,
sin tocar ningún otro archivo:

**Flujo futuro (MongoDB Atlas):**

```typescript
// app/api/properties/route.ts — única línea que cambia

// HOY (MVP):
import { getActiveProperties } from "@/lib/properties";
const properties = getActiveProperties(); // lee array local

// FUTURO (MongoDB):
import { Property } from "@/lib/models/Property"; // modelo Mongoose
await connectDB();
const properties = await Property.find({ active: true }).lean();
```

`fetchProperties.ts`, `PropertiesGrid.tsx` y `PropertyCard.tsx` no necesitan
ninguna modificación. El contrato del endpoint —`GET /api/properties` devuelve
`IProperty[]`— se mantiene idéntico. Cuando haya decenas o cientos de
propiedades, el mismo endpoint puede incorporar paginación, filtros por ciudad
o tipo, y caché con ISR de Next.js (`revalidate`), todo sin afectar los
componentes de UI.

---

## Estructura de carpetas

```
app/
  (site)/
    layout.tsx              — layout global (Header, Footer, fuentes)
    page.tsx                — Home
    propiedades/page.tsx    — Catálogo de propiedades
    nosotros/page.tsx
    contacto/page.tsx
    postula-tu-propiedad/page.tsx
    politica-de-privacidad/page.tsx
    terminos-y-condiciones/page.tsx
  api/
    properties/route.ts     — GET /api/properties
    contact/route.ts        — POST /api/contact
    postula/
      start/route.ts        — inicia verificación OTP
      verify/route.ts       — valida código OTP
      submit/route.ts       — envía postulación + fotos a Cloudinary

components/
  home/                     — Hero, FloatingCTA, secciones del landing
  properties/               — PropertiesGrid, PropertyCard, ImageLightbox
  forms/                    — PropertyApplicationForm
  contacto/                 — ContactoPage
  nosotros/                 — NosotrosPage
  Header.tsx
  Footer.tsx
  MenuOverlay.tsx
  OwnerLoginModal.tsx
  OrientationLock.tsx

lib/
  api/
    fetchProperties.ts      — función fetch() encapsulada
  properties.ts             — IProperty interface + datos MVP
  schemas/
    contact.ts              — schema Zod del formulario de contacto

public/
  properties/terraz/        — imágenes del Apartamento Terraz
```

---

## Sistema de UI

**Tokens de color (ARKA):**

- `--arka-white`
- `--arka-brown-dark`
- `--arka-brown-mid`
- `--arka-brown-light`
- `--arka-text-soft`

**Layout:**

- Header sticky con blur
- Footer con degradé radial
- CTA flotante controlado por `data-hero-stage`
- `--edge-space` y `--header-h` como variables de espaciado global

---

## Funcionalidades actuales (MVP)

- Hero con sistema de stages (scroll/pinned) y video autoplay muted
- Catálogo de propiedades consumido desde `GET /api/properties`
- Lightbox de galería de imágenes por propiedad
- Formulario de postulación con verificación OTP por email (Resend)
- Subida y compresión de fotos a Cloudinary
- Formulario de contacto con validación Zod
- Modal de acceso para propietarios (por desarrollar)
- Menú lateral (overlay) responsive
- Páginas legales: Política de privacidad, Términos y condiciones
- SEO: `<title>`, `<meta description>`, OpenGraph y JSON-LD por página

---

## Desarrollo local

```bash
npm install
npm run dev
```

Crear un archivo `.env.local` en la raíz con las siguientes variables:

```dotenv
# URL base — usada por fetchProperties() en Server Components
# En Vercel cambiar a: https://arkaliving.co
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Resend
RESEND_API_KEY=
RESEND_FROM=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Seguridad de formularios
FORM_TOKEN_SECRET=
```

Abrir: http://localhost:3000

---

## Flujo Git recomendado

```bash
# Crear rama de feature
git checkout -b feature/nombre-corto

# Merge a main
git checkout main
git pull origin main
git merge feature/nombre-corto
git push origin main
```

---

## Próximos pasos

- Páginas individuales por propiedad (SSR/ISR, metadata, OG, JSON-LD)
- Conexión a MongoDB Atlas (reemplazar `lib/properties.ts` por queries Mongoose)
- Portal de propietarios (Auth.js, RBAC, autorización por `ownerId`)
- Calendario (iCal sync + reglas anti-overbooking)
- Pagos (Stripe payment_intent + webhooks idempotentes)

---

© 2026 — Sitio web desarrollado por **JCR-Code**
