import type { ImageMetadata } from 'astro';

const files = import.meta.glob<ImageMetadata>('../assets/img/directo/*.webp', { eager: true, import: 'default' });
const pick = (prefix: string, numbers?: number[]) => Object.keys(files)
  .filter((path) => path.includes(`/${prefix}-`))
  .filter((path) => !numbers || numbers.some((number) => path.endsWith(`/${prefix}-${number}.webp`)))
  .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
  .map((path) => files[path]);

export const livePhotos = {
  orb14: {
    title: 'Ocean Rock Bar · Vigo · 14.08.2026',
    alt: 'gracias x nada en directo en el Ocean Rock Bar de Vigo, 14 de agosto de 2026',
    photos: pick('orb', [1, 2, 3, 4]),
  },
  orb27: {
    title: 'Ocean Rock Bar · Vigo · 27.08.2026',
    alt: 'gracias x nada en directo en el Ocean Rock Bar de Vigo, 27 de agosto de 2026',
    photos: pick('orb', [5]),
  },
  mdg: {
    title: 'Sala Mardi Gras · A Coruña · 22.07.2026',
    alt: 'gracias x nada en directo en la Sala Mardi Gras de A Coruña, 22 de julio de 2026',
    photos: pick('mdg'),
  },
};
