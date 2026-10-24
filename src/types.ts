import type { ImageMetadata } from 'astro';
import type { livePhotos } from './data/livePhotos';

export interface Cover {
  file: ImageMetadata;
  alt: string;
}

export interface AdvanceRelease {
  title: string;
  date: string;
  code?: string;
  note?: string;
  cover: Cover;
  links: { spotify: string };
}

export interface Release {
  slug: string;
  title: string;
  type: 'single' | 'ep' | 'album';
  date: string;
  cover: Cover;
  featured?: boolean;
  description: string;
  tracks: { title: string; duration: string }[];
  credits: string[];
  links: { spotify: string };
  code?: string;
  adelantos: AdvanceRelease[];
}

export type DatePrecision = 'day' | 'month';

export interface Show {
  photoGallery?: keyof typeof livePhotos;
  slug?: string;
  date: string;
  datePrecision?: DatePrecision;
  venue: string;
  city: string;
  notes?: string;
  ticketUrl?: string | null;
  ticketNote?: string;
  infoUrl?: string;
  endDate?: string;
  organizer?: { name: string; url?: string };
  ticketPrice?: number;
  poster?: { src: string; alt: string; width: number; height: number };
}
