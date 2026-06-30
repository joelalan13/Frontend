import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000' // Tu servidor de Node.js
});

export default api;