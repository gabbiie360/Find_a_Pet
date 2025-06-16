<!-- DENTRO DE MyPetsSection.vue -->
<template>
  <section class="content-section">
    <div class="section-header">
      <h2>Mis Mascotas</h2>
      <button @click="$emit('openPetModal')" class="btn-custom-primary">Registrar Mascota</button>
    </div>
    <div v-if="mascotas.length > 0" class="pets-grid">
      <div v-for="mascota in mascotas" :key="mascota._id" class="pet-card">
        
        <!-- Iconos de Editar/Eliminar en la esquina -->
        <div class="pet-card-icons">
          <button @click="$emit('openPetModal', mascota)" class="btn-icon" title="Editar Mascota">
            <font-awesome-icon icon="fa-solid fa-pen-to-square" />
          </button>
          <button @click="$emit('deletePet', mascota._id)" class="btn-icon delete" title="Eliminar Mascota">
            <font-awesome-icon icon="fa-solid fa-trash" />
          </button>
        </div>

       
          <span :class="['pet-status', mascota.estado.toLowerCase()]">{{ mascota.estado }}</span>
        
        <img
          :src="mascota.fotos && mascota.fotos.length > 0 ? mascota.fotos[0] : placeholderImage"
          class="pet-photo"
          @click="$emit('openImageViewer', mascota.fotos && mascota.fotos.length > 0 ? mascota.fotos[0] : '')"
        >
        <div class="pet-info">
          <h3>{{ mascota.nombre }}</h3>
          <p class="pet-breed">{{ mascota.especie }} - {{ mascota.raza }}</p>
          <p class="pet-description">{{ mascota.descripcion }}</p>
        </div>

        <div class="pet-actions">
           <!-- El botón "Reportar Perdida" solo aparece si la mascota está 'en casa' -->
          <button v-if="mascota.estado === 'en-casa'" @click="$emit('openReportModal', mascota)" class="btn-action report">Reportar Perdida</button>
          <button @click="$emit('openQrModal', mascota._id)" class="btn-action qr">Ver QR</button>
          <!-- Este botón ahora emite un evento diferente -->
          <button @click="$emit('openPetDetailsModal', mascota)" class="btn-action">Ver Detalles</button>
        </div>

      </div>
    </div>
    <div v-else class="no-content-message">
      Aún no has registrado ninguna mascota.
    </div>
  </section>
</template>

<script setup>
defineProps({
  mascotas: Array,
  placeholderImage: String
});

// Añadimos los nuevos emits
defineEmits([
  'openPetModal',
  'deletePet',
  'openImageViewer',
  'openReportModal',
  'openQrModal',
  'openPetDetailsModal' 
]);
</script>