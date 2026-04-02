const serverless = require("serverless-http");
const app = require("./app");

// Serverless function entrypoint (AWS Lambda / compatible platforms).
module.exports.handler = serverless(app);
