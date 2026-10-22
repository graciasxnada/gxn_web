/**
 * Conciertos — fechas facilitadas por la banda y verificaciones de prensa
 * (roucoson.com / carteles).
 *
 * Para añadir una fecha nueva: añade un objeto a `upcoming` o `past`.
 *   date: '2026-07-22' — { date, venue, city, notes }
 *   Si la fecha no es exacta, usa datePrecision: 'month' con fecha representativa
 *   (el día no se mostrará).
 * ticketUrl: null mientras no exista enlace real de venta.
 */

export const upcoming = [
  {
    date: '2026-11-13',
    datePrecision: 'day',
    venue: 'Sala Moon',
    city: 'Santiago de Compostela',
    notes: 'con Martes Mal y Fuego Lolita',
    ticketUrl: null, // ⚠️ añadido cuando exista venta
  },
];

export const past = [
  {
    date: '2026-08-28',
    datePrecision: 'day',
    venue: 'Chiringo do Mundo',
    city: 'Liméns',
    notes: 'con Ruen y Dioivo',
  },
  {
    date: '2026-08-27',
    datePrecision: 'day',
    venue: 'Ocean Rock Bar',
    city: 'Vigo',
    notes: 'con Five Star Service and the Black-Suited Ladies',
  },
  {
    date: '2026-08-14',
    datePrecision: 'day',
    venue: 'Ocean Rock Bar',
    city: 'Vigo',
    notes: 'con Martes Mal',
  },
  {
    date: '2026-07-22',
    datePrecision: 'day',
    venue: 'Sala Mardi Gras',
    city: 'A Coruña',
    notes: 'con Martes Mal — programación Mardi Gras',
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
    notes: 'primer concierto — Grupos de Vigo en Loita',
  },
];

export function formatDate(iso, precision = 'day') {
  const [y, m, d] = iso.split('-').map(Number);
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  if (precision === 'month') return `${meses[m - 1]} ${y}`;
  return `${d} ${meses[m - 1]} ${y}`;
}

export function formatYear(iso) {
  return iso.split('-')[0];
}
