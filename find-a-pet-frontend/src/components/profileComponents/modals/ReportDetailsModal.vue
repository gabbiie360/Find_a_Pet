<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content animate__animated animate__fadeInUp">
      <h2>Detalles del Reporte</h2>
      <img :src="report.fotos[0]" v-if="report.fotos.length" class="image-preview" />

      <p><strong>Nombre:</strong> {{ report.nombre }}</p>
      <p><strong>Especie:</strong> {{ report.especie }}</p>
      <p><strong>Raza:</strong> {{ report.raza }}</p>
      <p><strong>Descripción:</strong> {{ report.descripcion }}</p>
      <p><strong>Ciudad:</strong> {{ report.ciudad }}</p>
      <p><strong>Tipo:</strong> {{ report.tipo }}</p>
      <p><strong>Recompensa:</strong> L {{ report.recompensa || 0 }}</p>

      <p v-if="report.ultimaUbicacion?.texto">
        <strong>Última ubicación:</strong> {{ report.ultimaUbicacion.texto }}
      </p>
      <p v-if="report.ultimaUbicacion?.coordinates?.length === 2">
        <strong>Coordenadas:</strong> {{ report.ultimaUbicacion.coordinates[1] }}, {{ report.ultimaUbicacion.coordinates[0] }}
      </p>
      <a
        v-if="report.ultimaUbicacion?.coordinates?.length === 2"
        :href="`https://www.google.com/maps?q=${report.ultimaUbicacion.coordinates[1]},${report.ultimaUbicacion.coordinates[0]}`"
        target="_blank"
        class="maps-link"
      >
        Ver en Google Maps
      </a>

      <div class="modal-actions">
        <button @click="$emit('close')" class="btn-primary">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ report: Object });
defineEmits(['close']);
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
}
.modal-content {
  background: #fff;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}
.image-preview {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  margin-bottom: 15px;
  border-radius: 10px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.btn-primary {
  background: #f7de8e;
  color: #8b7bab;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
.maps-link {
  display: inline-block;
  margin-top: 10px;
  color: #3366cc;
  text-decoration: underline;
}
</style>
