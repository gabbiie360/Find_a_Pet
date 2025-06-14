<template>
  <section class="recent-reports-section">
    <div class="container">
      <h2 class="section-title" v-fade-in-on-scroll>Últimos Reportes</h2>
      <p class="section-subtitle" v-fade-in-on-scroll>Conocé las mascotas reportadas recientemente y ayudá a encontrarlas.</p>

      <div v-if="loading" class="loading-msg">Cargando reportes...</div>
      <div v-else-if="reports.length === 0" class="empty-msg">No hay reportes en los últimos 7 días.</div>
      <div v-else class="reports-grid">
        <div v-for="reporte in reports" :key="reporte._id" class="report-card" v-fade-in-on-scroll>
          <img :src="reporte.fotos[0] || placeholderImage" alt="Mascota" class="report-image" />
          <div class="report-info">
            <h3>{{ reporte.nombre }}</h3>
            <p>{{ reporte.ciudad }}</p>
            <p class="report-date">📅 {{ formatDate(reporte.fechaPerdida) }}</p>
            <router-link :to="`/pet/${reporte._id}`" class="btn-more">Ver más</router-link>
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

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  try {
    const response = await PetService.getRecentReports() // <-- tu endpoint backend
    reports.value = response.data
  } catch (err) {
    console.error('Error cargando reportes recientes:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.recent-reports-section {
  background-color: #fef8ff;
  padding: 4rem 1rem;
  text-align: center;
}
.section-title {
  font-size: 2.2rem;
  color: #6c2ca4;
  margin-bottom: 0.5rem;
}
.section-subtitle {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2rem;
}
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}
.report-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: 0.3s ease;
}
.report-card:hover {
  transform: translateY(-5px);
}
.report-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.report-info {
  padding: 1rem;
}
.report-info h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #333;
}
.report-info p {
  margin: 0.3rem 0;
  color: #777;
}
.report-date {
  font-size: 0.9rem;
}
.btn-more {
  display: inline-block;
  margin-top: 0.7rem;
  background-color: #b98bff;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}
.loading-msg, .empty-msg {
  font-size: 1.1rem;
  color: #777;
  margin-top: 2rem;
}

/* animaciones si usás fade-in */
.before-visible {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease;
}
.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
