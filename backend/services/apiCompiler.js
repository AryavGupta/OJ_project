// backend/utils/apiCompiler.js
const axios = require("axios");

const API_COMPILER = axios.create({
  baseURL: "http://localhost:5001", // 👈 change to env var in prod
  timeout: 10000, // optional
});

module.exports = API_COMPILER;
