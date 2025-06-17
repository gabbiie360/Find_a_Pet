<template>
  <div class="auth-body">
    <div class="auth-container">
      <div class="auth-header">
        <img src="@/assets/logo.png" alt="Find a Pet Logo" class="logo" />
        <h2>Restablecer contraseña</h2>
        <p>Ingresa tu nueva contraseña para continuar.</p>
      </div>

      <form @submit.prevent="handleReset" class="auth-form">
        <div v-if="message" class="success-message">{{ message }}</div>
        <div v-if="error" class="error-message">{{ error }}</div>

        <div class="form-group">
          <label>Nueva contraseña</label>
          <input type="password" v-model="password" required />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading">Restableciendo...</span>
          <span v-else>Actualizar contraseña</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const password = ref('');
const message = ref('');
const error = ref('');
const loading = ref(false);

const handleReset = async () => {
  loading.value = true;
  message.value = '';
  error.value = '';
  try {
    const token = route.params.token;
    const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password: password.value });
    message.value = response.data.msg;
    setTimeout(() => router.push('/login'), 2000);
  } catch (err) {
    error.value = err.response?.data?.msg || 'Error al restablecer la contraseña.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-body {
  font-family: 'Poppins', sans-serif;
  background-color: #f4f2f8;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem 1rem;
}

.auth-container {
  background-color: white;
  padding: 30px 35px;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.auth-header .logo {
  width: 60px;
  margin-bottom: 1rem;
}

.auth-header h2 {
  font-size: 1.7rem;
  margin-bottom: 0.5rem;
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

.auth-form input {
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
</style>
