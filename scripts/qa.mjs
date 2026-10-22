/**
 * QA automática del sitio — un solo comando: `npm run check`
 * (build + estas comprobaciones). Sin dependencias.
 *
 *   npm run qa    → verifica dist/ ya construido
 *   npm run check → build + qa
 *
 * Falla (exit 1) si algo no cuadra; imprime cada problema con su página.
 */
import fs from 'fs';
import path from 'path';
import { LINKS } from '../src/config.js';

const DIST = 'dist';
const BASE = '/gxn_web';
const errors = [];
const warns = [];
let checks = 0;

const fail = (msg) => errors.push(msg);
const warn = (msg) => warns.push(msg);

/* ---------- utilidades ---------- */

function walk(dir, ext) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p, ext));
    else if (entry.name.endsWith(ext)) out.push(p);
  }
  return out;
}

function resolveInternal(href) {
  const clean = href.split('#')[0].split('?')[0].replace(BASE, '');
  if (clean === '' || clean === '/') return path.join(DIST, 'index.html');
  const direct = path.join(DIST, clean);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  return path.join(DIST, clean, 'index.html');
}

function rel(file) {
  return path.relative(DIST, file).replace(/\\/g, '/');
}

/* ---------- comprobaciones ---------- */

if (!fs.existsSync(DIST)) {
  console.error('✗ No existe dist/. Ejecuta `npm run build` primero (o usa `npm run check`).');
  process.exit(1);
}

const htmlFiles = walk(DIST, '.html').filter((f) => !path.basename(f).startsWith('_'));

if (htmlFiles.length === 0) fail('No hay páginas HTML en dist/.');

const socialUrls = {
  Spotify: LINKS.spotify,
  'Apple Music': LINKS.appleMusic,
  YouTube: LINKS.youtube,
  TikTok: LINKS.tiktok,
  Instagram: LINKS.instagram,
};

let sitemapUrls = 0;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const page = rel(file);

  // Cabecera mínima
  checks++;
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${page}: sin <title>.`);
  checks++;
  if (!/<meta name="description" content="[^"]+"/.test(html)) fail(`${page}: sin meta description.`);
  checks++;
  if (!/<html lang="es"/.test(html)) fail(`${page}: sin lang="es".`);
  checks++;
  if (!/<meta name="viewport"/.test(html)) fail(`${page}: sin viewport (móvil).`);
  checks++;
  if (!/<link rel="canonical" href="[^"]+"/.test(html)) fail(`${page}: sin canonical.`);

  // Enlaces internos sin destino
  for (const m of html.matchAll(/<a[^>]*href="(\/gxn_web[^"]*)"/g)) {
    checks++;
    if (!fs.existsSync(resolveInternal(m[1]))) fail(`${page}: enlace roto → ${m[1]}`);
  }

  // Imágenes con alt
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    checks++;
    if (!/\balt="/.test(m[0])) fail(`${page}: <img> sin alt: ${m[0].slice(0, 90)}…`);
  }

  // Redes en el footer de todas las páginas
  for (const [name, url] of Object.entries(socialUrls)) {
    checks++;
    if (!html.includes(url)) fail(`${page}: falta el enlace a ${name} (${url}).`);
  }

  // JSON-LD válido
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    checks++;
    try {
      JSON.parse(m[1]);
    } catch {
      fail(`${page}: JSON-LD inválido.`);
    }
  }
}

// JSON-LD: sameAs debe reflejar todas las redes oficiales
const home = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const ldMatch = home.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
checks++;
if (!ldMatch) {
  fail('Home: no se encontró JSON-LD MusicGroup.');
} else {
  const ld = JSON.parse(ldMatch[1]);
  const expected = Object.values(socialUrls);
  const missing = expected.filter((u) => !(ld.sameAs ?? []).includes(u));
  if (missing.length) fail(`JSON-LD sameAs incompleto, falta: ${missing.join(', ')}`);
  if (ld['@type'] !== 'MusicGroup') fail(`JSON-LD @type esperado MusicGroup, encontrado ${ld['@type']}.`);
}

// Contacto: mailto operativo
const contacto = path.join(DIST, 'contacto', 'index.html');
if (fs.existsSync(contacto)) {
  checks++;
  if (!fs.readFileSync(contacto, 'utf8').includes('mailto:')) fail('Contacto: sin enlace mailto.');
}

// Sitemap
const sitemap = path.join(DIST, 'sitemap-0.xml');
checks++;
if (!fs.existsSync(sitemap)) {
  fail('Falta sitemap-0.xml (¿plugin @astrojs/sitemap desactivado?).');
} else {
  sitemapUrls = (fs.readFileSync(sitemap, 'utf8').match(/<loc>/g) || []).length;
  const indexables = htmlFiles.filter((f) => !f.endsWith('404.html'));
  if (sitemapUrls < indexables.length) {
    warn(`Sitemap con ${sitemapUrls} URLs y ${indexables.length} páginas indexables.`);
  }
}

// robots.txt
checks++;
if (!fs.existsSync(path.join(DIST, 'robots.txt'))) fail('Falta robots.txt.');

/* ---------- resumen ---------- */

console.log(`\nQA · ${htmlFiles.length} páginas · ${checks} comprobaciones · sitemap ${sitemapUrls} URLs`);

if (warns.length) {
  console.log(`\n⚠ Avisos (${warns.length}):`);
  for (const w of warns) console.log('  · ' + w);
}

if (errors.length) {
  console.log(`\n✗ Fallos (${errors.length}):`);
  for (const e of errors) console.log('  · ' + e);
  process.exit(1);
}

console.log('\n✓ Todo en orden.\n');
