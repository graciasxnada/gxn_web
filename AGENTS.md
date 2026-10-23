# Repository Guidelines

## Project Structure & Module Organization

This repository contains the static Astro website for gracias x nada.

- `src/pages/`: routes, including generated release pages at `musica/[slug].astro`.
- `src/components/` and `src/layouts/`: reusable UI and the shared page layout.
- `src/data/`: release catalog and upcoming/past shows.
- `src/config.js`: site URL, base path, social links, and contact information.
- `src/assets/img/`: artwork and photography; `src/styles/global.css`: shared visual styles.
- `public/`: files served directly, including robots.txt and icons.
- `scripts/qa.mjs`: automated checks against generated HTML.

Treat `dist/`, `.astro/`, and `node_modules/` as generated directories.

## Build, Test, and Development Commands

Use Node.js 22 to match CI.

- `npm ci`: install dependencies from the lockfile.
- `npm run dev`: start development at `http://localhost:4321/gxn_web/`.
- `npm run build`: generate the static site in `dist/`.
- `npm run preview`: serve the production build locally.
- `npm run qa`: validate an existing build.
- `npm run check`: build and run QA; use before submitting changes.

## Coding Style & Naming Conventions

Follow existing two-space indentation, JavaScript ES modules, single-quoted strings, and semicolons. Use PascalCase for Astro components and layouts, lowercase route names, and existing BEM-style CSS classes such as `show__tag--link`.

Reuse shared CSS variables and preserve the established band artwork and typography. Generate internal links with helpers from `src/lib.js` so GitHub Pages subpaths work. No formatter or lint tool is configured.

## Testing Guidelines

The dependency-free QA script checks internal links, image alt text, metadata, JSON-LD, social links, contact email, robots.txt, and sitemap output. There is no unit-test framework or coverage threshold.

Run `npm run check` and visually inspect affected pages at mobile and desktop widths.

## Commit & Pull Request Guidelines

Recent commits use descriptive Spanish subjects identifying the affected feature; Conventional Commit prefixes are not established. Follow that pattern and keep commits focused.

For pull requests, describe the change, link relevant issues, report validation, and attach screenshots for visual changes. Pushes to `main` automatically build, validate, and deploy to GitHub Pages.

## Content & Configuration

Edit catalog and concert data in `src/data/`. Keep advance singles inside their parent release's `adelantos` array. Domain or base-path changes must also account for robots.txt and the QA script's hardcoded base path. Never commit `.env` files or secrets.
