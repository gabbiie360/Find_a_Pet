// src/services/authService.js
import axios from 'axios';

// La URL base de tu API. Asegúrate de que el puerto coincida con tu backend.
const API_URL = 'http://localhost:5000/api/auth/';

class AuthService {
  // Envía los datos del formulario de login al backend
  login(userCredentials) {
    return axios.post(API_URL + 'login', {
      email: userCredentials.email,
      password: userCredentials.password
    });
  }

  // Envía los datos del formulario de registro al backend
  register(userData) {
    return axios.post(API_URL + 'register', {
        nombre: userData.nombre,
        email: userData.email,
        telefono: userData.telefono,
        ciudad: userData.ciudad,
        password: userData.password
    });
  }

  // Borra los datos del usuario del almacenamiento local para cerrar sesión
  logout() {
    localStorage.removeItem('user');
  }

  // Obtiene los datos del usuario guardados para saber si hay una sesión activa
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }


// --- NUEVO MÉTODO PARA OBTENER LOS DATOS DEL PERFIL ---
  getProfileData() {
    // Obtenemos los datos del usuario (que incluyen el token) desde localStorage
    const storedUser = this.getCurrentUser();
    if (storedUser && storedUser.token) {
      // Hacemos la petición GET y enviamos el token en la cabecera 'Authorization'
      return axios.get(API_URL + 'me', {
        headers: {
          'Authorization': `Bearer ${storedUser.token}`
        }
      });
    }
    // Si no hay usuario/token, rechazamos la promesa
    return Promise.reject('No user token found');
  }
}


export default new AuthService();