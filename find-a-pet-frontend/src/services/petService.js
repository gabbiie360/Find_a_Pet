// src/services/petService.js
import axios from 'axios';
import { authStore } from '@/store/authStore';

const API_URL = 'http://localhost:5000/api/mascotas/';

const getAuthHeaders = () => {
  const user = authStore.user;
  if (user && user.token) {
    return { 'Authorization': `Bearer ${user.token}` };
  }
  return {};
};

class PetService {
  // Obtener todas las mascotas del usuario logueado
  getMyPets() {
    return axios.get(API_URL, { headers: getAuthHeaders() });
  }

  // Añadir una nueva mascota
  addPet(petData) {
    return axios.post(API_URL, petData, { headers: getAuthHeaders() });
  }

  // Reportar una mascota como perdida
  reportAsLost(petId, reportData) {
    return axios.put(`${API_URL}${petId}/reportar`, reportData, { headers: getAuthHeaders() });
  }
}

export default new PetService();