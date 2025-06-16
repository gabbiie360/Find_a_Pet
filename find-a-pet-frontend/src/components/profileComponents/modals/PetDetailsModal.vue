<!-- NUEVO ARCHIVO: PetDetailsModal.vue -->
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Detalles de la Mascota</h2>
      <div v-if="pet">
        <img :src="pet.fotos && pet.fotos.length > 0 ? pet.fotos[0] : '/src/assets/placeholder-pet.png'" class="detail-photo" />
        <p><strong>Nombre:</strong> {{ pet.nombre }}</p>
        <p><strong>Especie:</strong> {{ pet.especie }}</p>
        <p><strong>Raza:</strong> {{ pet.raza || 'No especificada' }}</p>
        <p><strong>Descripción:</strong> {{ pet.descripcion }}</p>
        <p><strong>Estado:</strong> <span :class="pet.estado">{{ pet.estado }}</span></p>
      </div>
      <div class="modal-actions">
        <button @click="$emit('close')" class="btn-custom-primary">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ pet: Object });
defineEmits(['close']);
</script>

<style scoped>
p { text-align: left; margin-bottom: 10px; }
strong { color: #333; }
.en-casa { color: #2e7d32; font-weight: bold; text-transform: capitalize; }
.perdida { color: #c62828; font-weight: bold; text-transform: capitalize; }
</style>