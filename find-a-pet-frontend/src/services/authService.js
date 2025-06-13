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

  /**
   * Obtiene los datos del perfil del usuario logueado.
   * El token se añade automáticamente gracias al interceptor de apiClient.
   */
  getProfileData() {
    return apiClient.get('/auth/me');
  }

  /**
   * Actualiza los datos del perfil del usuario logueado.
   * El token se añade automáticamente.
   */
  updateProfile(userData) {
    return apiClient.put('/auth/me', userData);
  }
}

export default new AuthService();