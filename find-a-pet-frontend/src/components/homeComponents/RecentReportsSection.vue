<template>
  <section class="recent-reports-section">
    <div class="container">
      <h2 class="section-title" v-fade-in-on-scroll>Últimos Reportes</h2>
      <p class="section-subtitle" v-fade-in-on-scroll>Conocé las mascotas reportadas recientemente y ayudá a encontrarlas.</p>

      <div v-if="loading" class="loading-msg">Cargando reportes...</div>
      <!-- Mostramos el mensaje solo si no hay reportes Y NO hay error -->
      <div v-else-if="recentReports.length === 0 && !error" class="empty-msg">No hay reportes en los últimos 7 días.</div>
      <div v-else-if="error" class="empty-msg">{{ error }}</div>

      <div v-else class="reports-grid">
        <div v-for="reporte in recentReports" :key="reporte._id" class="report-card" v-fade-in-on-scroll>
          <img :src="reporte.fotos[0] || placeholderImage" alt="Mascota" class="report-image" />
          <div class="report-info">
            <h3>{{ reporte.nombre }}</h3>
            <p>{{ reporte.ciudad }}</p>
            <!-- Usamos updatedAt porque es la fecha de la última modificación (cuando se perdió) -->
            <p class="report-date">📅 {{ formatDate(reporte.updatedAt) }}</p>
            <router-link :to="`/pet/${reporte._id}`" class="btn-more">Ver más</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ReportService from '@/services/reportService'; // <-- CAMBIO IMPORTANTE: Usamos ReportService
import placeholderImage from '@/assets/placeholder-pet.png';

const allReports = ref([]);
const loading = ref(true);
const error = ref('');

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

onMounted(async () => {
  try {
    // Usamos la función correcta del servicio correcto para obtener TODOS los reportes
    const response = await ReportService.getAllPublicReports();
    allReports.value = response.data;
  } catch (err) {
    console.error('Error cargando reportes:', err);
    error.value = 'No se pudieron cargar los reportes.';
  } finally {
    loading.value = false;
  }
});

// Usamos una propiedad computada para filtrar los reportes en el frontend
const recentReports = computed(() => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return allReports.value
    // Filtramos por fecha de actualización (updatedAt es más fiable que fechaPerdida)
    .filter(report => new Date(report.updatedAt) >= sevenDaysAgo)
    // Mostramos solo los 5 más recientes
    .slice(0, 5);
});
</script>

<style scoped>
/* Tus estilos se mantienen, son excelentes */
.recent-reports-section { background-color: #fef8ff; padding: 4rem 1rem; text-align: center; }
.section-title { font-size: 2.2rem; color: #6c2ca4; margin-bottom: 0.5rem; }
.section-subtitle { font-size: 1.1rem; color: #555; margin-bottom: 2rem; }
.reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 2rem; margin-top: 2rem; }
.report-card { background: #fff; border-radius: 15px; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05); overflow: hidden; transition: 0.3s ease; }
.report-card:hover { transform: translateY(-5px); }
.report-image { width: 100%; height: 180px; object-fit: cover; }
.report-info { padding: 1rem; }
.report-info h3 { margin: 0; font-size: 1.3rem; color: #333; }
.report-info p { margin: 0.3rem 0; color: #777; }
.report-date { font-size: 0.9rem; }
.btn-more { display: inline-block; margin-top: 0.7rem; background-color: #b98bff; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.9rem; }
.loading-msg, .empty-msg { font-size: 1.1rem; color: #777; margin-top: 2rem; }
</style>