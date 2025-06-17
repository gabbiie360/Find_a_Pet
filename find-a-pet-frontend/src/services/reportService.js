import apiClient from './api';

class ReportService {
  // Obtiene los reportes del usuario logueado (mascotas que NO están 'en-casa')
  getMyReports() {
    return apiClient.get('/mascotas/my-reports');
  }

  // Obtiene TODOS los reportes públicos para la página /reports con filtros
  getAllPublicReports(filters = {}) {
    return apiClient.get('/mascotas/public', { params: filters });
  }

  // Obtiene los detalles de un reporte/mascota público por su ID
  getPublicReportById(reportId) {
    return apiClient.get(`/mascotas/${reportId}/public`);
  }
}
export default new ReportService();