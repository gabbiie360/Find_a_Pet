<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <h2>Editar Reporte</h2>
      
      <!-- El formulario ahora usa 'localReport' -->
      <form v-if="localReport" @submit.prevent="saveChanges">
        
        <!-- CAMPOS COMUNES -->
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" v-model="localReport.nombre" required />
        </div>
        <div class="form-group">
          <label>Especie</label>
          <input type="text" v-model="localReport.especie" required />
        </div>
        <div class="form-group">
          <label>Raza</label>
          <input type="text" v-model="localReport.raza" />
        </div>
        <div class="form-group">
          <label>Ciudad</label>
          <input type="text" v-model="localReport.ciudad" required />
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <textarea v-model="localReport.descripcion" rows="3"></textarea>
        </div>

        <!-- CAMPOS SOLO PARA REPORTES DE 'PERDIDA' -->
        <template v-if="localReport.tipo === 'perdida'">
          <div class="form-group">
            <label>Recompensa (opcional)</label>
            <input type="number" v-model.number="localReport.recompensa" />
          </div>
          <div class="form-group">
            <label>Última ubicación vista</label>
            <input type="text" v-model="localReport.ultimaUbicacion.texto" />
          </div>
        </template>
        
        <!-- Botones de Acción -->
        <div class="modal-actions">
          <button type="button" @click="$emit('cancel')" class="btn-custom-secondary">Cancelar</button>
          <button type="submit" class="btn-custom-primary">Guardar Cambios</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  report: Object
});

const emit = defineEmits(['save', 'cancel']);

// 1. Creamos una copia local y reactiva de los datos
const localReport = ref(null);

// 2. Usamos 'watch' para actualizar la copia local cada vez que el 'prop' cambie
// (es decir, cada vez que se abre el modal con un nuevo reporte)
watch(() => props.report, (newReport) => {
  if (newReport) {
    // Hacemos una copia profunda para evitar problemas con objetos anidados
    localReport.value = JSON.parse(JSON.stringify(newReport));
  }
}, { immediate: true });

// 3. Cuando se guarda, emitimos el objeto local completo y actualizado
const saveChanges = () => {
  emit('save', localReport.value);
};
</script>

<style scoped>
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: .5rem; font-weight: 500; text-align: left; }
.form-group input, .form-group textarea { width: 100%; box-sizing: border-box; }
</style>