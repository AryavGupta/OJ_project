// backend/services/apiCompiler.js
const axios = require("axios");

const API_COMPILER = axios.create({
  baseURL: process.env.COMPILER_SERVICE_URL || "http://localhost:5001", // Default to localhost for local dev
  timeout: 10000,
});

module.exports = API_COMPILER;