import type { ImageMetadata } from 'astro';

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
  date: string;
  datePrecision?: DatePrecision;
  venue: string;
  city: string;
  notes?: string;
  ticketUrl?: string | null;
  ticketNote?: string;
  infoUrl?: string;
}
