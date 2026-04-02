require("./config/env");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const binRoutes = require("./routes/binRoutes");
const healthRoutes = require("./routes/healthRoutes");
const openApiSpec = require("./docs/openapi");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/openapi.json", (req, res) => {
  res.json(openApiSpec);
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    customSiteTitle: "Gotham Waste API",
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

app.get("/", (req, res) => {
  res.json({
    service: "gotham-waste-backend",
    health: "/health",
    bins: "/api/bins",
    apiDocs: "/api-docs",
    openApiJson: "/openapi.json",
  });
});

app.use("/health", healthRoutes);
app.use("/api/bins", binRoutes);

module.exports = app;
