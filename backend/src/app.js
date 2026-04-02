require("./config/env");
const express = require("express");
const cors = require("cors");
const binRoutes = require("./routes/binRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    service: "gotham-waste-backend",
    health: "/health",
    bins: "/api/bins",
  });
});

app.use("/health", healthRoutes);
app.use("/api/bins", binRoutes);

module.exports = app;
