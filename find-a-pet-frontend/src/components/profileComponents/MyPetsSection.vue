<template>
  <section class="content-section">
    <div class="section-header">
      <h2>Mis Mascotas</h2>
      <button @click="$emit('openPetModal', null)" class="btn-custom-primary">Registrar Mascota</button>
    </div>
    <div v-if="mascotas.length > 0" class="pets-grid">
      <div v-for="mascota in mascotas" :key="mascota._id" class="pet-card">
        <img
          :src="mascota.fotos[0] || placeholderImage"
          alt="Foto de la mascota"
          class="pet-photo"
          @click="$emit('openImageViewer', mascota.fotos[0] || placeholderImage)"
        >
        <div class="pet-info">
          <h3>{{ mascota.nombre }}</h3>
          <p class="pet-breed">{{ mascota.especie }} - {{ mascota.raza || 'No especificada' }}</p>
          <p class="pet-description">{{ mascota.descripcion }}</p>
        </div>
        <div class="pet-actions">
          <button @click="$emit('openPetModal', mascota)" class="btn-action edit">Editar</button>
          <button
            v-if="mascota.estado === 'en casa'"
            @click="$emit('openReportModal', mascota)"
            class="btn-action report"
          >
            Reportar Perdida
          </button>
          <button @click="$emit('openQrModal', mascota._id)" class="btn-action qr">Ver QR</button>
          <button @click="$emit('openReportDetailsModal', mascota)" class="btn-action">Ver Detalles</button>
        </div>
        <span class="pet-status" :class="mascota.estado.replace(' ', '-')">{{ mascota.estado }}</span>
      </div>
    </div>
    <div v-else class="no-content-message">
      <p>Aún no has registrado ninguna mascota.</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  mascotas: Array,
  placeholderImage: String
})

defineEmits([
  'openPetModal',
  'openReportModal',
  'openQrModal',
  'openImageViewer',
  'openReportDetailsModal'
])
</script>
