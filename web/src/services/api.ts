import axios from 'axios';

const api = axios.create({
  baseURL: 'http://seuipaqui:3333'
});

export default api;