/** Helpers de rutas respetando BASE_URL (GitHub Pages subpath). */

export const baseDir = () =>
  import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';

export const href = (path = '') => {
  const base = baseDir();
  if (!path || path === '/') return base;
  if (/^https?:\/\//.test(path)) return path;
  return base + path.replace(/^\/+/, '');
};

export const isActive = (currentPath: string, path = '/') => {
  const rel = '/' + currentPath.replace(baseDir(), '');
  const norm = path === '/' ? '/' : ('/' + path.replace(/^\/+|\/+$/g, '') + '/').replace('//', '/');
  if (norm === '/') return rel === '/'; // home no marca páginas de detalle
  if (norm.startsWith('/musica')) return rel.startsWith('/musica');
  return rel === norm || rel.startsWith(norm) || rel === norm.replace(/\/$/, '');
};
