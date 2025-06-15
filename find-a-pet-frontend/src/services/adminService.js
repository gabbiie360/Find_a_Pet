// src/services/adminService.js
import apiClient from './api';

class AdminService {
  getStats() { return apiClient.get('/admin/stats'); }
  getUsers() { return apiClient.get('/admin/users'); }
  getPets() { return apiClient.get('/admin/mascotas'); }
  deleteUser(userId) { return apiClient.delete(`/admin/users/${userId}`); }
  deletePet(petId) { return apiClient.delete(`/admin/mascotas/${petId}`); }
}

export default new AdminService();