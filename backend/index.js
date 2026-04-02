/**
 * Local / zero-config fallback: Vercel also detects index.js at project root.
 */
require("./src/config/env");
module.exports = require("./src/app");
