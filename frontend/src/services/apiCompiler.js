import axios from 'axios';

const API_COMPILER = axios.create({
  baseURL: import.meta.env.VITE_COMPILER_URL || 'http://localhost:5001',
});

export default API_COMPILER;