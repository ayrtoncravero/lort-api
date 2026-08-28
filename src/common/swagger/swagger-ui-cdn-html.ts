const SWAGGER_UI_CDN_BASE = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist';

/**
 * Self-contained Swagger UI page loading swagger-ui-dist assets from a CDN.
 *
 * NestJS's built-in SwaggerModule UI serves those assets from
 * node_modules/swagger-ui-dist via express.static at request time. Vercel's
 * serverless build only bundles files that are statically imported, so those
 * assets 404 in production even though the JSON/HTML routes themselves work.
 * This page avoids that dependency entirely, so it renders identically in
 * local dev and on Vercel.
 */
export function buildSwaggerUiCdnHtml(
  jsonDocumentUrl: string,
  title: string,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link rel="stylesheet" href="${SWAGGER_UI_CDN_BASE}/swagger-ui.css">
  <style>body { margin: 0; background: #fafafa; }</style>
</head>
<body>
<div id="swagger-ui"></div>
<script src="${SWAGGER_UI_CDN_BASE}/swagger-ui-bundle.js"></script>
<script src="${SWAGGER_UI_CDN_BASE}/swagger-ui-standalone-preset.js"></script>
<script>
  window.onload = function () {
    window.ui = SwaggerUIBundle({
      url: '${jsonDocumentUrl}',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: 'StandaloneLayout',
    });
  };
</script>
</body>
</html>
`;
}
