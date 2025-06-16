<!-- ARCHIVO: ReportModal.vue -->
<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <h2>Reportar a {{ pet.nombre }} como Perdida</h2>
      <p>Completa los detalles para crear el reporte.</p>
      
      <form @submit.prevent="submitReport">
        
        <div class="form-group">
          <label for="fechaPerdida">Fecha en que se perdió</label>
          <input type="date" id="fechaPerdida" v-model="localReportForm.fechaPerdida" required />
        </div>
        
        <div class="form-group">
          <label for="ubicacionTexto">Última ubicación vista (lo más específico posible)</label>
          <input type="text" id="ubicacionTexto" v-model="localReportForm.ultimaUbicacion.texto" placeholder="Ej. Parque Central, cerca de la fuente" required />
        </div>

        <div class="form-group">
          <label for="recompensa">Recompensa (opcional, en Lempiras)</label>
          <input type="number" id="recompensa" v-model.number="localReportForm.recompensa" placeholder="0" />
        </div>

        <div class="modal-actions">
          <button type="button" @click="$emit('cancel')" class="btn-custom-secondary">Cancelar</button>
          <button type="submit" :disabled="isSubmitting" class="btn-custom-primary">
            {{ isSubmitting ? 'Creando Reporte...' : 'Crear Reporte' }}
          </button>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  pet: Object, // La mascota que se está reportando
  isSubmitting: Boolean,
  errorMessage: String,
});

const emit = defineEmits(['submit', 'cancel']);

// Usamos una copia local para el formulario, para no modificar la prop
const localReportForm = reactive({
  fechaPerdida: '',
  recompensa: 0,
  ultimaUbicacion: {
    texto: ''
  }
});

const submitReport = () => {
  // Al enviar, emitimos un objeto que combina los datos de la mascota y del formulario
  const reportData = {
    ...props.pet, // Incluye nombre, especie, raza, fotos, etc.
    ...localReportForm, // Incluye fechaPerdida, recompensa y ubicacion
    mascotaId: props.pet._id,
    tipo: 'perdida'
  };
  emit('submit', reportData);
};
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
