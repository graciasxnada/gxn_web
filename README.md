# gracias x nada — web oficial

Web del trío de pop punk / skate punk **gracias x nada** (GxN) de Vigo, Galicia.
Construida con [Astro](https://astro.build), salida 100 % estática, lista para
GitHub Pages o cualquier hosting estático. El código usa TypeScript estricto,
componentes `.astro` y CSS normal; no requiere servidor, CMS ni base de datos.
Se conserva el diseño, contenido, rutas y assets originales. La inspección y
el plan de migración están en [MIGRATION.md](MIGRATION.md).

## Comandos

Usa Node.js 24 LTS (mínimo 22.18 para ejecutar los módulos TypeScript de QA).
En PowerShell con restricciones de ejecución, usa `npm.cmd` en lugar de `npm`.

```bash
npm ci          # dependencias exactas de package-lock.json
npm run dev     # servidor de desarrollo en http://localhost:4321/gxn_web/
npm run typecheck # comprobación de TypeScript y componentes Astro
npm run build   # comprobación de tipos + build estático a ./dist
npm run preview # sirve ./dist para revisarlo
npm run check   # tipos + build + QA automática (antes de commitear)
npm run test:qa # pruebas de regresión de QA, después de construir
```

`npm run check` (o `npm run qa` sobre un dist ya construido) valida en segundos:
enlaces internos sin destino, `alt` en imágenes, `title`/description/canonical/
viewport/lang, metadatos Open Graph/Twitter, JSON-LD válido y `sameAs` con
los perfiles confirmados, mailto, robots.txt y sitemaps. También revisa
las entidades de lanzamientos y conciertos, assets, fuentes, anclas,
dimensiones de imágenes y jerarquía de encabezados.
Si algo falla, sale con código 1. Revisa además las páginas afectadas en móvil
y escritorio: navegación, menú por teclado, fotos y reproductor de Spotify.

## Estructura

```
src/
  config.ts          ← configuración, links y contacto
  types.ts           ← tipos compartidos de lanzamientos y conciertos
  data/releases.ts   ← discografía
  data/shows.ts      ← conciertos (upcoming / past)
  layouts/Base.astro ← head SEO, fuentes, JSON-LD MusicGroup, nav/footer
  components/        ← Nav, Footer, Ticker, Starburst, ReleaseCard, ShowItem
  pages/             ← index, musica, musica/[slug], sobre, directo, contacto, 404
  assets/img/        ← portadas y foto de la banda (imagen de artista de Spotify)
  styles/global.css  ← sistema visual
  pages/robots.txt.ts ← robots.txt estático con sitemap del dominio configurado
public/              ← favicon, manifest, iconos y og.jpg
.github/workflows/deploy.yml  ← deploy automático a GitHub Pages
```

Las decisiones SEO, comprobaciones externas y pasos de publicación se detallan
en [SEO.md](SEO.md).

## GitHub Pages y dominio de producción

En el repositorio público de GitHub, selecciona **Settings → Pages → Build
and deployment → Source: GitHub Actions**. Cada push a `main` o ejecución
manual construye, verifica y publica únicamente `dist/`. No subas `dist/`
a Git. El workflow sigue el [método oficial de Astro](https://docs.astro.build/en/guides/deploy/github/)
con `withastro/action`, Node 24, `npm run check` y `npm run test:qa` antes de subir el artefacto.
GitHub Pages sirve todo como archivos estáticos, compatible con su plan gratuito.

El workflow toma el origen y la ruta de `actions/configure-pages`. Puedes
sobrescribirlos con variables del repositorio **SITE_URL** (origen HTTPS sin
ruta) y **SITE_BASE** (`/gxn_web` para proyecto, `/` para dominio propio).
Localmente se conserva por defecto `https://dcarball0.github.io/gxn_web/`.
`src/config.ts` centraliza estos valores; no hay dominios de ejemplo en el HTML.

Para un dominio propio real, configura DNS y **Settings → Pages → Custom
domain**, añade `public/CNAME` con ese dominio y configura `SITE_URL` y
`SITE_BASE=/`. Los enlaces, assets, canonical, Open Graph, JSON-LD, robots.txt
y sitemaps se actualizan al reconstruir; no requieren cambios manuales.

Para probar una configuración local en PowerShell (sustituye el origen por
el dominio real):

```powershell
$env:SITE_URL = 'https://dcarball0.github.io'
$env:SITE_BASE = '/gxn_web'
npm.cmd run check
npm.cmd run preview
```

Usa las mismas variables al construir, comprobar QA y previsualizar. Se leen
del entorno del proceso; no se necesita `.env`. Para volver a los valores
por defecto, elimina ambas variables del entorno. `robots.txt` permite
todos los rastreadores, incluidos Googlebot, Bingbot y OAI-SearchBot. En
GitHub Pages de proyecto, la política robots del origen raíz depende de
la web de usuario/organización; este repositorio sirve su archivo en su base.

## Añadir contenido nuevo

### Un lanzamiento nuevo

1. Copiar portada (webp recomendado, máx. 640 px) a `src/assets/img/`.
2. Importarla en `src/data/releases.ts` y añadir el bloque con:
   `slug`, `title`, `type` (`single`|`ep`|`album`), `date`, `cover`,
   `description`, `tracks`, `links.spotify` y `code` opcional (el EP
   lleva `GXN 001`; el siguiente lanzamiento principal sería `GXN 002`).
3. `npm run build`. La ficha `/musica/<slug>/` se genera sola (con
   JSON-LD `MusicRelease`, reproductor de Spotify y "otros lanzamientos").

Los singles de adelanto de un disco mayor **no van como lanzamientos
aparte**: se añaden al objeto del disco en la propiedad `adelantos`
(`code`, `title`, `date`, `note`, `cover`, `links.spotify`) y la ficha
del disco los lista con su portada y enlace.

### Una fecha de concierto

Añadir objeto a `upcoming` o `past` en `src/data/shows.ts`
(`date`, `venue`, `city`, `notes`, `ticketUrl` opcional, `datePrecision`
si el día no es exacto).

## Diseño (decisiones)

- Paleta extraída del arte real de la banda (portadas del EP *GxN* y del
  single *Entiéndeme*): papel verde kelly `#2fae4a`, explosión amarilla
  `#ffe34b`, rojo logo `#e8262d`, papel crema `#f3eed9`, negro `#14140f`.
  El verde neón `#06c93d` (A/B que ya se había contemplado) se descartó:
  contra el arte de portada el verde del papel funciona mejor sin saturar.
- Motivo visual: la explosión de cómic de las portadas → favicon, badges,
  nav y estados vacíos. Tipografía: Archivo variable (display expandido)
  + Space Mono para rótulos de fanzine.
- Portada tipo cartel verde: titulares negros y fotografía enmarcada,
  ligeramente girada, con sombra amarilla. El marco se centra en su columna;
  el recorte toma como referencia el centro del trío en la foto panorámica,
  también en móvil.
- Ticker de cinta tipo fanpress, sombras duras (4px offset) en botones,
  sombras de bloque en portadas. La cinta bajo el hero cuenta el próximo
  bolo (sale de `shows.ts`; sin fechas, cae al nombre); la del footer
  repite «gracias × nada».

## Verificado vs. pendiente

**Verificado con datos reales** (catálogo de Spotify de la banda + prensa
local Rouco Son): discografía completa con fechas y duraciones, créditos
de grabación (deica), colaboraciones (kinss, deica), salas de conciertos
pasados e Instagram/Spotify oficiales.

- [x] E-mail de booking/prensa: `graciasxnadagrupo@gmail.com` (config en `CONTACT.email`)
- [x] Vídeo con dos canciones en directo (`LINKS.liveVideo`, facilitado por la banda)
- [x] Foto de banda real (banner de Spotify → hero; fisheye → sobre) y portadas reales
- [x] Fotos de directo (Mardi Gras 22.07.2026 y Ocean Rock Bar 14.08.2026, en `src/assets/img/directo/`)
- [x] Sala Moon 13.11.2026: entradas solo en puerta (`ticketNote` + `infoUrl` al post de anuncio)

**Pendiente de aportar por la banda** (marcado con ⚠️ en el código):

- [ ] Dominio propio (configurar DNS, Pages, `SITE_URL` y `SITE_BASE`).
- [ ] Confirmar otros perfiles externos antes de publicarlos.
- [ ] Ficha técnica de directo (rider, formación) para prensa.

Las fotos de directo se gestionan soltas: webp con prefijo `orb-` (Ocean Rock
Bar) o `mdg-` (Mardi Gras) en `src/assets/img/directo/`; la página de Directo
las recoge automáticamente con `import.meta.glob`.
