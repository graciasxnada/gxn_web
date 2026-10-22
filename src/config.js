/**
 * Configuración central del sitio — todo lo que cambia con el tiempo vive aquí.
 * ---------------------------------------------------------------------------
 * ⚠️ PENDIENTE (info real de la banda):
 *   - SITE.url / SITE.base → dominio real cuando exista.
 *   - CONTACT.email → correo real de booking/prensa (hoy se usa Instagram como canal).
 *   - PRESS.availability → técnico/rider si la banda lo quiere publicar.
 */

export const SITE = {
  url: 'https://dcarball0.github.io', // ⚠️ pendiente: dominio real
  base: '/gxn_web', // ⚠️ carpeta del repo en GitHub Pages; usar '/' con dominio propio
  title: 'gracias x nada',
  description:
    'gracias x nada (GxN) es un trío de pop punk y skate punk de Vigo, Galicia. Guitarras rápidas, estribillos directos y canciones sobre lo que pasa entre la rampa y la última canción de la noche.',
  lang: 'es',
  ogImage: 'og.jpg', // en src/assets/img — 1200×630
};

export const BAND = {
  name: 'gracias x nada',
  short: 'GxN',
  formed: '2022',
  origin: 'Vigo, Galicia (España)',
  originShort: 'Vigo, Galicia',
  genre: ['pop punk', 'skate punk'],
  bioShort:
    'Trío de Vigo que toca pop punk rápido y melódico, heredero de finales de los 90 y los 2000.',
  membersCount: 3,
};

export const LINKS = {
  spotify: 'https://open.spotify.com/artist/4PU43GQny4NK07FvQ3VLGs',
  instagram: 'https://www.instagram.com/graciasxnada_/',
  appleMusic: 'https://music.apple.com/us/artist/gracias-x-nada/6778918504',
  youtube: 'https://www.youtube.com/@graciasxnadagxn',
  spotifyHandle: 'gracias x nada',
  instagramHandle: '@graciasxnada_',
};

/**
 * Contacto.
 */
export const CONTACT = {
  email: 'graciasxnadagrupo@gmail.com',
  booking: 'Booking, salas y promotores',
  press: 'Prensa, radios y colaboraciones',
};

/** Press kit (disponible bajo petición hasta que exista archivo real) */
export const PRESS = {
  kitFile: null, // ⚠️ pendiente: ruta a PDF del press kit real (p. ej. '/press/gxn-epk.pdf')
  bioShort:
    'gracias x nada (GxN) es un trío vigués de pop punk y skate punk formado en 2022. Guitarras rápidas, ritmos acelerados, estribillos directos y melodías heredadas del punk melódico de finales de los 90 y los 2000, cantadas en castellano y gallego.',
};

export const NAV = [
  { label: 'Música', href: '/musica/' },
  { label: 'Sobre', href: '/sobre/' },
  { label: 'Directo', href: '/directo/' },
  { label: 'Contacto', href: '/contacto/' },
];
