<template>
  <div class="modal-overlay image-viewer" @click="close">
    <div class="image-viewer-content" @click.stop>
      <img :src="imageUrl" alt="Vista previa de imagen" />
      <div class="close-button" @click="close">×</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  imageUrl: String
});
const emit = defineEmits(['close']);
const close = () => emit('close');
</script>

<style scoped>
.modal-overlay.image-viewer {
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}

.image-viewer-content {
  position: relative;
}

.image-viewer-content img {
  display: block;
  max-width: 90vw;
  max-height: 90vh;
  width: auto;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: 2px solid white;
  font-size: 1.8rem;
  line-height: 36px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.close-button:hover {
  transform: scale(1.1);
  background-color: rgba(200, 0, 0, 0.8);
}
</style>
