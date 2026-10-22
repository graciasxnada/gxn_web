# gracias x nada — web oficial

Web del trío de pop punk / skate punk **gracias x nada** (GxN) de Vigo, Galicia.
Construida con [Astro](https://astro.build), salida 100 % estática, lista para
GitHub Pages u cualquier hosting estático.

## Comandos

```bash
npm install     # dependencias
npm run dev     # servidor de desarrollo en http://localhost:4321/gxn_web/
npm run build   # build estático a ./dist
npm run preview # sirve ./dist para revisarlo
```

## Estructura

```
src/
  config.js          ← TODO lo cambiable vive aquí: dominio, links, contacto
  data/releases.js   ← discografía (añadir un single = copiar un bloque)
  data/shows.js      ← conciertos (upcoming / past)
  layouts/Base.astro ← head SEO, fuentes, JSON-LD MusicGroup, nav/footer
  components/        ← Nav, Footer, Ticker, Starburst, ReleaseCard, ShowItem
  pages/             ← index, musica, musica/[slug], sobre, directo, contacto, 404
  assets/img/        ← portadas y foto de la banda (imagen de artista de Spotify)
  styles/global.css  ← sistema visual
public/              ← favicon, manifest, robots.txt, og.jpg
.github/workflows/deploy.yml  ← deploy automático a GitHub Pages
```

## Configurarlo en un dominio propio (un solo cambio de sitio)

En `src/config.js` y `astro.config.mjs` se define el dominio:

```js
// astro.config.mjs
site: SITE.url,   // ⚠️ p. ej. 'https://graciasxnada.es'
base: SITE.base,  // ⚠️ '/gxn_web' en GitHub Pages · '/' con dominio propio
```

También actualizar el `Sitemap:` de `public/robots.txt` cuando exista dominio.

Para GitHub Pages: repo → **Settings → Pages → Build and deployment →
Source: GitHub Actions**; cada push a `main` construye y publica.

## Añadir contenido nuevo

### Un lanzamiento nuevo

1. Copiar portada (webp recomendado, máx. 640 px) a `src/assets/img/`.
2. Importarla en `src/data/releases.js` y añadir el bloque con:
   `slug`, `title`, `type` (`single`|`ep`|`album`), `date`, `cover`,
   `description`, `tracks`, `links.spotify`, `code` (GXN 005…).
3. `npm run build`. La ficha `/musica/<slug>/` se genera sola (con
   JSON-LD `MusicRelease`, reproductor de Spotify y "otros lanzamientos").

### Una fecha de concierto

Añadir objeto a `upcoming` o `past` en `src/data/shows.js`
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
- Ticker de cinta tipo fanpress, sombras duras (4px offset) en botones,
  sombras de bloque en portadas.

## Verificado vs. pendiente

**Verificado con datos reales** (catálogo de Spotify de la banda + prensa
local Rouco Son): discografía completa con fechas y duraciones, créditos
de grabación (deica), colaboraciones (kinss, deica), salas de conciertos
pasados, Twitter/Instagram/Spotify oficiales.

- [x] E-mail de booking/prensa: `graciasxnadagrupo@gmail.com` (config en `CONTACT.email`)
- [x] Foto de banda real (banner de Spotify → hero; fisheye → sobre) y portadas reales
- [x] Apple Music y YouTube (enlaces de artista) — añadir enlaces por lanzamiento si existen

**Pendiente de aportar por la banda** (marcado con ⚠️ en el código):

- [ ] Dominio propio (sustituir `SITE.url`/`base` + `robots.txt`).
- [ ] Press kit PDF (`PRESS.kitFile`).
- [ ] Enlaces de Apple Music/YouTube por lanzamiento concreto.
- [ ] Ficha técnica de directo (rider, formación) para prensa.
- [ ] Más fotos y entradas de venta (`ticketUrl`) por concierto.
