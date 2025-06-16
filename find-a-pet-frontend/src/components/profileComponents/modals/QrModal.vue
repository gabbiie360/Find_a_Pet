<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content qr-modal">
      <h2>Código QR de la mascota</h2>
      <img :src="qrCodeUrl" alt="QR Code" />
      <button class="btn-secondary" @click="$emit('close')">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  qrCodeUrl: String
});
</script>

<style scoped>
.modal-content.qr-modal {
  text-align: center;
}

.modal-content.qr-modal img {
  max-width: 80%;
  margin: 20px 0;
  border: 1px solid #ddd;
}
</style>
