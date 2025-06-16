<template>
  <section class="content-section">
    <div class="section-header">
      <h2>Mis Reportes Activos</h2>
      <button @click="$emit('openGenericReportModal')" class="btn-custom-primary">Crear Reporte</button>
    </div>

    <div v-if="activeReports.length > 0" class="reports-grid">
      <!-- Bucle principal que recorre cada reporte -->
      <div v-for="reporte in activeReports" :key="reporte._id" class="report-card-active">

        <!-- Grupo de Iconos para la esquina (esto se queda igual) -->
        <div class="pet-card-icons">
          <button @click="$emit('openEditReportModal', reporte)" class="btn-icon" title="Editar reporte">
            <font-awesome-icon icon="fa-solid fa-pen-to-square" />
          </button>
          <button @click="$emit('deleteReport', reporte._id)" class="btn-icon delete" title="Eliminar reporte">
            <font-awesome-icon icon="fa-solid fa-trash" />
          </button>
        </div>
        
        <!-- Imagen (esto se queda igual) -->
        <img
          :src="reporte.fotos && reporte.fotos.length > 0 ? reporte.fotos[0] : placeholderImage"
          alt="Foto del reporte"
          class="pet-photo"
          @click="$emit('openImageViewer', reporte.fotos && reporte.fotos.length > 0 ? reporte.fotos[0] : placeholderImage)"
        >

        <!-- Contenido de la tarjeta (aquí está la lógica condicional) -->
        <div class="pet-info">
          <h3>{{ reporte.nombre || 'Sin Nombre' }} ({{ reporte.tipo }})</h3>

          <!-- === CONTENIDO PARA MASCOTA PERDIDA === -->
          <template v-if="reporte.tipo === 'perdida'">
            <p class="pet-breed">
              <span v-if="reporte.fechaPerdida">Perdida desde: {{ formatDate(reporte.fechaPerdida) }}</span>
            </p>
            <p>
              Última vez vista en:
              <span v-if="reporte.ultimaUbicacion?.texto">{{ reporte.ultimaUbicacion.texto }}</span>
              <a
                v-if="reporte.ultimaUbicacion?.coordinates"
                :href="`https://www.google.com/maps?q=${reporte.ultimaUbicacion.coordinates[1]},${reporte.ultimaUbicacion.coordinates[0]}`"
                target="_blank"
                rel="noopener noreferrer"
                class="map-link"
              >
                Ver Mapa
              </a>
            </p>
          </template>

          <!-- === CONTENIDO PARA MASCOTA EN ADOPCIÓN === -->
          <template v-else-if="reporte.tipo === 'adopcion'">
            <p class="pet-breed">
              <span>Buscando un hogar amoroso.</span>
            </p>
            <p>
              Ubicación: {{ reporte.ciudad || 'No especificada' }}
            </p>
          </template>

          <!-- === CONTENIDO PARA MASCOTA ENCONTRADA (si lo usas en el futuro) === -->
          <template v-else-if="reporte.tipo === 'encontrada'">
            <p class="pet-breed">
              <span>Encontrada el {{ formatDate(reporte.fechaEncontrada) }}</span>
            </p>
            <p>
              Ubicación donde fue encontrada: {{ reporte.ciudad || 'No especificada' }}
            </p>
          </template>

        </div>

        <!-- Botones de acción (también con lógica condicional) -->
        <div class="pet-actions">
          <!-- Este botón SOLO aparece para mascotas perdidas -->
          <button v-if="reporte.tipo === 'perdida'" @click="$emit('handleMarkAsFound', reporte._id)" class="btn-action found">
            Marcar como Encontrada
          </button>
          
          <!-- Estos botones aparecen siempre -->
          <button @click="$emit('openQrModal', reporte._id)" class="btn-action qr">Ver QR</button>
          <button @click="$emit('openReportDetailsModal', reporte)" class="btn-action">Ver Detalles</button>
        </div>
      </div>
    </div>

    <!-- Mensaje si no hay reportes -->
    <div v-else class="no-content-message">
      <p>No tienes reportes activos en este momento.</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  activeReports: Array,
  placeholderImage: String
});

defineEmits([
  'openGenericReportModal',
  'openImageViewer',
  'openEditReportModal',
  'deleteReport',
  'openQrModal',
  'openReportDetailsModal',
  'handleMarkAsFound'
]);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es-ES');
};
</script>

<style scoped>
/* Añadido para el enlace del mapa */
.map-link {
  margin-left: 10px;
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}
.map-link:hover {
  text-decoration: underline;
}
</style>