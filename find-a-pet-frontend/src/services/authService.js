import apiClient from './api'; // Importamos nuestro cliente de API centralizado

class AuthService {
  /**
   * Envía los datos del formulario de login al backend.
   * No necesita token.
   */
  login(userCredentials) {
    return apiClient.post('/auth/login', userCredentials);
  }

  /**
   * Envía los datos del formulario de registro al backend.
   * No necesita token.
   */
  register(userData) {
    return apiClient.post('/auth/register', userData);
  }

 getProfileData() {
  return apiClient.get('/auth/profile');
}

updateProfile(userData) {
  return apiClient.put('/auth/profile', userData);
}

}

export default new AuthService();