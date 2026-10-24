import type { APIRoute, GetStaticPaths } from 'astro';
import { upcoming } from '../../data/shows';
import { BAND, SITE_ROOT } from '../../config';
import type { Show } from '../../types';

export const getStaticPaths = (() => upcoming
  .filter((show) => show.slug && show.startDate)
  .map((show) => ({ params: { slug: show.slug }, props: { show } }))) satisfies GetStaticPaths;

const escapeText = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
const utc = (value: string) => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

// iCalendar lines are folded at 75 UTF-8 bytes, including the continuation space.
const fold = (line: string) => {
  let result = '';
  let bytes = 0;
  for (const character of line) {
    const size = new TextEncoder().encode(character).length;
    if (bytes + size > 75) {
      result += '\r\n ';
      bytes = 1;
    }
    result += character;
    bytes += size;
  }
  return result;
};

export const GET: APIRoute = ({ props }) => {
  const show = props.show as Show;
  const url = new URL(`directo/${show.slug}/`, SITE_ROOT).href;
  const location = [show.venue, show.address?.streetAddress, show.address?.postalCode, show.city, show.address?.addressRegion].filter(Boolean).join(', ');
  const doorLabel = show.doorTime ? new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' }).format(new Date(show.doorTime)) : undefined;
  const description = [
    show.notes,
    doorLabel ? `Apertura de puertas: ${doorLabel}.` : undefined,
    show.ticketPrice !== undefined ? `Entrada: ${show.ticketPrice} €.` : undefined,
    show.ticketNote,
    url,
  ].filter(Boolean).join('\n');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//gracias x nada//Conciertos//ES',
    'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:${url}#event`, `DTSTAMP:${utc(new Date().toISOString())}`,
    `DTSTART:${utc(show.startDate!)}`,
    ...(show.endDate ? [`DTEND:${utc(show.endDate)}`] : []),
    `SUMMARY:${escapeText(`${BAND.name} en ${show.venue}`)}`,
    `LOCATION:${escapeText(location)}`, `DESCRIPTION:${escapeText(description)}`,
    `URL:${url}`, 'END:VEVENT', 'END:VCALENDAR',
  ];
  return new Response(lines.map(fold).join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="${show.slug}.ics"` },
  });
};
