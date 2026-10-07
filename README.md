# Propuesta de contenido — KUNÁ

Microsite estático de Splash Labs con la propuesta comercial para IIM Promotora Inmobiliaria.
HTML, CSS y JavaScript puros: sin frameworks, sin build step, sin analytics ni cookies.
La única dependencia externa son las fuentes de Google Fonts (Cormorant Garamond e Instrument Sans).

## Estructura

```
index.html            página única
styles.css            estilos (mobile-first, incluye @media print)
main.js               barra al hacer scroll, fade-in, videos por viewport, visor, imprimir
favicon.svg           favicon
apple-touch-icon.png  ícono para iOS / accesos directos
robots.txt            pide no indexar (la página también lleva meta noindex)
.nojekyll             evita que GitHub Pages procese el sitio con Jekyll
assets/img/           fotos optimizadas, posters y og.jpg (vista previa al compartir)
assets/video/         portada (hero-h / hero-v), previews livianos y versiones completas
```

## Despliegue en GitHub Pages

1. Subir el contenido de esta carpeta a la raíz de un repositorio (por ejemplo `propuesta-kuna`).
2. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   rama `main`, carpeta `/ (root)`. Guardar.
3. En un minuto queda publicado en `https://<usuario>.github.io/<repo>/`.

Si se prefiere servir desde `/docs`, mover todos los archivos a una carpeta `docs/` y elegir
esa carpeta en el paso 2. Todas las rutas son relativas, así que funciona en ambos casos.

**Importante:** las etiquetas Open Graph (`og:url`, `og:image`, `twitter:image`) en `index.html`
usan URLs absolutas a `https://fabbrvargas.github.io/propuesta-kuna/`. Si el repo o el usuario
cambian, actualizar esas URLs para que la vista previa en WhatsApp muestre la imagen.

Ningún archivo supera los 100 MB (límite de GitHub); el más pesado ronda 29 MB.

## Antes de enviar

- Probar el link en WhatsApp: si la vista previa no aparece, WhatsApp guarda caché por URL;
  agregar `?v=2` al final del link fuerza una lectura nueva.

## Ver en local

Cualquier servidor estático con soporte de HTTP Range sirve (los videos lo necesitan para
adelantar). En esta Mac: `python3 .claude/herramientas/serve.py propuesta-kuna 8767`.

## Créditos de imagen

- Videos y fotogramas del portafolio: trabajo previo de Splash Labs para San Patricio.
  No corresponden a KUNÁ y están rotulados así en el sitio.
- Fotografías de ambientación: Freepik (licencia de la cuenta Premium+ de Splash Labs),
  rotuladas en el sitio como imagen referencial de stock.
