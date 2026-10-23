import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE, SITE_INDEXABLE } from './src/config.ts';

export default defineConfig({
  site: SITE.url,
  base: SITE.base,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: SITE_INDEXABLE ? [sitemap()] : [],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
