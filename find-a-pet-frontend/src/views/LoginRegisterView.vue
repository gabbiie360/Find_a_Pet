<template>
  <div class="auth-body">
    <!-- Contenedor que crea el efecto 3D -->
    <div class="card-flipper" :class="{ 'is-flipped': showRegister }">
      
      <!-- CARA FRONTAL: LOGIN -->
      <div class="card-face card-face-front">
        <div class="auth-container">
          <div class="auth-header">
            <img src="@/assets/logo.png" alt="Find a Pet Logo" class="logo">
            <h2>Welcome Back!</h2>
            <p>Please enter your details to sign in.</p>
          </div>

          <form class="auth-form" @submit.prevent="handleLogin">
            <!-- Mensaje de error para el Login -->
            <div v-if="loginError" class="error-message">{{ loginError }}</div>
            
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" v-model="loginForm.email" placeholder="Enter your email" required>
            </div>
            
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" v-model="loginForm.password" placeholder="Enter your password" required>
            </div>
            
            <div class="form-options">
              <a href="#" class="forgot-password">Forgot password?</a>
            </div>
            
            <button type="submit" class="btn-primary">Sign In</button>
          </form>
          
          <div class="switch-link">
            <p>Don't have an account? <a href="#" @click.prevent="toggleCard">Sign up for free</a></p>
          </div>
        </div>
      </div>

      <!-- CARA TRASERA: REGISTRO -->
      <div class="card-face card-face-back">
        <div class="auth-container">
          <div class="auth-header">
            <img src="@/assets/logo.png" alt="Find a Pet Logo" class="logo">
            <h2>Create Account</h2>
            <p>Join our community to find your pet!</p>
          </div>

          <form class="auth-form" @submit.prevent="handleRegister">
            <!-- Mensajes de éxito o error para el Registro -->
            <div v-if="registerSuccess" class="success-message">{{ registerSuccess }}</div>
            <div v-if="registerError" class="error-message">{{ registerError }}</div>

            <div class="form-group">
              <label for="reg-nombre">Full Name</label>
              <input type="text" id="reg-nombre" v-model="registerForm.nombre" placeholder="Your full name" required>
            </div>

            <div class="form-group">
              <label for="reg-email">Email</label>
              <input type="email" id="reg-email" v-model="registerForm.email" placeholder="Your email address" required>
            </div>
            
             <div class="form-group">
              <label for="reg-telefono">Phone</label>
              <input type="tel" id="reg-telefono" v-model="registerForm.telefono" placeholder="Your phone number" required>
            </div>

            <div class="form-group">
              <label for="reg-ciudad">City</label>
              <input type="text" id="reg-ciudad" v-model="registerForm.ciudad" placeholder="Your city" required>
            </div>
            
            <div class="form-group">
              <label for="reg-password">Password</label>
              <input type="password" id="reg-password" v-model="registerForm.password" placeholder="Choose a strong password" required>
            </div>
            
            <button type="submit" class="btn-primary">Sign Up</button>
          </form>
          
          <div class="switch-link">
            <p>Already have an account? <a href="#" @click.prevent="toggleCard">Sign In</a></p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// --- ESTADO GENERAL ---
const showRegister = ref(false); // Controla qué cara de la tarjeta se muestra
const router = useRouter();

// --- LÓGICA DE LOGIN ---
const loginForm = reactive({
  email: '',
  password: ''
});
const loginError = ref('');

const handleLogin = async () => {
  loginError.value = '';
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', loginForm);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    alert('¡Inicio de sesión exitoso!');
    router.push('/dashboard'); // Redirige a la página principal tras el login
  } catch (error) {
    loginError.value = error.response?.data?.msg || 'Error al iniciar sesión.';
  }
};


// --- LÓGICA DE REGISTRO ---
const registerForm = reactive({
  nombre: '',
  email: '',
  telefono: '',
  ciudad: '',
  password: ''
});
const registerError = ref('');
const registerSuccess = ref('');

const handleRegister = async () => {
  registerError.value = '';
  registerSuccess.value = '';
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', registerForm);
    registerSuccess.value = response.data.msg + " Por favor, inicia sesión.";
    
    // Opcional: Voltear automáticamente a la tarjeta de login tras un registro exitoso
    setTimeout(() => {
      showRegister.value = false;
    }, 2500);

  } catch (error) {
    registerError.value = error.response?.data?.msg || 'Error al registrar el usuario.';
  }
};


// --- FUNCIÓN PARA VOLTEAR LA TARJETA ---
const toggleCard = () => {
  showRegister.value = !showRegister.value;
  // Limpiar errores al cambiar de formulario
  loginError.value = '';
  registerError.value = '';
  registerSuccess.value = '';
};
</script>

<style scoped>
/* Estilos base del cuerpo */
.auth-body {
  font-family: 'Poppins', sans-serif;
  background-color: #F4F2F8;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  /* IMPORTANTE: Añadir perspectiva para el efecto 3D */
  perspective: 1000px;
}

/* El contenedor que se va a voltear */
.card-flipper {
  width: 100%;
  max-width: 420px;
  position: relative;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  min-height: 650px; /* Dale una altura fija para que no salte al girar */
}

/* Clase que se añade para activar el giro */
.card-flipper.is-flipped {
  transform: rotateY(180deg);
}

/* Estilo común para ambas caras de la tarjeta */
.card-face {
  position: absolute;
  top: 25%;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* Oculta la cara que está de espaldas */
  -webkit-backface-visibility: hidden; /* Para compatibilidad */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* La cara frontal (login) */
.card-face-front {
  /* No necesita rotación inicial */
}

/* La cara trasera (registro), girada 180 grados desde el inicio */
.card-face-back {
  transform: rotateY(180deg);
}

/* Contenedor principal del contenido (reemplaza a .login-container) */
.auth-container {
  background-color: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  text-align: center;
}

.auth-header .logo {
  width: 180px; /* Ajustado para más espacio */
  margin-bottom: 15px;
}

.auth-header h2 {
  color: #333;
  font-size: 26px;
  margin-bottom: 10px;
}

.auth-header p {
  color: #777;
  margin-bottom: 25px;
}

.auth-form .form-group {
  text-align: left;
  margin-bottom: 15px; /* Un poco menos de espacio para que quepa todo */
}

.auth-form label {
  display: block;
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.auth-form input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.auth-form input:focus {
  outline: none;
  border-color: #9B88C8;
  box-shadow: 0 0 0 3px rgba(155, 136, 200, 0.2);
}

.form-options {
  text-align: right;
  margin-bottom: 20px;
}

.form-options .forgot-password {
  color: #9B88C8;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.btn-primary {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 12px;
  background-color: #FFD93D;
  color: #4C4010;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 10px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 217, 61, 0.4);
}

.switch-link {
  margin-top: 25px;
}

.switch-link p {
  color: #777;
}

.switch-link a {
  color: #9B88C8;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

/* Estilos para mensajes de error y éxito */
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
}
</style>