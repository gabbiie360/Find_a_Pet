<template>
  <section class="content-section">
    <div class="section-header">
      <h2>Mis Reportes Activos</h2>
      <button @click="$emit('openGenericReportModal')" class="btn-custom-primary">Crear Reporte</button>
    </div>

    <div v-if="activeReports.length > 0" class="reports-grid">
      <div v-for="reporte in activeReports" :key="reporte._id" class="report-card-active">
        <img
          :src="reporte.fotos[0] || placeholderImage"
          alt="Foto del reporte"
          class="pet-photo"
          @click="$emit('openImageViewer', reporte.fotos[0] || placeholderImage)"
        >
        <div class="pet-info">
          <h3>{{ reporte.nombre }} ({{ reporte.tipo }})</h3>
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
              style="margin-left: 10px; color: #3498db;"
            >
              Ver en Google Maps
            </a>
          </p>
        </div>

        <div class="pet-actions">
          <button @click="$emit('handleMarkAsFound', reporte._id)" class="btn-action found">Marcar como Encontrada</button>
          <!-- CÓDIGO NUEVO CON ICONOS -->
        <button @click="$emit('openEditReportModal', reporte)" class="btn-action edit" title="Editar reporte">
          <font-awesome-icon icon="fa-solid fa-pen-to-square" />
        </button>
        <button @click="$emit('deleteReport', reporte._id)" class="btn-action delete" title="Eliminar reporte">
          <font-awesome-icon icon="fa-solid fa-trash" />
        </button>
          <button @click="$emit('openQrModal', reporte._id)" class="btn-action qr">Ver QR</button>
          <button @click="$emit('openReportDetailsModal', reporte)" class="btn-action">Ver Detalles</button>
        </div>
      </div>
    </div>

    <div v-else class="no-content-message">
      <p>No tienes reportes activos en este momento.</p>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  activeReports: Array,
  placeholderImage: String
})

defineEmits([
  'openGenericReportModal',
  'openImageViewer',
  'openEditReportModal',
  'deleteReport',
  'openQrModal',
  'openReportDetailsModal',
  'handleMarkAsFound'
])

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('es-ES')
}
</script>
