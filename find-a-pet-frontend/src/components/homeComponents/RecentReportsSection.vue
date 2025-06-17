<template>
  <section class="recent-reports-section">
    <div class="container">
      <h2 class="section-title" v-fade-in-on-scroll>Últimos Reportes</h2>
      <p class="section-subtitle" v-fade-in-on-scroll>Conocé las mascotas reportadas recientemente y ayudá a encontrarlas.</p>

      <div v-if="loading" class="loading-msg">Cargando reportes...</div>
      <div v-else-if="reports.length === 0" class="empty-msg">No hay reportes de mascotas perdidas en los últimos 7 días.</div>
      
      <!-- Bloque corregido para mostrar los reportes -->
      <div v-else class="reports-grid">
        <div v-for="reporte in reports" :key="reporte._id" class="report-card" v-fade-in-on-scroll>
          <!-- Usamos la primera foto del reporte, o la imagen de placeholder -->
          <img :src="reporte.fotos[0] || placeholderImage" alt="Foto de la mascota" class="report-image" />
          <div class="report-info">
            <h3>{{ reporte.nombre }}</h3>
            <p>{{ reporte.ciudad }}</p>
            <!-- Mostramos la fecha de creación del reporte, que es más precisa -->
            <p class="report-date">📅 Reportado el {{ formatDate(reporte.createdAt) }}</p>
            <!-- El enlace ahora lleva a la página de búsqueda para una mejor UX -->
            <router-link to="/buscar-mascotas" class="btn-more">Ver Detalles</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PetService from '@/services/petService'
import placeholderImage from '@/assets/placeholder-pet.png'

const reports = ref([])
const loading = ref(true)

// Función para formatear la fecha, sigue siendo útil
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

onMounted(async () => {
  try {
    // La llamada al servicio sigue siendo la misma
    const response = await PetService.getRecentReports();
    reports.value = response.data;
  } catch (err) {
    console.error('Error cargando reportes recientes:', err);
    // Opcional: podrías mostrar un mensaje de error en la UI
  } finally {
    loading.value = false;
  }
})
</script>

<style scoped>
.recent-reports-section {
  background-color: #f8f7fc; /* Un tono lila muy claro */
  padding: 4rem 1rem;
  text-align: center;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.section-title {
  font-size: 2.2rem;
  color: #6c2ca4;
  margin-bottom: 0.5rem;
}
.section-subtitle {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 3rem; /* Más espacio */
}
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  text-align: left; /* Alinea el texto de las tarjetas a la izquierda */
}
.report-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(108, 44, 164, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #eee;
}
.report-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(108, 44, 164, 0.12);
}
.report-image {
  width: 100%;
  height: 200px; /* Un poco más de altura para la imagen */
  object-fit: cover;
  background-color: #e0e0e0;
}
.report-info {
  padding: 1.2rem;
}
.report-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.4rem;
  color: #333;
}
.report-info p {
  margin: 0.3rem 0;
  color: #777;
  font-size: 1rem;
}
.report-date {
  font-size: 0.85rem;
  color: #6c2ca4; /* Color temático */
  font-weight: 500;
}
.btn-more {
  display: inline-block;
  margin-top: 1rem;
  background-color: #b98bff;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}
.btn-more:hover {
  background-color: #a36efd;
}
.loading-msg, .empty-msg {
  font-size: 1.1rem;
  color: #777;
  margin-top: 2rem;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  border: 1px dashed #ddd;
}

/* Directiva de animación (si la estás usando) */
[v-fade-in-on-scroll] {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
[v-fade-in-on-scroll].is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>