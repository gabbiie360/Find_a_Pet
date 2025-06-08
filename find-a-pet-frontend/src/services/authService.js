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
}

export default new AuthService();