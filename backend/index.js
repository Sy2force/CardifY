// Entry point for production deployment
// This file imports and starts the compiled TypeScript server

const app = require('./dist/server.js').default;

// The server is already started in server.js, so we just need to export the app
module.exports = app;
