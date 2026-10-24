/**
 * Conciertos — fechas facilitadas por la banda y verificaciones de prensa
 * (roucoson.com / carteles).
 *
 * Para añadir una fecha nueva: añade un objeto a `upcoming` o `past`.
 *   date: '2026-07-22' — { date, venue, city, notes }
 *   Si la fecha no es exacta, usa datePrecision: 'month' con fecha representativa
 *   (el día no se mostrará).
 * ticketUrl: enlace de venta online. Si solo hay entradas en puerta,
 * deja ticketUrl: null, usa ticketNote y apunta infoUrl al post de
 * anuncio (Instagram, cartel, etc.).
 * Datos opcionales confirmados: endDate (ISO 8601, con huso horario si hay
 * hora), organizer: { name, url? } y ticketPrice (euros, 0 solo si es gratis).
 * No deducir el organizador a partir de la sala o la banda, ni la fecha de fin
 * a partir de la de inicio. Si no se conocen, omitir estos campos.
 */

import type { DatePrecision, Show } from '../types';

export const upcoming: Show[] = [
  {
    slug: 'sala-moon-2026-11-13',
    date: '2026-11-13',
    datePrecision: 'day',
    venue: 'Sala Moon',
    city: 'Santiago de Compostela',
    notes: 'con Martes Mal y Fuego Lolita',
    poster: {
      src: '/carteles/moon13nov.jpeg',
      width: 1182,
      height: 2560,
      alt: 'Cartel de Fuego Lolita, Martes Mal y gracias x nada en Sala Moon, Santiago de Compostela, el 13 de noviembre',
    },
    ticketUrl: null, // sin venta online: solo entradas en puerta
    ticketNote: 'Entradas solo en puerta',
    infoUrl: 'https://www.instagram.com/p/Degk1pFCm42/', // post de anuncio
  },
];

export const past: Show[] = [
  {
    slug: 'chiringo-do-mundo-2026-08-28',
    date: '2026-08-28',
    datePrecision: 'day',
    venue: 'Chiringo do Mundo',
    city: 'Liméns',
    notes: 'con Ruen y Dioivo',
    poster: {
      src: '/carteles/limens28ago.jpg',
      alt: 'Cartel del concierto de gracias x nada en Chiringo do Mundo, Liméns, el 28 de agosto de 2026',
      width: 1199,
      height: 1600,
    },
    ticketNote: 'Entrada inversa',
  },
  {
    slug: 'ocean-rock-bar-2026-08-27',
    photoGallery: 'orb27',
    date: '2026-08-27',
    datePrecision: 'day',
    venue: 'Ocean Rock Bar',
    city: 'Vigo',
    notes: 'con Five Star Service and the Black-Suited Ladies',
    ticketUrl: 'https://www.bandsintown.com/e/108786347',
    poster: {
      src: '/carteles/vigo27ago.jpg',
      alt: 'Cartel de gracias x nada con Five Star Service y Black-Suited Ladies en Ocean Rock Bar, Vigo, el 27 de agosto de 2026',
      width: 1080,
      height: 1920,
    },
  },
  {
    slug: 'ocean-rock-bar-2026-08-14',
    photoGallery: 'orb14',
    date: '2026-08-14',
    datePrecision: 'day',
    venue: 'Ocean Rock Bar',
    city: 'Vigo',
    notes: 'con Martes Mal',
    poster: {
      src: '/carteles/vigo14ago.jpg',
      alt: 'Cartel de gracias x nada con Martes Mal en Ocean Rock Bar, Vigo, el 14 de agosto de 2026',
      width: 1080,
      height: 1920,
    },
  },
  {
    date: '2026-07-22',
    slug: 'sala-mardi-gras-2026-07-22',
    photoGallery: 'mdg',
    datePrecision: 'day',
    venue: 'Sala Mardi Gras',
    city: 'A Coruña',
    notes: 'con Martes Mal (programación Mardi Gras)',
  },
  {
    date: '2024-08-31',
    datePrecision: 'day',
    venue: 'El Contrabajo',
    city: 'Vigo',
    notes: 'con Deaf Whale',
  },
  {
    date: '2023-01-28',
    datePrecision: 'day',
    venue: 'Sala Moon',
    city: 'Compostela',
    notes: 'con Eskravos',
  },
  {
    date: '2022-12-01',
    datePrecision: 'month',
    venue: 'SalaSon',
    city: 'Cangas do Morrazo',
    notes: 'Noite Punk, con Eskravos y Trikornio',
  },
  {
    date: '2022-06-01',
    datePrecision: 'month',
    venue: 'Sala Molotov',
    city: 'Vigo',
    notes: 'primer concierto (Grupos de Vigo en Loita)',
  },
];

export function formatDate(iso: string, precision: DatePrecision = 'day') {
  const [y, m, d] = iso.split('-').map(Number);
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  if (precision === 'month') return `${meses[m - 1]} ${y}`;
  return `${d} ${meses[m - 1]} ${y}`;
}

export function formatYear(iso: string) {
  return iso.split('-')[0];
}
