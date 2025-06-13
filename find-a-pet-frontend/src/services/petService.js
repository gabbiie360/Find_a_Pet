// src/services/petService.js
import axios from 'axios';
import { authStore } from '@/store/authStore';

const PET_API_URL = 'http://localhost:5000/api/mascotas/';
const UPLOAD_API_URL = 'http://localhost:5000/api/upload/';

const getAuthHeaders = () => {
  const user = authStore.user;
  if (user && user.token) {
    return { 'Authorization': `Bearer ${user.token}` };
  }
  return {};
};

class PetService {
  getMyPets() { return axios.get(PET_API_URL, { headers: getAuthHeaders() }); }
  addPet(petData) { return axios.post(PET_API_URL, petData, { headers: getAuthHeaders() }); }
  
  // --- NUEVOS MÉTODOS ---
  updatePet(petId, petData) {
    return axios.put(`${PET_API_URL}${petId}`, petData, { headers: getAuthHeaders() });
  }

  reportAsLost(petId, reportData) {
    return axios.put(`${PET_API_URL}${petId}/reportar`, reportData, { headers: getAuthHeaders() });
  }

  uploadPetImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    // Para upload no necesitamos token, pero sí el Content-Type correcto que axios pone solo
    return axios.post(UPLOAD_API_URL, formData);
  }
}

export default new PetService();