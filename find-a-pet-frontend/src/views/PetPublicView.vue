<template>
  <div class="public-pet-body">
    <div v-if="loading" class="feedback-container">Cargando...</div>
    <div v-else-if="error" class="feedback-container">{{ error }}</div>
    <div v-else-if="mascota" class="pet-public-card">
      <img :src="mascota.fotos[0] || placeholderImage" alt="Foto de la mascota" class="pet-public-photo">
      <h1>¡Hola! Mi nombre es {{ mascota.nombre }}</h1>
      <div v-if="mascota.estado === 'perdida'" class="status-lost">
        <h2>¡ESTOY PERDIDO!</h2>
        <p>Me perdí el {{ new Date(mascota.fechaPerdida).toLocaleDateString() }}.</p>
        <p>Si me encontraste, por favor contacta a mi dueño.</p>
      </div>
      <div class="owner-info">
        <h3>Información de Contacto del Propietario</h3>
        <p><strong>Nombre:</strong> {{ mascota.propietarioId.nombre }}</p>
        <p><strong>Teléfono:</strong> <a :href="'tel:'+mascota.propietarioId.telefono">{{ mascota.propietarioId.telefono }}</a></p>
        <p><strong>Email:</strong> <a :href="'mailto:'+mascota.propietarioId.email">{{ mascota.propietarioId.email }}</a></p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import placeholderImage from '@/assets/placeholder-pet.png';

const route = useRoute();
const mascota = ref(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  const petId = route.params.id;
  try {
    const response = await axios.get(`http://localhost:5000/api/mascotas/${petId}/public`);
    mascota.value = response.data;
  } catch (err) {
    error.value = 'No se pudo encontrar la información de esta mascota.';
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped>
/* Estilos para la vista pública */
.public-pet-body { background-color: #F4F2F8; padding: 40px; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.pet-public-card { background: white; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); max-width: 500px; padding: 40px; text-align: center; }
.pet-public-photo { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 20px; border: 5px solid #b098d6; }
.status-lost { background: #ffebee; color: #c62828; padding: 20px; border-radius: 10px; margin: 20px 0; }
.owner-info { margin-top: 20px; text-align: left; }
</style>