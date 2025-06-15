// src/services/adminService.js
import apiClient from './api';

class AdminService {
  getStats() { return apiClient.get('/admin/stats'); }
  getUsers() { return apiClient.get('/admin/users'); }
  getPets() { return apiClient.get('/admin/mascotas'); }
  deleteUser(userId) { return apiClient.delete(`/admin/users/${userId}`); }
  deletePet(petId) { return apiClient.delete(`/admin/mascotas/${petId}`); }
  createUser(userData) { return apiClient.post('/admin/users', userData); }
   updateUser(userId, userData) { return apiClient.put(`/admin/users/${userId}`, userData); }
}

export default new AdminService();