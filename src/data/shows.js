/**
 * Conciertos — solo fechas verificadas en prensa (roucoson.com) y cartel de sala.
 *
 * Para añadir una fecha nueva: añade un objeto a `upcoming` o `past`.
 *   date: '2026-07-22' — { date, venue, city, notes }
 *   Si la fecha no es exacta, usa datePrecision: 'month' con fecha representativa
 *   (el día no se mostrará).
 * ticketUrl: null mientras no exista enlace real de venta.
 */

export const upcoming = [
  // ⚠️ pendiente: no hay fechas futuras publicadas. El estado vacío las anuncia.
];

export const past = [
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
