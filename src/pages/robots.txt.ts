import type { APIRoute } from 'astro';
import { SITE_ROOT, SITE_INDEXABLE } from '../config';

export const GET: APIRoute = () => new Response(
  SITE_INDEXABLE
    ? `User-agent: *\nAllow: /\n\nUser-agent: Googlebot\nAllow: /\n\nUser-agent: Bingbot\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', SITE_ROOT).href}\n`
    : `User-agent: *\nAllow: /\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
