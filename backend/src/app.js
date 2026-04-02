require("./config/env");
const express = require("express");
const cors = require("cors");
const binRoutes = require("./routes/binRoutes");
const healthRoutes = require("./routes/healthRoutes");
const docsRoutes = require("./routes/docsRoutes");
const openApiSpec = require("./docs/openapi");

const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/openapi.json", (req, res) => {
  res.json(openApiSpec);
});

app.use("/api-docs", docsRoutes);

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
