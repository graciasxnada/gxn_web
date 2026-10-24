/**
 * Discografía — datos verificados del catálogo oficial de Spotify
 * (artista: 4PU43GQny4NK07FvQ3VLGs) y de prensa (roucoson.com).
 *
 * Para añadir un lanzamiento: copia un bloque, cambia slug/título/fecha/portada
 * y los enlaces. El resto de la web se genera solo.
 *
 * Los singles de adelanto no van como lanzamientos aparte: se listan en
 * `adelantos` del lanzamiento al que precedieron (la ficha del EP los recoge).
 *
 * types: 'single' | 'ep' | 'album'
 * durations: segundos.
 * credits: solo hechos verificados (Spotify: artistas; prensa: producción).
 * links: solo URLs oficiales confirmadas — no inventar manzanas/etc.
 */

import coverGxN from '../assets/img/cover-ep-gxn.webp';
import type { Release } from '../types';
import coverEntiendeme from '../assets/img/cover-entiendeme.webp';
import coverCancionAmor from '../assets/img/cover-cancion-amor.webp';
import coverIncomprendidos from '../assets/img/cover-incomprendidos.webp';

export const releases: Release[] = [
  {
    slug: 'gxn-ep',
    title: 'GxN',
    type: 'ep',
    date: '2025-04-18',
    cover: { file: coverGxN, alt: 'Portada del EP GxN de gracias x nada: explosión de cómic amarilla sobre papel verde arrugado, con las letras rojas GXN' },
    featured: true,
    description:
      'Primer EP de gracias x nada. Cinco canciones de pop punk melódico, dos voces que se pasan el micrófono y guitarras que van a fondo. De los dos minutos de Canción de amor adolescente a los casi ocho de Mañana se acaba el mundo.',
    tracks: [
      { title: 'Incomprendidos', duration: '3:36', isrc: 'USY242420182' },
      { title: 'Atardecer', duration: '3:22', isrc: 'USHM22507938' },
      { title: 'Canción de amor adolescente', duration: '2:06', isrc: 'USY242479993' },
      { title: 'Mañana se acaba el mundo', duration: '7:44', isrc: 'USHM22507939' },
      { title: 'Entiéndeme (con kinss x deica)', duration: '2:16', isrc: 'USCGH2529719' },
    ],
    credits: [
      'Todo el EP fue grabado, mezclado y masterizado en casa de deica durante 2024.',
      'Con kinss x deica en Entiéndeme.',
    ],
    links: {
      spotify: 'https://open.spotify.com/album/7laXnCkDjHBuUPjJnX9U16',
    },
    code: 'GXN 001',
    upc: '7300346703447',
    // Singles de adelanto publicados antes del EP (sin código de catálogo).
    adelantos: [
      {
        title: 'Incomprendidos',
        date: '2024-11-07',
        note: 'primer single publicado por la banda y tema con el que suelen abrir los directos',
        cover: { file: coverIncomprendidos, alt: 'Portada del single Incomprendidos de gracias x nada' },
        links: { spotify: 'https://open.spotify.com/album/4I0z6glzhAmJSif8xOwVBu' },
      },
      {
        title: 'Canción de amor adolescente',
        date: '2024-12-20',
        cover: { file: coverCancionAmor, alt: 'Portada del single Canción de amor adolescente de gracias x nada' },
        links: { spotify: 'https://open.spotify.com/album/5RFQdGdxFns3B9msOfaYIX' },
      },
      {
        title: 'Entiéndeme',
        date: '2025-01-04',
        note: 'con kinss x deica',
        cover: { file: coverEntiendeme, alt: 'Portada del single Entiéndeme: silueta de un perro dentro de una explosión cómic amarilla sobre papel verde con huellas' },
        links: { spotify: 'https://open.spotify.com/album/6RItaNJN4852THxFD22XQN' },
      },
    ],
  },
];

/** El EP destacado en home */
export const featuredRelease = releases.find((r) => r.featured) ?? releases[0];

export const releaseTypeLabel: Record<Release['type'], string> = { single: 'Single', ep: 'EP', album: 'Álbum' };

export function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${d} ${meses[m - 1]} ${y}`;
}
