<template>
  <div class="content-section">
    <div class="section-header">
      <h2>Mis Reportes Activos</h2>
      <button @click="$emit('openGenericReportModal')" class="btn-primary">Crear Reporte</button>
    </div>
    <div v-if="activeReports && activeReports.length > 0" class="reports-grid">
      <div v-for="reporte in activeReports" :key="reporte._id" class="report-card-active">
        <div class="pet-card-icons">
          <!-- El evento @click ahora llama a una función local que emite el evento al padre -->
          <button @click="$emit('openEditReportModal', reporte)" class="btn-icon edit" title="Editar">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button @click="$emit('deleteReport', reporte._id)" class="btn-icon delete" title="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <img 
          :src="reporte.fotos && reporte.fotos.length > 0 ? reporte.fotos[0] : placeholderImage" 
          alt="Foto de la mascota" 
          class="pet-photo"
          @click="$emit('openImageViewer', reporte.fotos[0])"
        />
        <div class="pet-info">
          <h3>{{ reporte.nombre || 'Sin Nombre' }} ({{ reporte.tipo }})</h3>
          
          <!-- Lógica condicional para mostrar la información correcta según el tipo de reporte -->
          <div v-if="reporte.tipo === 'perdida'">
            <p>Perdida desde: {{ formatDate(reporte.fechaPerdida) }}</p>
            <p v-if="reporte.ultimaUbicacion?.texto">Última vez vista en: {{ reporte.ultimaUbicacion.texto }} <a href="#" class="map-link">Ver Mapa</a></p>
          </div>
          <div v-else-if="reporte.tipo === 'adopcion'">
            <p>Buscando un hogar amoroso.</p>
            <p>Ubicación: {{ reporte.ciudad || 'No especificada' }}</p>
          </div>
          <div v-else-if="reporte.tipo === 'encontrada'">
             <p>Encontrada el {{ formatDate(reporte.fechaEncontrada) }}</p>
             <p>Ubicación donde fue encontrada: {{ reporte.ciudad || 'No especificada' }}</p>
          </div>
        </div>
        <div class="pet-actions">
           <!-- ========================================================== -->
           <!-- BOTÓN CORREGIDO: Llama al método que emite el evento       -->
           <!-- ========================================================== -->
           <button 
             v-if="reporte.tipo === 'perdida'" 
             @click="onMarkAsFoundClick(reporte)" 
             class="btn-action found"
           >
             Marcar como Encontrada
           </button>
           <button @click="$emit('openQrModal', reporte.mascotaOriginalId || reporte._id)" class="btn-action qr">Ver QR</button>
           <button @click="$emit('openReportDetailsModal', reporte)" class="btn-action">Ver Detalles</button>
        </div>
      </div>
    </div>
    <div v-else class="no-content-message">
      No tienes reportes activos en este momento.
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Definimos las props que este componente recibe del padre
const props = defineProps({
  activeReports: {
    type: Array,
    required: true
  },
  placeholderImage: {
    type: String,
    required: true
  }
});

// Definimos los eventos que este componente puede emitir hacia el padre
const emit = defineEmits([
  'openGenericReportModal', 
  'openEditReportModal', 
  'deleteReport', 
  'openImageViewer', 
  'openQrModal', 
  'openReportDetailsModal',
  'handleMarkAsFound' // <-- El evento clave
]);

// Función para formatear la fecha
const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

// =================================================================
// MÉTODO QUE EMITE EL EVENTO AL PADRE
// =================================================================
// Esta función se llama cuando se hace clic en el botón.
// Su única tarea es emitir el evento 'handleMarkAsFound' y pasar
// el objeto completo del reporte al componente padre (ProfileView).
const onMarkAsFoundClick = (reporte) => {
  emit('handleMarkAsFound', reporte);
};
</script>

<style scoped>
/* Tus estilos aquí, no necesitan cambios */
.content-section { background-color: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); margin-bottom: 40px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #F4F2F8; padding-bottom: 15px; }
/* ... el resto de tus estilos ... */
.map-link { color: #6c2ca4; text-decoration: none; font-weight: 500; }
.btn-action.found { border-color: #28a745; color: #28a745; font-weight: 600; }
</style>