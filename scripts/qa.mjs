/** QA del HTML estático: npm run check, o npm run qa tras construir. */
import fs from 'node:fs';
import path from 'node:path';
import { BAND, CONTACT, LINKS, VERIFIED_ARTIST_PROFILES, SITE, SITE_INDEXABLE, SITE_ROOT } from '../src/config.ts';

const DIST = path.resolve(process.argv[2] ?? 'dist');
const errors = [];
let checks = 0;
const check = (condition, message) => {
  checks++;
  if (!condition) errors.push(message);
};
const read = (file) => fs.readFileSync(path.join(DIST, file), 'utf8');
const attributes = (tag) => Object.fromEntries(
  Array.from(tag.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g), (match) => [match[1], match[2]]),
);
const tags = (html, name) => Array.from(html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g')), (match) => attributes(match[0]));
const basePath = new URL(SITE_ROOT).pathname;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

function localFile(url) {
  if (url.origin !== SITE.url) return null;
  if (!url.pathname.startsWith(basePath)) return undefined;
  const relative = decodeURIComponent(url.pathname.slice(basePath.length));
  const direct = path.resolve(DIST, relative);
  if (direct !== DIST && !direct.startsWith(DIST + path.sep)) return undefined;
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  const index = path.join(direct, 'index.html');
  return fs.existsSync(index) ? index : undefined;
}

function verifyLocal(value, current, label) {
  if (/^(?:mailto:|tel:|data:)/.test(value)) return;
  let url;
  try {
    url = new URL(value.replaceAll('&amp;', '&'), current);
  } catch {
    check(false, `${label}: URL inválida ${value}`);
    return;
  }
  if (!['http:', 'https:'].includes(url.protocol)) return;
  const file = localFile(url);
  if (file === null) return;
  check(Boolean(file), `${label}: destino local inexistente o fuera de SITE_BASE → ${url.pathname}`);
  if (file && url.hash && file.endsWith('.html')) {
    const fragment = decodeURIComponent(url.hash.slice(1));
    const ids = tags(fs.readFileSync(file, 'utf8'), '[a-z][a-z0-9:-]*').map((tag) => tag.id);
    check(ids.includes(fragment), `${label}: ancla inexistente → ${url.hash}`);
  }
}

if (!fs.existsSync(DIST)) {
  console.error('Falta dist/. Ejecuta npm run build antes de npm run qa.');
  process.exit(1);
}

const files = walk(DIST);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const socialUrls = VERIFIED_ARTIST_PROFILES;
const canonicalUrls = new Set();
const titles = new Set();
const descriptions = new Set();
check(htmlFiles.length > 0, 'No hay HTML estático.');
check(!files.some((file) => /(?:^|[\\/])(?:server|_worker\.js)(?:[\\/]|$)/.test(file)), 'El build contiene un runtime de servidor.');

for (const file of htmlFiles) {
  const page = path.relative(DIST, file).replaceAll('\\', '/');
  const route = page === 'index.html' ? '' : page.replace(/index\.html$/, '');
  const current = new URL(route, SITE_ROOT);
  const html = fs.readFileSync(file, 'utf8');
  const metas = tags(html, 'meta');
  const links = tags(html, 'link');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const meta = (name) => metas.find((tag) => tag.name === name || tag.property === name)?.content;
  const canonical = links.find((tag) => tag.rel === 'canonical')?.href;
  check(Boolean(title) && !titles.has(title), `${page}: title ausente o duplicado.`);
  titles.add(title);
  check(Boolean(meta('description')) && !descriptions.has(meta('description')), `${page}: description ausente o duplicada.`);
  descriptions.add(meta('description'));
  check(tags(html, 'html')[0]?.lang === SITE.lang, `${page}: idioma incorrecto.`);
  check(Boolean(meta('viewport')), `${page}: falta viewport.`);
  check(canonical === current.href, `${page}: canonical incorrecta (${canonical}; esperado ${current.href}).`);
  check(!canonicalUrls.has(canonical), `${page}: canonical duplicada.`);
  canonicalUrls.add(canonical);
  check(meta('og:url') === canonical, `${page}: og:url no coincide con canonical.`);
  for (const key of ['og:title', 'og:description', 'og:site_name', 'og:type', 'twitter:title', 'twitter:description']) {
    check(Boolean(meta(key)), `${page}: falta ${key}.`);
  }
  check(meta('twitter:card') === 'summary_large_image', `${page}: Twitter Card incorrecta.`);
  for (const key of ['og:image', 'twitter:image']) {
    check(meta(key) === new URL(SITE.ogImage, SITE_ROOT).href, `${page}: ${key} incorrecta.`);
  }
  check((html.match(/<h1\b/g) ?? []).length === 1, `${page}: debe tener un único h1.`);
  check(tags(html, 'main').some((tag) => tag.id === 'main'), `${page}: falta main para el enlace de salto.`);
  check(tags(html, 'nav').every((tag) => tag['aria-label']), `${page}: navegación sin nombre accesible.`);
  const headings = Array.from(html.matchAll(/<h([1-6])\b([^>]*)>/g), (match) => Number(attributes(match[2])['aria-level'] ?? match[1]));
  check(headings.every((level, index) => index === 0 || level <= headings[index - 1] + 1), `${page}: salto de nivel en encabezados.`);
  check(page === '404.html' || !SITE_INDEXABLE ? meta('robots')?.includes('noindex') : meta('robots')?.startsWith('index, follow'), `${page}: directiva robots incorrecta.`);

  for (const tag of [...tags(html, 'a'), ...links]) {
    if (tag.href) verifyLocal(tag.href, current, page);
  }
  for (const tag of [...tags(html, 'img'), ...tags(html, 'script'), ...tags(html, 'source')]) {
    if (tag.src) verifyLocal(tag.src, current, page);
    if (tag.srcset) {
      for (const source of tag.srcset.split(',')) verifyLocal(source.trim().split(/\s+/)[0], current, page);
    }
  }
  for (const tag of tags(html, 'img')) {
    check('alt' in tag, `${page}: imagen sin alt.`);
    check(Number(tag.width) > 0 && Number(tag.height) > 0, `${page}: imagen sin dimensiones.`);
  }
  for (const key of ['og:image', 'twitter:image']) {
    if (meta(key)) verifyLocal(meta(key), current, page);
  }
  for (const url of socialUrls) check(html.includes(url), `${page}: falta la red oficial ${url}.`);

    const structuredData = [];
  for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      structuredData.push(JSON.parse(match[1]));
      check(true, '');
    } catch {
      check(false, `${page}: JSON-LD inválido.`);
    }
  }
    const entities = structuredData.flatMap((data) => data['@graph'] ?? [data]);
    const band = entities.find((data) => data['@type'] === 'MusicGroup');
  check(band?.name === BAND.name && band?.foundingDate === BAND.formed, `${page}: falta MusicGroup con identidad verificada.`);
    check(band?.description === BAND.description && JSON.stringify(band?.genre) === JSON.stringify(['Pop Punk', 'Skate Punk']), `${page}: descripción o género de MusicGroup incorrectos.`);
    check(band?.foundingLocation?.name === BAND.origin, `${page}: origen de MusicGroup incorrecto.`);
  check(band?.url === SITE_ROOT, `${page}: MusicGroup.url incorrecta.`);
    check(JSON.stringify(band?.sameAs) === JSON.stringify(socialUrls), `${page}: MusicGroup.sameAs debe contener solo los perfiles verificados.`);
  if (band?.image) verifyLocal(band.image, current, `${page} MusicGroup.image`);
    const website = entities.find((data) => data['@type'] === 'WebSite');
    const webpage = entities.find((data) => data['@type'] === 'WebPage');
    check(website?.url === SITE_ROOT, `${page}: falta WebSite con URL canónica.`);
    check(webpage?.url === canonical && webpage?.name === title, `${page}: WebPage no coincide con título/canonical visibles.`);
    const breadcrumb = entities.find((data) => data['@type'] === 'BreadcrumbList');
    if (breadcrumb) {
      check(tags(html, 'nav').some((tag) => tag['aria-label'] === 'Ruta de navegación'), `${page}: BreadcrumbList sin migas visibles.`);
      check(breadcrumb.itemListElement?.length > 1, `${page}: BreadcrumbList incompleta.`);
    }
  if (page.startsWith('musica/') && page !== 'musica/index.html') {
      const album = entities.find((data) => data['@type'] === 'MusicAlbum');
      const recordings = entities.filter((data) => data['@type'] === 'MusicRecording');
      const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, '').trim();
      check(Boolean(album) && album?.name === h1, `${page}: falta MusicAlbum con el título visible.`);
      check(album?.url === canonical, `${page}: MusicAlbum no coincide con la URL canónica.`);
      check(album?.albumReleaseType?.startsWith('https://schema.org/'), `${page}: albumReleaseType inválido.`);
      check(album?.numTracks === recordings.length && recordings.length > 0 && recordings.every((recording) => html.includes(recording.name)), `${page}: MusicRecording no coincide con la lista visible.`);
      if (album?.image) verifyLocal(album.image, current, `${page} MusicAlbum.image`);
  }
    if (page === 'directo/index.html') {
      check(!entities.some((data) => data['@type'] === 'MusicEvent'), `${page}: MusicEvent debe estar en la página individual.`);
    }
    if (page.startsWith('directo/') && page !== 'directo/index.html' && SITE_INDEXABLE) {
      const events = entities.filter((data) => data['@type'] === 'MusicEvent');
      check(events.length === 1, `${page}: debe contener exactamente un MusicEvent.`);
      const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      check(events.every((event) => {
        const [year, month, day] = event.startDate.split('-');
        const visibleDate = `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`;
        return html.includes(event.location?.name) && html.includes(visibleDate);
      }), `${page}: datos MusicEvent distintos del concierto visible.`);
      for (const event of events) {
        check(event.url === canonical && event['@id'] === `${canonical}#event`, `${page}: URL del evento distinta de canonical.`);
        check(webpage?.mainEntity?.['@id'] === event['@id'], `${page}: el evento debe ser la entidad principal.`);
        check(typeof event.description === 'string' && event.description.length > 0, `${page}: falta descripción del concierto.`);
        check(Array.isArray(event.image) && event.image.length > 0, `${page}: falta imagen del concierto.`);
        for (const image of event.image ?? []) verifyLocal(image, current, `${page} MusicEvent.image`);
        if (event.offers) {
          check(typeof event.offers.price === 'number' && event.offers.price >= 0 && event.offers.priceCurrency === 'EUR', `${page}: precio de entradas inválido.`);
        }
      }
    }
}

// Las URLs relativas de CSS deben resolver también fuentes e imágenes.
for (const file of files.filter((entry) => entry.endsWith('.css'))) {
  const relative = path.relative(DIST, file).replaceAll('\\', '/');
  const cssUrl = new URL(relative, SITE_ROOT);
  for (const match of fs.readFileSync(file, 'utf8').matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) {
    verifyLocal(match[1], cssUrl, relative);
  }
}

for (const required of ['index.html', '404.html', 'contacto/index.html', 'directo/index.html', 'musica/index.html', 'sobre/index.html', 'robots.txt', 'manifest.webmanifest']) {
  check(fs.existsSync(path.join(DIST, required)), `Falta ${required}.`);
}
if (SITE_INDEXABLE) {
  for (const required of ['sitemap-index.xml', 'sitemap-0.xml']) {
    check(fs.existsSync(path.join(DIST, required)), `Falta ${required}.`);
  }
}
check(fs.existsSync(path.join(DIST, 'contacto/index.html')) && read('contacto/index.html').includes(`mailto:${CONTACT.email}`), 'Contacto: falta mailto oficial.');

let sitemapUrls = [];
for (const filename of SITE_INDEXABLE ? ['sitemap-index.xml', 'sitemap-0.xml'] : []) {
  if (!fs.existsSync(path.join(DIST, filename))) continue;
  const xml = read(filename);
  check(xml.includes('http://www.sitemaps.org/schemas/sitemap/0.9'), `${filename}: namespace incorrecto.`);
  const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
  check(urls.length > 0, `${filename}: vacío.`);
  urls.forEach((url) => {
    check(url.startsWith(SITE_ROOT), `${filename}: URL ajena a SITE_ROOT → ${url}`);
    verifyLocal(url, SITE_ROOT, filename);
  });
  if (filename === 'sitemap-0.xml') sitemapUrls = urls;
}
const indexableUrls = [...canonicalUrls].filter((url) => !url?.endsWith('/404.html'));
if (SITE_INDEXABLE) {
  check(sitemapUrls.length === indexableUrls.length && indexableUrls.every((url) => sitemapUrls.includes(url)), 'El sitemap no coincide con las páginas indexables.');
} else {
  check(sitemapUrls.length === 0, 'Un despliegue no indexable no debe publicar URLs en el sitemap.');
}
if (fs.existsSync(path.join(DIST, 'robots.txt'))) {
  const robots = read('robots.txt');
  if (SITE_INDEXABLE) {
    check(/User-agent: \*\s+Allow: \//.test(robots) && ['Googlebot', 'Bingbot', 'OAI-SearchBot'].every((agent) => robots.includes(`User-agent: ${agent}\nAllow: /`)), 'robots.txt debe permitir Googlebot, Bingbot y OAI-SearchBot.');
    check(robots.includes(`Sitemap: ${new URL('sitemap-index.xml', SITE_ROOT).href}`), 'robots.txt: sitemap incorrecto.');
  } else {
    check(/^User-agent: \*\s+Allow: \/$/m.test(robots) && !robots.includes('Sitemap:'), 'robots.txt de staging debe permitir leer noindex y omitir el sitemap.');
  }
}
if (fs.existsSync(path.join(DIST, 'manifest.webmanifest'))) {
  try {
    const manifest = JSON.parse(read('manifest.webmanifest'));
    manifest.icons.forEach((icon) => verifyLocal(icon.src, new URL('manifest.webmanifest', SITE_ROOT), 'manifest icon'));
    verifyLocal(manifest.start_url, new URL('manifest.webmanifest', SITE_ROOT), 'manifest start_url');
  } catch {
    check(false, 'Manifest inválido.');
  }
}

console.log(`\nQA · ${htmlFiles.length} páginas · ${checks} comprobaciones · sitemap ${sitemapUrls.length} URLs`);
if (errors.length) {
  console.error(errors.map((error) => `  ✗ ${error}`).join('\n'));
  process.exit(1);
}
console.log('✓ HTML, navegación, assets, metadatos y rastreo correctos.\n');
