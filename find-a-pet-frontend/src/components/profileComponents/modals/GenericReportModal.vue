<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content animate__animated animate__fadeInUp">
      <h2>Crear Nuevo Reporte</h2>
      <form @submit.prevent="$emit('save')">
        <label>Tipo de Reporte</label>
        <select v-model="report.tipo" required>
          <option disabled value="">Selecciona un tipo</option>
          <option value="perdida">Perdida</option>
          <option value="encontrada">Encontrada</option>
          <option value="adopcion">Adopción</option>
        </select>

        <div v-if="report.tipo === 'perdida'">
          <label for="fechaPerdida">Fecha en que se perdió</label>
          <input id="fechaPerdida" type="date" v-model="report.fechaPerdida" required>
        </div>

        <label>Nombre</label>
        <input v-model="report.nombre" type="text" placeholder="Nombre del animal" required />

        <label>Especie</label>
        <input v-model="report.especie" type="text" placeholder="Ej. Perro, Gato" required />

        <label>Raza</label>
        <input v-model="report.raza" type="text" placeholder="Ej. Labrador" />

        <label>Ciudad</label>
        <input v-model="report.ciudad" type="text" placeholder="Ej. San Pedro Sula" required />

        <label>Descripción</label>
        <textarea v-model="report.descripcion" placeholder="Detalles del caso" required rows="4"></textarea>

        <label>Recompensa (opcional)</label>
        <input type="number" v-model.number="report.recompensa" placeholder="Ej. 500" />

        <label>Última ubicación vista (opcional)</label>
        <input v-model="report.ultimaUbicacionTexto" type="text" placeholder="Ej. Villas del Sol, SPS" />

        <label>Coordenadas (opcional)</label>
        <input v-model="report.latitud" type="number" step="any" placeholder="Latitud (Ej. 15.504)" />
        <input v-model="report.longitud" type="number" step="any" placeholder="Longitud (Ej. -88.025)" />

        <label>Foto (opcional)</label>
        <input type="file" @change="$emit('image-selected', $event)" accept="image/*" />

        <div class="modal-actions">
          <button type="button" @click="$emit('cancel')" class="btn-custom-primary">Cancelar</button>
          <button type="submit" class="btn-custom-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
defineProps({
  report: Object,
  isSubmitting: Boolean
});
defineEmits(['save', 'cancel', 'image-selected']);
</script>
