/**
 * Vercel serverless entry — all HTTP traffic is routed here via vercel.json.
 */
require("../src/config/env");
const app = require("../src/app");

module.exports = app;
