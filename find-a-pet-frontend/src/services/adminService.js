// src/services/adminService.js
import apiClient from './api';

class AdminService {
  getStats() { return apiClient.get('/admin/stats'); }
  getUsers(searchTerm = '') { return apiClient.get('/admin/users', { params: { terminoBusqueda: searchTerm }});}
  getPets() { return apiClient.get('/admin/mascotas'); }
  deleteUser(userId) { return apiClient.delete(`/admin/users/${userId}`); }
  deletePet(petId) { return apiClient.delete(`/admin/mascotas/${petId}`); }
  createUser(userData) { return apiClient.post('/admin/users', userData); }
  updateUser(userId, userData) { return apiClient.put(`/admin/users/${userId}`, userData); }
  getPets(searchTerm = '') { return apiClient.get('/admin/mascotas', { params: { terminoBusqueda: searchTerm }});}
  createPet(petData) { return apiClient.post('/admin/mascotas', petData); }
  updatePet(petId, petData) { return apiClient.put(`/admin/mascotas/${petId}`, petData); }
  deletePet(petId) { return apiClient.delete(`/admin/mascotas/${petId}`); }
 getReports(term = '') {
  return apiClient.get('/admin/reports', {
    params: { search: term }
  });
}
deleteReport(id) {
  return apiClient.delete(`/admin/reports/${id}`);
}


}

export default new AdminService();