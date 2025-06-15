<template>
  <div class="contact-wrapper">
    <div class="contact-grid">
      
      <!-- FORMULARIO -->
      <div class="contact-form-container">
        <img src="@/assets/logo.png" alt="Logo" class="contact-logo" />
        <h2>Contáctanos</h2>
        <p>¿Tienes preguntas o sugerencias? ¡Escríbenos!</p>

        <form class="contact-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">Nombre</label>
            <input v-model="form.name" type="text" id="name" required />
          </div>

          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input v-model="form.email" type="email" id="email" required />
          </div>

          <div class="form-group">
            <label for="message">Mensaje</label>
            <textarea v-model="form.message" id="message" rows="4" required></textarea>
          </div>

          <button type="submit" class="btn-send">Enviar mensaje</button>
        </form>
      </div>

      <!-- CARRUSEL -->
      <div class="carousel-container">
        <img :src="images[current]" alt="Imagen contacto" class="carousel-image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';

const form = reactive({
  name: '',
  email: '',
  message: ''
});

import axios from 'axios';

const handleSubmit = async () => {
  try {
    await axios.post('http://localhost:5000/api/contact/', form);
    alert('Gracias por contactarnos 😊');
    form.name = '';
    form.email = '';
    form.message = '';
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    alert('Hubo un problema al enviar el mensaje.');
  }
};


const images = [
  'src/assets/images/contact1.jpg',
  'src/assets/images/contact2.jpg',
  'src/assets/images/contact3.jpg',
  'src/assets/images/contact4.jpg',
  'src/assets/images/contact5.jpg'
];
const current = ref(0);

onMounted(() => {
  setInterval(() => {
    current.value = (current.value + 1) % images.length;
  }, 3000);
});
</script>

<style scoped>
.contact-wrapper {
  background-color: #f4f2f8;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.contact-grid {
  display: flex;
  flex-wrap: wrap;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  max-width: 1100px;
  width: 100%;
  overflow: hidden;
}

.contact-form-container {
  flex: 1 1 50%;
  padding: 2rem;
  box-sizing: border-box;
}

.contact-logo {
  width: 60px;
  margin-bottom: 1rem;
}

.contact-form-container h2 {
  font-size: 1.7rem;
  color: #4a3b64;
}

.contact-form-container p {
  margin-bottom: 1.5rem;
  color: #666;
}

.contact-form .form-group {
  margin-bottom: 1rem;
}

.contact-form label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 500;
  color: #333;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.btn-send {
  margin-top: 1rem;
  background-color: #FFD93D;
  color: #333;
  padding: 12px;
  width: 100%;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.carousel-container {
  flex: 1 1 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  aspect-ratio: 4 / 3;
  border-radius: 0 20px 20px 0;
}
@media (max-width: 768px) {
  .contact-grid {
    flex-direction: column;
  }
  .carousel-image {
    border-radius: 0 0 20px 20px;
  }
}
</style>
