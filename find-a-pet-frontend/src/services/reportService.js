// frontend/services/reportService.js
import apiClient from './api';

class ReportService {
  // Crear reporte simple sin imagen (usado en ProfileView.vue)
  createGenericReport(reportData) {
    return apiClient.post('/reports', reportData);
  }

  // Crear reporte con imagen (formulario con imagen subida)
  createReportWithImage(formData) {
    return apiClient.post('/reports/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  // Obtener todos los reportes públicos
  getAllReports() {
    return apiClient.get('/reports');
  }

  // Obtener los reportes del usuario logueado
  getMyReports() {
    return apiClient.get('/reports/mine');
  }

  // Actualizar reporte existente
  updateReport(reportId, data) {
    return apiClient.put(`/reports/${reportId}`, data);
  }

  // Eliminar reporte
  deleteReport(reportId) {
    return apiClient.delete(`/reports/${reportId}`);
  }
}

export default new ReportService();
