# ARKA Living — Web

Sitio web oficial de **ARKA Living**, gestora de rentas cortas en Colombia (Santa Marta y Bogotá).

Enfoque del proyecto:

- SEO fuerte
- Performance
- Seguridad
- Arquitectura limpia y escalable
- Preparado para portal de propietarios y pagos

---

## Stack

**Frontend**

- Next.js (App Router)
- React
- CSS Modules
- lucide-react (iconografía)

**Backend (próxima fase)**

- Node.js + NestJS
- MongoDB Atlas
- API documentada (Swagger) y versionada

**Infra (sugerida)**

- Vercel (frontend)
- Cloudflare (DNS + seguridad)
- Railway/Render (backend)
- Sentry + Uptime + Analytics (GA4/GTM)

---

## Estructura (referencial)

```
app/
  (site)/
    layout.tsx
    page.tsx

components/
  home/
    Hero.tsx
    FloatingCTA.tsx
    FloatingCTA.module.css
    MenuOverlay.tsx
    MenuOverlay.module.css
    Footer.tsx
    Footer.module.css
  layout/
  ui/

public/
styles/
```

---

## Sistema de UI

**Tokens de color (ARKA):**

- `--arka-white`
- `--arka-brown-dark`
- `--arka-brown-mid`
- `--arka-brown-light`

**Layout**

- Header sticky (card blur) alineado con `--edge-space`
- Footer con degradé radial sólido
- CTA flotante controlado por `data-hero-stage`
- Estados globales controlados con `data-*` en `<html>`

---

## Funcionalidades actuales (MVP)

- Hero con sistema de _stages_ (scroll/pinned)
- CTA flotante con estilos modulares + lógica global por stage
- Menú lateral (overlay) con iconos consistentes
- Footer estructurado con redes y copy
- Enlaces externos abren en nueva pestaña con `rel="noopener noreferrer"`
- Click en **HOME** desde menú resetea el Hero al stage 0 (scroll top + `data-hero-stage="0"`)

---

## Enlaces oficiales

- Instagram: https://instagram.com/arka_living.co
- WhatsApp: https://wa.me/573158254384

---

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir:

- http://localhost:3000

---

## Flujo Git recomendado

Crear rama de feature:

```bash
git checkout -b feature/nombre-corto
```

Merge a `main`:

```bash
git checkout main
git pull origin main
git merge feature/nombre-corto
git push origin main
```

---

## Próximos pasos

- Catálogo + páginas por inmueble (SSR/ISR, metadata, OG, JSON-LD)
- Portal de propietarios (RBAC + autorización por ownerId)
- Calendario (iCal sync MVP + reglas anti-overbooking)
- Pagos (payment_intent + webhooks idempotentes)

---

© 2026 — Sitio web creado por **JCR-Code**
