# Design System: Landing Maestra Esthela Damián Peralta

**Proyecto:** Landing ciudadana — #EsConE (Guerrero 2027)
**Versión:** 0.1.0

## 1. Visual Theme & Atmosphere

La atmósfera es **institucional, cercana y aspiracional**. Busca transmitir seriedad y servicio público —sin frialdad burocrática— combinando tipografía editorial clásica con espacios generosos y acentos cálidos que evocan la tierra de Guerrero: el verde de sus sierras y el dorado de sus costas. La densidad visual es **media-baja**: mucho aire, tipografía como protagonista, imágenes tratadas con respeto y una marca de agua diagonal `#EsConE` que refuerza la identidad ciudadana sin estorbar el rostro de la candidata.

Adjetivos rectores: **digna, luminosa, ordenada, calurosa, confiable**.

## 2. Color Palette & Roles

| Rol | Nombre semántico | HSL / Hex | Uso |
| --- | --- | --- | --- |
| Background (claro) | Blanco hueso | `hsl(42 33% 98%)` / `#FBF8F2` | Fondo general, respira sobre los acentos |
| Background (oscuro) | Tinta profunda | `hsl(155 30% 7%)` / `#0C1612` | Fondo modo oscuro, sofisticado y sobrio |
| Foreground | Grafito institucional | `hsl(155 20% 12%)` / `#18241F` | Texto principal |
| Muted foreground | Bosque apagado | `hsl(155 10% 38%)` / `#566560` | Texto secundario, metadatos |
| Primary | Verde Guerrero | `hsl(155 50% 22%)` / `#1E5340` | CTAs principales, enlaces, énfasis institucional |
| Primary foreground | Blanco cálido | `hsl(42 40% 97%)` / `#FAF6ED` | Texto sobre Verde Guerrero |
| Gold accent | Oro costa | `hsl(38 72% 52%)` / `#E0A426` | Subrayados, watermark, badges de destaque |
| Secondary | Jade pálido | `hsl(155 25% 92%)` / `#E2ECE7` | Superficies de tarjetas, fondos suaves |
| Accent | Coral suave | `hsl(14 70% 62%)` / `#E58464` | CTA secundario, llamados emocionales |
| Border | Bruma verde | `hsl(155 15% 85%)` / `#D0D9D4` | Separadores, bordes de inputs |
| Destructive | Granate | `hsl(0 55% 42%)` / `#A73030` | Errores, acciones destructivas |

**Regla de uso del color**: el 70% del espacio es neutro (blanco hueso + texto grafito), 20% es Verde Guerrero (CTAs, headers, footers), 10% es Oro Costa (acentos, watermark, destacados). El coral aparece con moderación para CTA secundarios o banners emocionales.

## 3. Typography Rules

- **Display / Headings:** `Playfair Display` (serif), pesos 500–700. Transmite autoridad y tradición política sin ser anticuado. Reservada para `h1`, `h2` de sección, claim del hero y títulos de tarjetas destacadas.
- **Body / UI:** `Inter` (sans-serif), pesos 400–600. Legible en móvil y en interfaces densas. Usada para párrafos, labels, botones y navegación.
- **Tracking:** `-0.02em` en displays grandes (≥ 48 px). Body por defecto. Mayúsculas pequeñas (`uppercase tracking-widest text-xs`) en eyebrows/antetítulos.
- **Escala:**
  - Claim hero (desktop): 72–88 px / line-height 1.05
  - Claim hero (móvil): 40–48 px / line-height 1.1
  - h2: 36 / 28 px (desktop / móvil)
  - h3: 22 / 20 px
  - body: 17 / 16 px / line-height 1.65

## 4. Component Stylings

- **Buttons**
  - Primario: Verde Guerrero sólido, texto crema, radio 10 px (`rounded-md` extendido), padding `px-6 py-3`, transición de fondo al 90% opacidad en hover, foco visible con anillo Oro Costa.
  - Secundario: transparente con borde Verde Guerrero 1.5 px y texto Verde Guerrero.
  - CTA acento (coral): solo se usa para CTAs emocionales de registro en móvil si se requiere contraste adicional.
- **Cards / Containers**
  - Radio 16 px (`rounded-2xl`), fondo Jade pálido o Blanco hueso, borde 1 px Bruma verde, sombra discreta `0 2px 8px hsl(155 20% 10% / 0.05)`.
- **Inputs**
  - Altura 48 px en móvil, 44 px desktop. Borde 1 px, radio 10 px. Foco: anillo Verde Guerrero 2 px + sombra suave. Labels arriba del campo, nunca floating solas.
- **Badges**
  - Pequeños, mayúsculas tracking wide. "Destacada" usa fondo Oro Costa 20% + texto Oro Costa oscuro.
- **Timeline**
  - Línea vertical de 2 px Bruma verde en móvil, con nodos circulares Oro Costa.
  - En desktop (≥1024) zig-zag horizontal con línea central y tarjetas alternadas arriba/abajo.
- **Watermark #EsConE**
  - Overlay CSS repetido en diagonal -25°, texto Oro Costa al 12–18% de opacidad sobre la imagen. Se aplica siempre mediante el componente `WatermarkImage` para asegurar consistencia.

## 5. Layout Principles

- **Mobile-first** con dos vistas diferenciadas en el breakpoint `lg` (1024 px).
- Contenedor central `max-w-[1320px]` con padding lateral responsivo (16 / 20 / 32 / 40 px).
- Espaciados entre secciones: 64 px en móvil, 96–128 px en desktop.
- Ritmo tipográfico vertical basado en múltiplos de 8 px.
- Orientación: **texto protagonista en desktop**, **imagen arriba y texto abajo en móvil**.
- Cada sección tiene un eyebrow (ejemplo: `#EsConE · Biografía`) en mayúsculas pequeñas Oro Costa como ancla visual.

## 6. Dual View Strategy (Móvil vs Escritorio)

| Sección | Móvil (<1024 px) | Escritorio (≥1024 px) |
| --- | --- | --- |
| Header | Logo + hamburguesa → drawer | Logo a la izquierda, nav al centro, CTA a la derecha |
| Hero | Imagen arriba, texto debajo, CTAs apilados a 100% | Split 55/45 texto-imagen, CTAs en línea |
| Bio | Una columna, `max-w-prose` | Dos columnas (texto + quote destacada) |
| Timeline | Vertical con línea izquierda | Zig-zag horizontal con línea central |
| Noticias | 1 columna, destacada arriba con badge | 3 columnas, destacada ocupa 2 columnas en fila 1 |
| Formulario | 1 columna, inputs 48 px, botón sticky opcional | Card 2 columnas (pares de campos), max-w-2xl |
| Footer | Stack vertical | 3 columnas (créditos, enlaces, hashtag) |
| Admin | Sidebar colapsado en drawer | Sidebar fijo 260 px + contenido + panel lateral |

## 7. Motion & Feedback

- Transiciones estándar: 180 ms `ease-out` para hover, 320 ms `cubic-bezier(0.2, 0.8, 0.2, 1)` para reveals.
- Scroll suave entre secciones (`scroll-behavior: smooth` con respeto a `prefers-reduced-motion`).
- Focus ring siempre visible (Oro Costa 2 px + offset).
- Estados de carga con spinners minimalistas, nunca con skeletons coloridos.

## 8. Accesibilidad

- Contraste AA mínimo en todo texto (Verde Guerrero sobre Blanco hueso = 8.6:1).
- Áreas de toque ≥ 44×44 px.
- Labels asociadas a cada input, mensajes de error con `aria-live="polite"`.
- Soporte total a teclado; `skip to content` oculto hasta recibir foco.
- Respeto a `prefers-reduced-motion`: deshabilita `animate-fade-up` y scroll suave.
