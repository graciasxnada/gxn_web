# SEO y descubrimiento

## Cambios incluidos

- `src/config.ts` es la fuente central del nombre, biografía factual, origen, fecha de formación, géneros y perfiles confirmados. El sitio y `MusicGroup` reutilizan esos datos.
- Las páginas generan títulos, descripciones, canonicals, Open Graph, Twitter Cards, `WebSite` y `WebPage`. Las páginas interiores muestran migas de pan vinculadas a `BreadcrumbList`.
- Las fichas de catálogo generan `MusicAlbum` y `MusicRecording` desde fechas, temas, duraciones, portada y enlaces del catálogo. La agenda añade `MusicEvent` solo para fechas futuras confirmadas.
- Los canonicals, assets, JSON-LD, robots y sitemaps usan el origen y base configurados. El sitemap contiene páginas canónicas prerenderizadas; la página 404 queda fuera.
- Googlebot, Bingbot y OAI-SearchBot pueden rastrear la versión pública. `SITE_INDEXABLE=false` pone `noindex`, permite que el rastreador lea esa directiva y omite los archivos del sitemap en builds temporales.
- Las imágenes ya se sirven como WebP con dimensiones declaradas; las fuentes se sirven localmente y se precarga Archivo. La navegación mantiene una única rutina pequeña de JavaScript y el reproductor de Spotify carga de forma diferida.
- Se retiraron de la web los perfiles de terceros que no estaban respaldados por la identidad confirmada; quedan Spotify e Instagram. El contenido y el diseño existentes se mantienen.

## Comprobación local y publicación

Instala Node.js 22.18 o posterior y ejecuta `npm ci` y `npm run check`. Esto comprueba tipos Astro, genera el HTML estático y verifica enlaces internos, dimensiones y textos alternativos, canonicals, títulos/descripciones únicos, metadatos sociales, JSON-LD, relaciones de lanzamientos y conciertos, robots y coincidencia del sitemap con las canonicals.

Para un sitio temporal, construye con `SITE_INDEXABLE=false`; vuelve a `SITE_INDEXABLE=true` para la publicación pública. El workflow de GitHub Pages fuerza este último valor. Nunca publiques un staging con el valor público.

Después del despliegue, revisa desde una conexión pública que cada URL canónica importante, `robots.txt` y `sitemap-index.xml` responda con HTTP 200; la URL `404.html` debe responder 404 si la plataforma ofrece ese comportamiento. GitHub Pages no permite configurar reglas de WAF o seguridad a nivel de servidor. Si se añade un proxy, CDN o firewall, permite GET/HEAD sin desafío para Googlebot, Bingbot y OAI-SearchBot y confirma los códigos HTTP desde Search Console, Bing Webmaster Tools y registros de acceso.

`npm run check` no mide métricas de campo ni sustituye pruebas de navegador. En Chrome, abre la página publicada en una ventana móvil y otra de escritorio, revisa navegación por teclado, carga de imágenes y desbordamiento horizontal, y ejecuta Lighthouse para SEO, accesibilidad, rendimiento y buenas prácticas. Revisa Core Web Vitals de campo cuando haya datos suficientes en Search Console. Las metas de LCP <2,5 s, INP <200 ms y CLS <0,1 deben confirmarse con datos reales; el sitio no promete esos resultados ni rankings.

Pega el HTML publicado de la portada, la ficha del EP y la agenda en Schema Markup Validator para una comprobación externa de Schema.org. El marcado `MusicGroup`, `MusicAlbum` y `MusicRecording` describe entidades; puede no producir un resultado enriquecido en Google.

El permiso de `OAI-SearchBot` permite el rastreo para búsqueda de OpenAI. No configura permisos de entrenamiento de modelos; son asuntos separados.

## Google Search Console

1. Añade y verifica una propiedad de dominio mediante DNS si controlas un dominio propio. Para la URL actual de GitHub Pages, usa una propiedad de prefijo de URL y completa el método disponible.
2. Abre **Sitemaps** y envía `https://dcarball0.github.io/gxn_web/sitemap-index.xml` (o la URL equivalente bajo el `SITE_ROOT` vigente).
3. Inspecciona la portada, `/sobre/`, `/musica/`, la ficha `/musica/gxn-ep/` y `/directo/`. Confirma canonical seleccionada, rastreo permitido y HTML renderizado; solicita indexación para las páginas nuevas si aún no aparecen.
4. Revisa cobertura/indexación, acciones manuales, seguridad y Core Web Vitals tras cada despliegue relevante.

## Bing Webmaster Tools

1. Añade el sitio y verifica su propiedad. Si la opción está disponible, impórtalo desde Search Console para reducir trabajo duplicado.
2. Envía el sitemap `https://dcarball0.github.io/gxn_web/sitemap-index.xml` (o su equivalente actual).
3. Usa URL Inspection para comprobar portada, biografía, catálogo, ficha del EP y conciertos. Revisa rastreo, canonical y cualquier bloqueo informado.

## Oportunidades pendientes, por impacto esperado

1. Configurar un dominio propio cuando la banda disponga de uno y actualizar `SITE_URL`, `SITE_BASE=/`, DNS y GitHub Pages; mantener los canonicals y sitemap bajo ese dominio.
2. Verificar la propiedad en Google Search Console y Bing Webmaster Tools, enviar el sitemap y corregir cualquier problema de indexación detectado.
3. Enlazar la web oficial desde los perfiles de Spotify e Instagram y desde perfiles oficiales de salas, festivales y medios cuando sea posible.
4. Añadir cobertura de prensa con enlaces a fuentes originales y contexto factual cuando exista; no crear citas ni páginas de preguntas artificiales.
5. Completar precios, enlace de entradas, dirección o cambios de estado de cada concierto solo cuando estén confirmados, y mantener actualizada la agenda.
6. Ofrecer material de prensa bajo petición por correo, con biografía y fotografías autorizadas.
7. Incorporar otros perfiles a `sameAs` o a la página de contacto únicamente después de confirmar que pertenecen a esta banda.
8. Revisar Core Web Vitals de campo y ajustar imágenes o carga de fuentes si las mediciones muestran un problema real.
