import apiClient from './api';

class PetService {
  // --- CRUD para Mascotas/Reportes ---
  addPet(petData) { return apiClient.post('/mascotas', petData); }
  updatePet(petId, petData) { return apiClient.put(`/mascotas/${petId}`, petData); }
  deletePet(petId) { return apiClient.delete(`/mascotas/${petId}`); }

  // --- OBTENER DATOS ---
  getMyPets() { return apiClient.get('/mascotas/mine'); }
  getPetQrCode(petId) { return apiClient.get(`/mascotas/${petId}/qr`); }

  // --- SUBIDA DE IMAGEN ---
  uploadPetImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    return apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}
export default new PetService();