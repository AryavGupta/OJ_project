// apiCompiler.js
import axios from 'axios';

const API_COMPILER = axios.create({
  baseURL: 'http://localhost:5001', // move to env later if needed
});

export default API_COMPILER;
