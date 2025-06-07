<template>
  <div class="login-body">
    <div class="login-container">
      <div class="login-header">
        <!-- Asumo que tienes tu logo en src/assets. Ajusta la ruta si es necesario. -->
        <img src="@/assets/logo.png" alt="Find a Pet Logo" class="logo"> 
        <h2>Welcome Back!</h2>
        <p>Please enter your details to sign in.</p>
      </div>
      
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Enter your email" required>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="Enter your password" required>
        </div>
        
        <div class="form-options">
          <a href="#" class="forgot-password">Forgot password?</a>
        </div>
        
        <button type="submit" class="btn-login">Sign In</button>
      </form>
      
      <div class="signup-link">
        <p>Don't have an account? <router-link to="/signup">Sign up for free</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Variables reactivas para los campos del formulario
const email = ref('');
const password = ref('');

// Función que se ejecutará al enviar el formulario
const handleLogin = () => {
  // Por ahora, solo mostraremos los datos en la consola.
  // Más adelante, aquí llamaremos al backend.
  console.log('Login attempt with:', {
    email: email.value,
    password: password.value
  });
  alert(`Login con: ${email.value}`);
  // Lógica para enviar al backend irá aquí...
};
</script>

<style scoped>
/* Usaremos los mismos estilos de antes, pero 'scoped' para que solo apliquen a este componente */
:root {
  /* Define las variables si no están globales, o impórtalas de un archivo CSS central */
  --primary-purple: #9B88C8;
  --light-purple-bg: #F4F2F8;
  --primary-yellow: #FFD93D;
  --dark-text: #333;
  --light-text: #777;
}

.login-body {
  font-family: 'Poppins', sans-serif; /* Asegúrate de importar esta fuente en tu index.html o App.vue */
  background-color: #F4F2F8;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Usar min-height para asegurar que cubre la pantalla */
  padding: 20px;
  box-sizing: border-box;
}

.login-container {
  background-color: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-header .logo {
  width: 200px;
  margin-bottom: 20px;
}

.login-header h2 {
  color: #333;
  font-size: 28px;
  margin-bottom: 10px;
}

.login-header p {
  color: #777;
  margin-bottom: 30px;
}

.login-form .form-group {
  text-align: left;
  margin-bottom: 20px;
}

.login-form label {
  display: block;
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
}

.login-form input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.login-form input:focus {
  outline: none;
  border-color: #9B88C8;
  box-shadow: 0 0 0 3px rgba(155, 136, 200, 0.2);
}

.form-options {
  text-align: right;
  margin-bottom: 25px;
}

.form-options .forgot-password {
  color: #9B88C8;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.btn-login {
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
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 217, 61, 0.4);
}

.signup-link {
  margin-top: 30px;
}

.signup-link p {
  color: #777;
}

.signup-link a {
  color: #9B88C8;
  font-weight: 600;
  text-decoration: none;
}
</style>