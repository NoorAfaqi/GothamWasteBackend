/**
 * Legacy serverless entry (e.g. AWS). Vercel auto-detects src/app.js — no config needed.
 */
require("./config/env");
module.exports = require("./app");
