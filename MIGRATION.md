# Astro / TypeScript migration

## Inspection and plan

The starting site already used Astro 7.4.2, JavaScript ES modules, plain CSS,
self-hosted Archivo and Space Mono fonts, and local WebP artwork. It had six
shared components (navigation, footer, ticker, starburst, release card, show
item), a common layout, and seven generated HTML pages: home, music, EP detail,
about, concerts, contact, and 404. The only browser JavaScript controlled the
mobile menu; Spotify used an iframe. No obsolete UI framework was present.

1. Preserve all routes, artwork, Spanish content, CSS, and animation rules.
2. Convert configuration, data, and helpers to strict TypeScript; type Astro
   props and build-time routes and check them before building.
3. Derive canonicals, structured data, sitemaps, and robots.txt from one
   configurable production origin and base path. Preserve existing profiles.
4. Use the official Astro GitHub Pages action and run QA before deployment.
5. Verify production output, responsive behavior, menu accessibility, assets,
   SEO, and both GitHub Pages subpath and domain-root builds.

## Verification

The pre-migration `npm run check` passed for seven HTML pages. A copy of the
baseline output was retained locally under `.astro/migration-baseline/` for
comparison; it is not part of the repository or deployed output.

The completed migration passes strict Astro/TypeScript diagnostics (no errors,
warnings, or hints), a clean lockfile install, 505 generated-site checks, and
five QA regression tests. Default GitHub Pages, alternate repository subpath,
and custom-domain root builds each pass QA with seven HTML pages and six
indexable URLs.

Browser verification covers all seven pages at 390, 768, and 1440 pixels,
including image loading, horizontal overflow, mobile focus trapping and Escape.
All visible content, page sizes, and image geometry match the saved baseline.
The final screenshot comparison is pixel-identical in 20 of 21 cases; the
remaining desktop gallery differs by one rasterized photo pixel. Original CSS,
fonts, and artwork are unchanged. Browser tools and screenshots remain in the
ignored `.astro/browser-qa/` directory, outside project dependencies and output.
Domain-root and renamed-subpath browser smoke tests also pass at mobile and
desktop widths. External Spotify playback, live Pages deployment, and field
Core Web Vitals were not measured; the existing Spotify embed is preserved.

Windows held an existing native compiler binary during an in-place `npm ci`;
`npm install` restored the working installation, and a separate clean `npm ci`
succeeded under `.astro/clean-install/`. No existing processes were stopped.

See README.md for development commands and deployment configuration. Changes
remain static: endpoint TypeScript executes at build time, and hosting only
needs the contents of `dist/`.
