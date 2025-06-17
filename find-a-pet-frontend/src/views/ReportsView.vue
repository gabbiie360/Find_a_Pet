<template>
  <div class="reports-page">
    <div class="container">
      <div class="header-section">
        <h1>Explora los Reportes de Mascotas</h1>
        <p>Filtra por tipo de reporte, especie o ciudad para encontrar o ayudar a una mascota.</p>
      </div>

      <!-- Filtros de Búsqueda -->
      <div class="filter-bar">
        <input type="text" v-model="filters.ciudad" placeholder="Buscar por ciudad..." @input="fetchReports" class="filter-input">
        <select v-model="filters.especie" @change="fetchReports" class="filter-select">
          <option value="">Todas las especies</option>
          <option>Perro</option>
          <option>Gato</option>
          <!-- Agrega más especies aquí si lo necesitas -->
        </select>
        <select v-model="filters.estado" @change="fetchReports" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="perdida">Perdida</option>
          <option value="adopcion">Adopción</option>
          <option value="encontrada">Encontrada</option>
        </select>
      </div>

      <!-- Cuadrícula de Reportes -->
      <div v-if="loading" class="loading-message">Cargando reportes...</div>
      
      <div v-else-if="reports.length > 0" class="reports-grid">
        <div v-for="reporte in reports" :key="reporte._id" :class="['report-card', reporte.estado]">
           <img :src="reporte.fotos?.[0] || placeholderImage" class="pet-photo" />
           <div class="pet-info">
             <h3>{{ reporte.nombre }}</h3>
             <p class="pet-breed">{{ reporte.especie }} - {{ reporte.raza || 'No especificada' }}</p>
             <p class="pet-state">{{ reporte.estado.replace('-', ' ') }} en {{ reporte.ciudad }}</p>
           </div>
           <div class="pet-actions">
             <router-link :to="`/pet/${reporte._id}`" class="btn-custom-primary">Ver Más</router-link>
           </div>
        </div>
      </div>

      <div v-else class="no-results-message">
        <p>{{ error ? error : 'No se encontraron reportes con esos criterios.' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import ReportService from '@/services/reportService';
import placeholderImage from '@/assets/placeholder-pet.png';

const reports = ref([]);
const loading = ref(true);
const error = ref('');

const filters = reactive({
  ciudad: '',
  especie: '',
  estado: ''
});

// --- FUNCIÓN CORREGIDA ---
const fetchReports = async () => {
  loading.value = true;
  error.value = '';
  try {
    // Usamos la función correcta del servicio correcto
    const response = await ReportService.getAllPublicReports(filters);
    reports.value = response.data;
  } catch (err) {
    console.error("Error al cargar los reportes:", err);
    error.value = "No se pudieron cargar los reportes. Inténtalo más tarde."
  } finally {
    loading.value = false;
  }
};

// Carga inicial de reportes al montar el componente
onMounted(fetchReports);
</script>

<style scoped>
/* Estilos para que la página de reportes se vea increíble */
.reports-page {
  /* Añadimos un padding-top para dejar espacio para el navbar */
  padding-top: 120px; /* Ajusta este valor a la altura de tu navbar + un margen */
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 40px;
  background-color: #f9f9f9;
  min-height: 100vh; /* Cambiamos calc() a 100vh para que el padding funcione bien */
  box-sizing: border-box; /* Importante para que el padding no aumente el tamaño */
}
.container { max-width: 1200px; margin: 0 auto; }
.header-section { text-align: center; margin-bottom: 40px; }
.header-section h1 { font-weight: 700; }
.filter-bar { display: flex; flex-wrap: wrap; gap: 15px; background-color: white; padding: 20px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); margin-bottom: 40px; }
.filter-input, .filter-select { flex: 1 1 200px; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
.reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
.report-card { background-color: white; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; border-left: 5px solid #ccc; }
.report-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
.report-card.perdida { border-left-color: #ff6f00; }
.report-card.adopcion { border-left-color: #3f51b5; }
.report-card.encontrada { border-left-color: #4caf50; }
.pet-photo { width: 100%; height: 180px; object-fit: cover; }
.pet-info { padding: 15px; flex-grow: 1; text-align: left;}
.pet-info h3 { margin: 0 0 5px; }
.pet-breed { color: #666; font-size: 0.9rem; margin-bottom: 10px; }
.pet-state { font-weight: bold; text-transform: capitalize; margin-top: 10px; font-size: 0.95rem; }
.pet-actions { padding: 0 15px 15px; }
.pet-actions .btn-custom-primary { width: 100%; text-align: center; }
.no-results-message, .loading-message { text-align: center; padding: 50px; color: #666; font-size: 1.2rem; }
.no-results-message p { color: #c62828; }
</style>