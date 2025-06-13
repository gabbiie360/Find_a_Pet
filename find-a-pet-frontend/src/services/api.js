import axios from 'axios';
import { authStore } from '@/store/authStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // URL base de toda tu API
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Usamos un "interceptor" de Axios.
// Este código se ejecuta ANTES de que cada petición sea enviada.
apiClient.interceptors.request.use(
  (config) => {
    const user = authStore.user;
    if (user && user.token) {
      // Si hay un token, lo añade a la cabecera de la petición
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;