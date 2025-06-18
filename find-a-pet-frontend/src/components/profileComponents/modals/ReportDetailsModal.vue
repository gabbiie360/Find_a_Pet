<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <!-- v-if="report" previene errores si el modal se renderiza antes de tener los datos -->
    <div v-if="report" class="modal-content animate__animated animate__fadeInUp">
      <h2>Detalles del Reporte</h2>
      
      <img 
        :src="report.fotos && report.fotos.length > 0 ? report.fotos[0] : placeholderImage" 
        class="report-image" 
        alt="Foto de la mascota"
      />

      <div class="details-grid">
        <p><strong>Nombre:</strong> {{ report.nombre }}</p>
        <p><strong>Tipo:</strong> <span class="report-status" :class="report.tipo">{{ formatStatus(report.tipo) }}</span></p>
        <p><strong>Especie:</strong> {{ report.especie }}</p>
        <p><strong>Raza:</strong> {{ report.raza || 'No especificada' }}</p>
        <p><strong>Ciudad:</strong> {{ report.ciudad }}</p>
        <p><strong>Recompensa:</strong> L. {{ report.recompensa || 0 }}</p>
      </div>

      <p class="description"><strong>Descripción:</strong> {{ report.descripcion }}</p>
      
      <div v-if="report.ultimaUbicacion && (report.ultimaUbicacion.texto || report.ultimaUbicacion.coordinates?.length)">
        <hr>
        <h3>Última Ubicación</h3>
        <p v-if="report.ultimaUbicacion.texto">{{ report.ultimaUbicacion.texto }}</p>
        <a
          v-if="report.ultimaUbicacion.coordinates?.length === 2"
          :href="`https://www.google.com/maps?q=${report.ultimaUbicacion.coordinates[1]},${report.ultimaUbicacion.coordinates[0]}`"
          target="_blank"
          class="maps-link"
        >
          <i class="fas fa-map-marker-alt"></i> Ver en Google Maps
        </a>
      </div>

      <!-- Sección de Contacto -->
      <div v-if="report.creadoPor" class="contact-section">
        <hr>
        <h3>Información de Contacto</h3>
        <div class="contact-info">
          <img :src="report.creadoPor.fotoPerfil || userPlaceholderImage" alt="Foto de perfil" class="contact-photo" />
          <div>
            <p><strong>Reportado por: {{ report.creadoPor.nombre }}</strong></p>
            <p><i class="fas fa-envelope"></i> {{ report.creadoPor.email }}</p>
            <p><i class="fas fa-phone"></i> {{ report.creadoPor.telefono }}</p>
          </div>
        </div>
      </div>
      
      <div class="modal-actions">
        <button @click="$emit('close')" class="btn-primary">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import placeholderImage from '@/assets/placeholder-pet.png';
import userPlaceholderImage from '@/assets/placeholder-user.png';

defineProps({ 
  report: {
    type: Object,
    // No lo hacemos requerido para evitar un warning si se muestra brevemente sin datos
    default: null, 
  }
});

defineEmits(['close']);

// Función helper para mostrar el estado de forma más amigable
const formatStatus = (status) => {
  const statusMap = {
    perdida: 'Perdida',
    encontrada: 'Encontrada',
    adopcion: 'En Adopción',
    resuelto: 'Resuelto'
  };
  return statusMap[status] || status;
};
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
}
.modal-content {
  background: #fff;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  text-align: left;
}
.report-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  margin-bottom: 20px;
  border-radius: 10px;
  background-color: #f0f0f0;
}
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 20px;
  margin-bottom: 15px;
}
.details-grid p { margin: 0; }
.description { margin-bottom: 20px; line-height: 1.6; }
hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 20px 0;
}
h2 {
  margin-top: 0;
  text-align: center;
  margin-bottom: 20px;
}
h3 {
  margin-bottom: 10px;
}
.maps-link {
  display: inline-flex;
  margin-top: 10px;
  color: #3366cc;
  text-decoration: none;
  font-weight: 500;
  align-items: center;
  gap: 8px;
}
.maps-link:hover {
  text-decoration: underline;
}
.contact-section { margin-top: 20px; }
.contact-info {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
}
.contact-photo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}
.contact-info p { margin: 2px 0; }
.contact-info i {
  margin-right: 8px;
  color: #9b59b6;
}

.report-status {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}
.report-status.perdida { background-color: #ffebee; color: #c62828; }
.report-status.encontrada { background-color: #e8f5e9; color: #2e7d32; }
.report-status.adopcion { background-color: #e3f2fd; color: #1565c0; }
.report-status.resuelto { background-color: #e0e0e0; color: #616161; }
.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.btn-primary {
  background: #9b59b6;
  color: white;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}
.btn-primary:hover {
  background: #8e44ad;
}
</style>