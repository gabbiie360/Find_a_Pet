<template>
  <div class="reports-view-container">
    <div class="container">
      <h1 class="page-title">Explora los Reportes de Mascotas</h1>
      <p class="page-subtitle">Filtra por tipo de reporte, especie o ciudad para encontrar o ayudar a una mascota.</p>

      <!-- Panel de Filtros -->
      <div class="filter-panel">
        <input v-model="filters.ciudad" type="text" placeholder="Buscar por ciudad..." @keyup.enter="applyFilters" />
        <select v-model="filters.especie">
          <option value="">Todas las especies</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
          <option value="Otro">Otro</option>
        </select>
        <select v-model="filters.tipo">
          <option value="">Todos los estados</option>
          <option value="perdida">Perdida</option>
          <option value="encontrada">Encontrada</option>
          <option value="adopcion">En Adopción</option>
        </select>
        <button @click="applyFilters" class="btn-search">Buscar</button>
      </div>

      <!-- Resultados de la Búsqueda -->
      <div v-if="loading" class="feedback-msg">Cargando reportes...</div>
      <div v-else-if="reports.length === 0" class="feedback-msg">No se encontraron reportes con esos criterios.</div>
      <div v-else class="reports-grid">
        <!-- Iteramos sobre los reportes obtenidos del servicio -->
        <div v-for="reporte in reports" :key="reporte._id" class="report-card">
          <img :src="reporte.fotos[0] || placeholderImage" alt="Foto de la mascota" class="report-image" />
          <div class="report-info">
            <h3>{{ reporte.nombre }}</h3>
            <p>{{ reporte.especie }} - {{ reporte.raza || 'Mestizo' }}</p>
            <p class="report-status" :class="reporte.tipo">{{ reporte.tipo.replace('perdida', 'Mascota Perdida').replace('encontrada', 'Mascota Encontrada') }}</p>
            <button @click="openDetailsModal(reporte._id)" class="btn-more">Ver Más</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ReportDetailsModal 
  v-if="showDetailsModal" 
  :report="selectedReport" 
  @close="closeDetailsModal" 
/>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import ReportService from '@/services/reportService';
import placeholderImage from '@/assets/placeholder-pet.png';
import ReportDetailsModal from '@/components/profileComponents/modals/ReportDetailsModal.vue';
const reports = ref([]);
const loading = ref(true);

const showDetailsModal = ref(false);
const selectedReport = ref(null);

// Objeto reactivo para manejar los filtros
const filters = reactive({
  ciudad: '',
  especie: '',
  tipo: ''
});

const openDetailsModal = async (reportId) => {
  if (!reportId) return;
  
  // 1. Mostramos el modal inmediatamente pero sin datos
  selectedReport.value = null; // Aseguramos que no haya datos viejos
  showDetailsModal.value = true;
  
  try {
    const response = await ReportService.getReportDetails(reportId);
    // 2. Una vez que tenemos los datos, los asignamos.
    //    El modal se actualizará automáticamente.
    selectedReport.value = response.data;
  } catch (error) {
    console.error("No se pudieron cargar los detalles del reporte:", error);
    // 3. Si falla, cerramos el modal y mostramos una alerta
    closeDetailsModal();
    alert("Error al cargar los detalles del reporte.");
  }
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedReport.value = null;
};

// Función para buscar y cargar los reportes
const fetchReports = async () => {
  loading.value = true;
  try {
    // Creamos un objeto de filtros limpios, sin valores vacíos
    const cleanFilters = {};
    if (filters.ciudad) cleanFilters.ciudad = filters.ciudad;
    if (filters.especie) cleanFilters.especie = filters.especie;
    if (filters.tipo) cleanFilters.tipo = filters.tipo;

    // Llamamos al servicio con los filtros
    const response = await ReportService.getAllReports(cleanFilters);
    reports.value = response.data;
  } catch (error) {
    console.error("Error al cargar los reportes públicos:", error);
  } finally {
    loading.value = false;
  }
};

// Se ejecuta al hacer clic en el botón "Buscar"
const applyFilters = () => {
  fetchReports();
};

// Carga inicial de todos los reportes cuando el componente se monta
onMounted(fetchReports);
</script>

<style scoped>
.reports-view-container {
  padding: 120px 2rem 4rem 2rem;
  background-color: #f8f7fc;
  min-height: 100vh;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
}
.page-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}
.filter-panel {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  margin-bottom: 2.5rem;
}
.filter-panel input, .filter-panel select {
  flex-grow: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.btn-search {
  padding: 0.8rem 1.5rem;
  border: none;
  background-color: #ffd700; /* Amarillo/Dorado */
  color: #333;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
}
.feedback-msg {
  text-align: center;
  padding: 2rem;
  color: #777;
}
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.report-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.07);
}
.report-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.report-info {
  padding: 1rem;
}
.report-info h3 {
  margin: 0 0 0.5rem 0;
}
.report-status {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 0.5rem;
  text-transform: capitalize;
}
.report-status.perdida { background-color: #ffebee; color: #c62828; }
.report-status.encontrada { background-color: #e8f5e9; color: #2e7d32; }
.report-status.adopcion { background-color: #e3f2fd; color: #1565c0; }
.btn-more {
  display: block;
  margin-top: 1rem;
  text-align: center;
  padding: 0.7rem;
  background-color: #9b59b6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
}
</style>