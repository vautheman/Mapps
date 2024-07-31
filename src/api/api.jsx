import axios from 'axios';

const token = import.meta.env.VITE_STRAPI_TOKEN;

const api = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default api;