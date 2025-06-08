<template>
  <div class="auth-body">
    <!-- Contenedor que aplica la perspectiva para el efecto 3D -->
    <div class="flipper-container">
      <!-- El elemento que realmente gira -->
      <div class="card-flipper" :class="{ 'is-flipped': showRegister }">
        
        <!-- CARA FRONTAL: FORMULARIO DE LOGIN -->
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
                <input id="login-email" type="email" v-model="loginForm.email" placeholder="Enter your email" required>
              </div>
              
              <div class="form-group">
                <label for="login-password">Password</label>
                <input id="login-password" type="password" v-model="loginForm.password" placeholder="Enter your password" required>
              </div>
              
              <div class="form-options">
                <a href="#" class="forgot-password">Forgot password?</a>
              </div>
              
              <button type="submit" class="btn-primary" :disabled="loading">
                <span v-if="loading && !showRegister">Signing In...</span>
                <span v-else>Sign In</span>
              </button>
            </form>
            
            <div class="switch-link">
              <p>Don't have an account? <a href="#" @click.prevent="toggleCard">Sign up for free</a></p>
            </div>
          </div>
        </div>

        <!-- CARA TRASERA: FORMULARIO DE REGISTRO -->
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
                <input id="reg-nombre" type="text" v-model="registerForm.nombre" placeholder="Your full name" required>
              </div>

              <div class="form-group">
                <label for="reg-email">Email</label>
                <input id="reg-email" type="email" v-model="registerForm.email" placeholder="Your email address" required>
              </div>
              
               <div class="form-group">
                <label for="reg-telefono">Phone</label>
                <input id="reg-telefono" type="tel" v-model="registerForm.telefono" placeholder="Your phone number" required>
              </div>

              <div class="form-group">
                <label for="reg-ciudad">City</label>
                <input id="reg-ciudad" type="text" v-model="registerForm.ciudad" placeholder="Your city" required>
              </div>
              
              <div class="form-group">
                <label for="reg-password">Password</label>
                <input id="reg-password" type="password" v-model="registerForm.password" placeholder="Choose a strong password" required>
              </div>
              
              <button type="submit" class="btn-primary" :disabled="loading">
                 <span v-if="loading && showRegister">Signing Up...</span>
                <span v-else>Sign Up</span>
              </button>
            </form>
            
            <div class="switch-link">
              <p>Already have an account? <a href="#" @click.prevent="toggleCard">Sign In</a></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
// Importamos el servicio que creamos, es una mejor práctica
import AuthService from '@/services/authService';

// --- ESTADO GENERAL ---
const showRegister = ref(false); // Controla qué cara de la tarjeta se muestra
const loading = ref(false); // Para deshabilitar botones y mostrar feedback
const router = useRouter();

// --- LÓGICA DE LOGIN ---
const loginForm = reactive({ email: '', password: '' });
const loginError = ref('');

const handleLogin = async () => {
  loading.value = true;
  loginError.value = '';
  try {
    // Usamos el servicio para mantener el componente limpio
    const response = await AuthService.login(loginForm);
    // El backend devuelve un objeto con token y user. Lo guardamos todo.
    localStorage.setItem('user', JSON.stringify(response.data));
    // Redirige a la página principal o al perfil del usuario tras el login
    router.push('/perfil'); 
  } catch (error) {
    loginError.value = error.response?.data?.msg || 'Error: Could not sign in.';
  } finally {
    loading.value = false;
  }
};


// --- LÓGICA DE REGISTRO ---
const registerForm = reactive({ nombre: '', email: '', telefono: '', ciudad: '', password: '' });
const registerError = ref('');
const registerSuccess = ref('');

const handleRegister = async () => {
  loading.value = true;
  registerError.value = '';
  registerSuccess.value = '';
  try {
    const response = await AuthService.register(registerForm);
    registerSuccess.value = response.data.msg + " Please sign in.";
    
    // Voltea automáticamente a la tarjeta de login tras un registro exitoso
    setTimeout(() => {
      toggleCard();
    }, 2500);

  } catch (error) {
    registerError.value = error.response?.data?.msg || 'Error: Could not register user.';
  } finally {
    loading.value = false;
  }
};


// --- FUNCIÓN PARA VOLTEAR LA TARJETA ---
const toggleCard = () => {
  showRegister.value = !showRegister.value;
  // Limpiar errores y formularios al cambiar para una mejor UX
  loginError.value = '';
  registerError.value = '';
  registerSuccess.value = '';
  Object.assign(loginForm, { email: '', password: '' });
  Object.assign(registerForm, { nombre: '', email: '', telefono: '', ciudad: '', password: '' });
};
</script>

<style scoped>
/* Estilos base del cuerpo */
.auth-body {
  font-family: 'Poppins', sans-serif; /* O una fuente similar a tu diseño */
  background-color: #F4F2F8; /* El color de fondo de tu imagen */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px); /* Resta la altura de tu navbar si es fija */
  padding: 2rem 0;
}

/* Contenedor para la perspectiva 3D */
.flipper-container {
  width: 100%;
  max-width: 420px;
  perspective: 1200px;
}

/* El elemento que gira */
.card-flipper {
  position: relative;
  width: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  min-height: 720px; /* Altura suficiente para el formulario de registro */
}

/* Clase que activa el giro */
.card-flipper.is-flipped {
  transform: rotateY(180deg);
}

/* Estilo común para ambas caras */
.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* La cara trasera (registro) debe estar girada desde el inicio */
.card-face-back {
  transform: rotateY(180deg);
}

/* El contenedor blanco con el contenido */
.auth-container {
  background-color: white;
  padding: 30px 40px;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  width: 100%;
  text-align: center;
  box-sizing: border-box;
}

.auth-header .logo {
  width: 60px; /* Tamaño del logo dentro de la tarjeta */
  margin-bottom: 1rem;
}

.auth-header h2 {
  color: #333;
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.auth-header p {
  color: #777;
  margin-bottom: 2rem;
}

.auth-form .form-group {
  text-align: left;
  margin-bottom: 1rem;
}

.auth-form label {
  display: block;
  color: #333;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.auth-form input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.auth-form input:focus {
  outline: none;
  border-color: #9B88C8; /* Un tono púrpura de tu navbar */
  box-shadow: 0 0 0 3px rgba(155, 136, 200, 0.2);
}

.form-options {
  text-align: right;
  margin-bottom: 1.5rem;
}

.form-options .forgot-password {
  color: #9B88C8;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background-color: #FFD93D; /* El amarillo de tu diseño */
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 217, 61, 0.4);
}

.btn-primary:disabled {
  background-color: #E0E0E0;
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

.switch-link {
  margin-top: 1.5rem;
}

.switch-link p {
  color: #777;
  font-size: 0.9rem;
}

.switch-link a {
  color: #9B88C8;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

/* Mensajes de feedback */
.error-message, .success-message {
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
}
.error-message {
  background-color: #f8d7da;
  color: #721c24;
}
.success-message {
  background-color: #d4edda;
  color: #155724;
}
</style>