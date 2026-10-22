import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config.js';

export default defineConfig({
  // ⚠️ SITE_URL es el único lugar donde se define el dominio público del sitio.
  // Cámbialo aquí cuando exista dominio propio.
  site: SITE.url,
  // '/gxn_web' para GitHub Pages (carpeta del repo). Usa '/' si el sitio vive en la raíz de un dominio propio.
  base: SITE.base,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
