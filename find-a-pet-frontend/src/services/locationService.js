import apiClient from './api';

class LocationService {
  getDepartments() {
    return apiClient.get('/locations/departments');
  }

  getCities(department) {
    return apiClient.get(`/locations/cities/${department}`);
  }
}

export default new LocationService();
