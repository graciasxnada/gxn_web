/**
 * Configuración central del sitio — todo lo que cambia con el tiempo vive aquí.
 * ---------------------------------------------------------------------------
 * ⚠️ PENDIENTE (info real de la banda):
 *   - SITE_URL / SITE_BASE → dominio propio cuando exista.
 */

// El valor por defecto conserva el destino actual, no un dominio de ejemplo.
const productionUrl = new URL(process.env.SITE_URL?.trim() || 'https://dcarball0.github.io');
if (!['https:', 'http:'].includes(productionUrl.protocol) || productionUrl.pathname !== '/' || productionUrl.search || productionUrl.hash || productionUrl.username || productionUrl.password) {
  throw new Error('SITE_URL debe ser un origen HTTP(S), sin ruta. Configura la ruta en SITE_BASE.');
}
const configuredBase = process.env.SITE_BASE?.trim() || '/gxn_web';
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]*\/?$/.test(configuredBase)) {
  throw new Error('SITE_BASE debe ser / o una ruta absoluta, por ejemplo /gxn_web.');
}

export const BAND = {
  name: 'gracias x nada',
  short: 'GxN',
  formed: '2022',
  origin: 'Vigo, Galicia (España)',
  originShort: 'Vigo, Galicia',
  genre: ['pop punk', 'skate punk'],
  description:
    'gracias x nada (GxN) es un trío de pop punk y skate punk de Vigo, Galicia, formado en 2022.',
  membersCount: 3,
};

export const SITE = {
  url: productionUrl.origin,
  base: configuredBase === '/' ? '/' : configuredBase.replace(/\/+$/, ''),
  title: BAND.name,
  description: BAND.description,
  lang: 'es',
  ogImage: 'og.jpg', // en public/ — 1200×630
};

export const SITE_ROOT = new URL(SITE.base === '/' ? '/' : `${SITE.base}/`, SITE.url).href;

export const LINKS = {
  spotify: 'https://open.spotify.com/artist/4PU43GQny4NK07FvQ3VLGs',
  instagram: 'https://www.instagram.com/graciasxnada_/',
  tiktok: 'https://www.tiktok.com/@graciasxnada_',
  liveVideo: 'https://youtu.be/y3B9V_Z0yWA',
  spotifyHandle: 'gracias x nada',
  instagramHandle: '@graciasxnada_',
};

/**
 * Contacto.
 */
export const CONTACT = {
  email: 'contacto@graciasxnada.es',
  booking: 'Booking, salas y promotores',
  press: 'Prensa, radios y colaboraciones',
};

/** Biografía pública para medios; el material adicional se solicita por correo. */
export const PRESS = {
  bioShort: BAND.description,
};

export const NAV = [
  { label: 'Música', href: '/musica/' },
  { label: 'Sobre', href: '/sobre/' },
  { label: 'Directo', href: '/directo/' },
  { label: 'Contacto', href: '/contacto/' },
];

/** Canonical artist profiles confirmed by the band. */
export const VERIFIED_ARTIST_PROFILES = [LINKS.spotify, LINKS.instagram, LINKS.tiktok];

/**
 * Optional switch for temporary deployments. Production builds should set
 * SITE_INDEXABLE=true; previews should set it to false.
 */
export const SITE_INDEXABLE = process.env.SITE_INDEXABLE?.trim().toLowerCase() !== 'false';
