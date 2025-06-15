<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content animate__animated animate__fadeInUp">
      <h2>{{ isEditing ? 'Editar Reporte' : 'Nuevo Reporte' }}</h2>
      <form @submit.prevent="$emit('save')">
        <input v-model="report.nombre" placeholder="Nombre del animal" required />
        <input v-model="report.especie" placeholder="Especie" required />
        <input v-model="report.raza" placeholder="Raza" />
        <input v-model="report.ciudad" placeholder="Ciudad" required />
        <input v-model="report.descripcion" placeholder="Descripción" required />
        <input type="number" v-model="report.recompensa" placeholder="Recompensa (opcional)" />

        <!-- Última ubicación -->
        <input v-model="report.ultimaUbicacion.texto" placeholder="Última ubicación (texto)" />
        <input type="number" step="any" v-model.number="report.ultimaUbicacion.coordinates[1]" placeholder="Latitud" />
        <input type="number" step="any" v-model.number="report.ultimaUbicacion.coordinates[0]" placeholder="Longitud" />

        <!-- Tipo de reporte -->
        <select v-model="report.tipo" required>
          <option value="" disabled>Seleccione tipo</option>
          <option value="perdida">Perdida</option>
          <option value="encontrada">Encontrada</option>
          <option value="adopcion">Adopción</option>
        </select>

        <!-- Imagen -->
        <input type="file" @change="$emit('imageSelected', $event)" accept="image/*" />
        <img v-if="imagePreviewUrl" :src="imagePreviewUrl" class="image-preview" />

        <div class="modal-actions">
          <button type="submit" class="btn-primary">{{ isEditing ? 'Guardar Cambios' : 'Guardar' }}</button>
          <button type="button" class="btn-secondary" @click="$emit('close')">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
defineProps({
  report: Object,
  isEditing: Boolean,
  imagePreviewUrl: String
});
defineEmits(['close', 'save', 'imageSelected']);
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
.modal-content input,
.modal-content select {
  display: block;
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.image-preview {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.btn-primary {
  background: #f7de8e;
  color: #8b7bab;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  border: none;
}
.btn-secondary {
  background: #eee;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
}
</style>
