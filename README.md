# Landing + Admin · Maestra Esthela Damián Peralta

Sitio ciudadano construido por simpatizantes para visibilizar la trayectoria y
propuestas de la **Maestra Esthela Damián Peralta** rumbo a 2027 en Guerrero.
Incluye una **landing pública** con registro de simpatizantes y un **panel de
administración** ligero para que el equipo mantenga el contenido al día sin
tocar código.

> ⚠️ Este repositorio genera un sitio **no oficial**. El aviso aparece de forma
> permanente tanto en el encabezado como en el pie de página.

## Tech stack

- **Next.js 15** (App Router, Server Components, Server Actions) + **TypeScript**
- **Tailwind CSS** + componentes tipo **shadcn/ui** (Radix primitives)
- **Supabase** (Postgres + Auth) con **Row Level Security** en todas las tablas
- **React Hook Form** + **Zod** para validación cliente/servidor
- Diseño responsive con **dos vistas** diferenciadas (`<1024px` móvil y
  `>=1024px` escritorio) documentadas en [`DESIGN.md`](./DESIGN.md)
- Watermark `#EsConE` aplicado vía CSS sobre `next/image`

## Estructura

```
app/
  (public)/            → landing y aviso de privacidad
  admin/               → panel protegido (login + CRUDs)
  actions/             → Server Actions (auth, supporters, content)
components/
  landing/             → Hero, Bio, Timeline, NewsGrid, SupportersForm, …
  admin/               → Shell, PageHeader, FormFeedback
  ui/                  → Botones, inputs, dialogs, switches, selects
  media/WatermarkImage → wrapper con overlay #EsConE
lib/
  supabase/            → clients (server, client, middleware) + tipos
  schemas/             → Zod schemas
  queries/             → Queries de sólo lectura
supabase/migrations/   → SQL inicial con tablas, RLS y seeds
DESIGN.md              → Sistema de diseño (paleta, tipografía, layouts)
```

## Variables de entorno

Copia `.env.local.example` → `.env.local` y completa los valores correctos. No subas `.env.local` al repositorio; solo sirve para el entorno local.

En Vercel debes agregar estas variables en `Project Settings → Environment Variables` para que el build pueda conectarse a Supabase.

| Variable                             | Dónde usar | Descripción                                     |
| ------------------------------------ | ---------- | ----------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`           | client + server | URL pública del proyecto Supabase.         |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | client + server | Publishable / anon key.                 |
| `SUPABASE_SERVICE_ROLE_KEY`          | **solo server** | Solo en Vercel / servidor. Nunca expongas esta clave en el repo. |
| `NEXT_PUBLIC_SITE_URL`               | client + server | URL absoluta del sitio para metadatos SEO. |

## Primeros pasos (local)

```bash
npm install
cp .env.local.example .env.local   # Windows: Copy-Item .env.local.example .env.local
npm run dev
```

Disponible en <http://localhost:3000> y panel admin en
<http://localhost:3000/admin>.

### Scripts

- `npm run dev` — servidor local con HMR
- `npm run build` — build de producción
- `npm start` — sirve el build
- `npm run typecheck` — verificación TypeScript estricta
- `npm run lint` — ESLint (Next.js)

## Supabase

El esquema inicial está en `supabase/migrations/20260418_init_schema.sql` y ya
fue aplicado al proyecto **Project Candidata** (id `pqmgjrqwuutfmeywqecb`).

### Tablas principales

| Tabla | Propósito |
| ----- | --------- |
| `hero_content`       | Singleton con textos y foto del hero. |
| `biography_sections` | Bloques narrativos de la biografía. |
| `milestones`         | Línea de tiempo cronológica. |
| `news_items`         | Noticias, apariciones en medios y eventos. |
| `supporters`         | Registros del formulario público. |
| `site_settings`      | Clave-valor para textos editables (copy, aviso de privacidad, hashtag). |

### RLS

- **Lectura pública** sólo de filas con `is_published = true` (excepto
  `site_settings` y `hero_content` que se sirven completos).
- **Escritura pública** únicamente un `insert` sobre `supporters` (respetando
  `consent_accepted = true`) con honeypot y validación server-side.
- **Admin** identificado por `auth.users.app_metadata.role = 'admin'`. Nunca se
  usa `user_metadata` para autorización.

### Crear el primer administrador

1. Crea el usuario desde Supabase Studio (`Authentication → Users → Invite`).
2. Asigna el rol admin en `app_metadata`:

```sql
update auth.users
set raw_app_meta_data = jsonb_set(coalesce(raw_app_meta_data, '{}'::jsonb), '{role}', '"admin"')
where email = 'equipo@dominio.mx';
```

3. Inicia sesión en `/admin/login`.

### Regenerar tipos TypeScript

```bash
# Con la CLI oficial
npx supabase gen types typescript --project-id pqmgjrqwuutfmeywqecb > lib/supabase/database.types.ts
# O desde la integración MCP de Supabase
```

## Contenido editable (CMS ligero)

Desde `/admin` puedes gestionar:

- **Portada (Hero):** titular, claim, subtítulo, disclaimer, CTAs e imagen.
- **Biografía + Timeline:** CRUD con orden numérico y toggle publicar/borrador.
- **Noticias:** CRUD con tipo (`medio`, `social`, `evento`), destacar y publicar.
- **Simpatizantes:** lectura + exportación **CSV** + borrado controlado.
- **Ajustes:** hashtag del sitio, textos del formulario y Aviso de Privacidad
  (admite markdown básico).

## Deploy en Vercel

1. **Importa el repo** en <https://vercel.com/new>.
2. **Define las variables de entorno** del cuadro de arriba en
   `Settings → Environment Variables` (marca todas como disponibles para
   `Production`, `Preview` y `Development`).
3. Usa los defaults: framework `Next.js`, build `next build`, install
   `npm install`.
4. Tras el primer deploy, añade el dominio definitivo en
   `Settings → Domains` y actualiza `NEXT_PUBLIC_SITE_URL`.
5. Opcional: conecta Supabase con la integración oficial de Vercel para
   sincronizar las envs automáticamente.

### Revalidación de contenido

Las páginas públicas son `force-dynamic` para tomar siempre los últimos
cambios. Si necesitas caching agresivo, sustituye `dynamic = "force-dynamic"`
por `revalidate = N` en `app/(public)/**/page.tsx`.

## Accesibilidad y responsive

- Breakpoints validados: 360, 414, 768, 1024, 1440.
- Skip-link "Saltar al contenido" en todas las páginas públicas.
- Foco visible en todos los controles (configuración global en `globals.css`).
- Contraste mínimo AA con paleta verde Guerrero + oro costa.
- Formulario con `aria-invalid`, `role="alert"` y mensajes accesibles.

## Datos personales

Se recolectan sólo los datos necesarios con consentimiento explícito. El hash
SHA-256 de la IP y el user agent se guardan por transparencia operativa y
nunca se muestran en el panel. El aviso de privacidad vive en
`site_settings.privacy_notice_md` y se edita desde el admin.

## Qué falta / futuro

- Doble opt-in por correo para simpatizantes.
- Integración en vivo con APIs de X/Facebook/Instagram para poblar `news_items`.
- Subida de imágenes vía Supabase Storage (actualmente se pega la URL).
- Auditoría automatizada con el skill `audit-website` contra el preview de Vercel.
