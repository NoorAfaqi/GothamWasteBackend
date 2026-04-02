const express = require("express");

const router = express.Router();

/**
 * Swagger UI loaded from CDN so asset URLs are not broken on Vercel
 * (catch-all routing was returning HTML for /api-docs/*.js).
 */
const SWAGGER_UI_DIST = "5.11.0";

function swaggerUiHtml() {
  // Same-origin relative URL — works on Vercel and locally (avoids proxy host mismatches).
  const specUrl = "/openapi.json";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Gotham Waste API</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_DIST}/swagger-ui.css" crossorigin="anonymous"/>
  <style>.swagger-ui .topbar{display:none}</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_DIST}/swagger-ui-bundle.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_DIST}/swagger-ui-standalone-preset.js" crossorigin="anonymous"></script>
  <script>
    window.onload = function () {
      window.ui = SwaggerUIBundle({
        url: ${JSON.stringify(specUrl)},
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`;
}

router.get("/", (req, res) => {
  res.type("html").send(swaggerUiHtml());
});

module.exports = router;
