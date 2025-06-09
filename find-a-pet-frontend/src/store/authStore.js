import { reactive } from 'vue';

// Este store es un objeto reactivo que compartirá el estado de autenticación en toda la app.
export const authStore = reactive({
  // Obtenemos el usuario de localStorage al iniciar. Si no existe, es null.
  user: JSON.parse(localStorage.getItem('user')),

  /**
   * Actualiza el estado del usuario después de un login exitoso.
   * @param {object} userData - El objeto de usuario que viene del backend.
   */
  login(userData) {
    this.user = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  },

  /**
   * Limpia el estado del usuario al cerrar sesión.
   */
  logout() {
    this.user = null;
    localStorage.removeItem('user');
  }
});