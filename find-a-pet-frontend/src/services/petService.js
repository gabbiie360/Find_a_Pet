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

  reportAsLost(petId, reportData) {
    return apiClient.put(`/mascotas/${petId}/reportar`, reportData);
  }

  markAsFound(petId) {
    return apiClient.put(`/mascotas/${petId}/encontrada`);
  }
  
  getPetQrCode(petId) {
    return apiClient.get(`/mascotas/${petId}/qr`);
  }

  // La subida de imágenes es un caso especial porque usa FormData
  uploadPetImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    // Hacemos la petición a la URL completa y dejamos que axios ponga el Content-Type
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default new PetService();