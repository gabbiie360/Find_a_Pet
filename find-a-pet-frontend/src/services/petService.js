// frontend/services/petService.js
import apiClient from './api'; // Importamos nuestro cliente de API centralizado

class PetService {
  getMyPets() {
    return apiClient.get('/mascotas');
  }

  addPet(petData) {
    return apiClient.post('/mascotas', petData);
  }

  updatePet(petId, petData) {
    return apiClient.put(`/mascotas/${petId}`, petData);
  }

  // --- MÉTODO NUEVO PARA ELIMINAR ---
  // Este método recibirá el ID de la mascota y hará la petición DELETE a la ruta que creamos.
  deletePet(petId) {
    return apiClient.delete(`/mascotas/${petId}`);
  }

  reportAsLost(petId, reportData) {
    return apiClient.put(`/mascotas/${petId}/reportar`, reportData);
  }

  markAsFound(petId) {
    return apiClient.put(`/mascotas/${petId}/encontrada`);
  }

  getPetQrCode(petId) {
    return apiClient.get(`/mascotas/${petId}/qr`);
  }

  getLostPets(filters) {
    return apiClient.get('/mascotas/perdidas', { params: filters });
  }

  uploadPetImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Obtener mascotas reportadas en los últimos 7 días
  getRecentReports() {
    return apiClient.get('/mascotas/recientes');
  }

  getPetsByStatus(status) {
    return apiClient.get('/mascotas', {
      params: { estado: status }
    });
  }

  // Nuevo: Obtener mascotas con filtros combinados (especie, ciudad, estado)
 getFilteredPets(filters) {
  return apiClient.get('/mascotas/filtradas', { params: filters });
}

}

export default new PetService();
