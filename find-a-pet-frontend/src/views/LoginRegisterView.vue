<template>
  <div class="auth-body">
    <div class="flipper-container">
      <div class="card-flipper" :class="{ 'is-flipped': showRegister }">
        
        <!-- LOGIN -->
        <div class="card-face card-face-front">
          <div class="auth-container">
            <div class="auth-header">
              <img src="@/assets/logo.png" alt="Find a Pet Logo" class="logo">
              <h2>Welcome Back!</h2>
              <p>Please enter your details to sign in.</p>
            </div>

            <form class="auth-form" @submit.prevent="handleLogin">
              <div v-if="loginError" class="error-message">{{ loginError }}</div>

              <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="loginForm.email" required />
              </div>

              <div class="form-group">
                <label>Password</label>
                <input type="password" v-model="loginForm.password" required />
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

        <!-- REGISTRO -->
        <div class="card-face card-face-back">
          <div class="auth-container">
            <div class="auth-header">
              <img src="@/assets/logo.png" alt="Find a Pet Logo" class="logo">
              <h2>Create Account</h2>
              <p>Join our community to find your pet!</p>
            </div>

            <form class="auth-form" @submit.prevent="handleRegister">
              <div v-if="registerSuccess" class="success-message">{{ registerSuccess }}</div>
              <div v-if="registerError" class="error-message">{{ registerError }}</div>

              <div class="form-group">
                <label>Full Name</label>
                <input v-model="registerForm.nombre" required />
              </div>

              <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="registerForm.email" required />
              </div>

              <div class="form-group">
                <label>Phone</label>
                <input type="tel" v-model="registerForm.telefono" required />
              </div>

              <div class="form-group">
                <label>Country</label>
                <select v-model="registerForm.pais" required>
                  <option value="">Select country</option>
                  <option value="Honduras">Honduras</option>
                </select>
              </div>

              <div class="form-group">
                <label>Department</label>
                <select v-model="registerForm.departamento" required @change="loadCiudades">
                  <option value="">Select department</option>
                  <option v-for="(ciudades, depto) in departamentos" :key="depto" :value="depto">
                    {{ depto }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>City</label>
                <select v-model="registerForm.ciudad" required>
                  <option value="">Select city</option>
                  <option v-for="c in ciudadesDisponibles" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Password</label>
                <input type="password" v-model="registerForm.password" required />
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
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '@/services/authService';
import { authStore } from '@/store/authStore';

const showRegister = ref(false);
const loading = ref(false);
const router = useRouter();

const loginForm = reactive({ email: '', password: '' });
const loginError = ref('');

const registerForm = reactive({
  nombre: '',
  email: '',
  telefono: '',
  pais: '',
  departamento: '',
  ciudad: '',
  password: ''
});
const registerError = ref('');
const registerSuccess = ref('');

import { onMounted } from 'vue';
import axios from 'axios'; // Asegúrate de tener axios instalado

const departamentos = ref({});
const ciudadesDisponibles = computed(() => {
  return departamentos.value[registerForm.departamento] || [];
});

const loadDepartmentsFromDB = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/locations/Honduras');
    departamentos.value = response.data.departments;
  } catch (error) {
    console.error("Error al cargar departamentos:", error);
  }
};



onMounted(loadDepartmentsFromDB);


const toggleCard = () => {
  showRegister.value = !showRegister.value;
  loginError.value = '';
  registerError.value = '';
  registerSuccess.value = '';
  Object.assign(loginForm, { email: '', password: '' });
  Object.assign(registerForm, {
    nombre: '',
    email: '',
    telefono: '',
    pais: '',
    departamento: '',
    ciudad: '',
    password: ''
  });
};

const handleLogin = async () => {
  loading.value = true;
  loginError.value = '';
  try {
    const response = await AuthService.login(loginForm);
    authStore.login(response.data);
    router.push('/profileview');
  } catch (err) {
    loginError.value = err.response?.data?.msg || 'Error al iniciar sesión.';
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  loading.value = true;
  registerError.value = '';
  registerSuccess.value = '';
  try {
    const response = await AuthService.register(registerForm);
    registerSuccess.value = response.data.msg + ' Por favor, inicia sesión.';
    setTimeout(toggleCard, 2000);
  } catch (err) {
    registerError.value = err.response?.data?.msg || 'Error al registrar usuario.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-body {
  font-family: 'Poppins', sans-serif;
  background-color: #F4F2F8;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 80px);
  padding: 2rem 1rem;
}

.flipper-container {
  width: 100%;
  max-width: 450px;
  perspective: 1200px;
}

.card-flipper {
  position: relative;
  width: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  min-height: auto;
}

.card-flipper.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  backface-visibility: hidden;
  top: 0;
  left: 0;
}

.card-face-back {
  transform: rotateY(180deg);
}

.auth-container {
  background-color: white;
  padding: 30px 35px;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  text-align: center;
  min-height: 100%;
}

.auth-header .logo {
  width: 60px;
  margin-bottom: 1rem;
}

.auth-header h2 {
  font-size: 1.7rem;
  margin: 0 0 0.5rem;
}

.auth-header p {
  color: #666;
  margin-bottom: 1.5rem;
}

.auth-form .form-group {
  text-align: left;
  margin-bottom: 1rem;
}

.auth-form label {
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  display: block;
}

.auth-form input,
.auth-form select {
  width: 100%;
  padding: 10px 14px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
}

.btn-primary {
  margin-top: 1rem;
  background-color: #FFD93D;
  color: #333;
  padding: 14px;
  width: 100%;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.switch-link {
  margin-top: 1.5rem;
}

.switch-link a {
  color: #9B88C8;
  font-weight: bold;
  text-decoration: none;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 1rem;
}

@media (max-width: 480px) {
  .auth-container {
    padding: 25px 20px;
  }
}
</style>
