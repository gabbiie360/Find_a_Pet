<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content animate__animated animate__fadeInUp">
      <h2>Editar Reporte</h2>
      <form @submit.prevent="$emit('save')">
        <label>Nombre</label>
        <input v-model="report.nombre" type="text" placeholder="Nombre del animal" />

        <label>Ciudad</label>
        <input v-model="report.ciudad" type="text" placeholder="Ej. San Pedro Sula" />

        <label>Última ubicación vista</label>
        <input v-model="report.ultimaUbicacion.texto" type="text" placeholder="Ej. Villas del Sol, SPS" />

        <label>Coordenadas - Latitud</label>
        <input v-model.number="report.ultimaUbicacion.coordinates[1]" type="number" step="any" placeholder="Ej. 15.504" />

        <label>Coordenadas - Longitud</label>
        <input v-model.number="report.ultimaUbicacion.coordinates[0]" type="number" step="any" placeholder="Ej. -88.025" />

        <label>Descripción</label>
        <input v-model="report.descripcion" type="text" placeholder="Ej. Collares, manchas, etc" />

        <label>Especie</label>
        <input v-model="report.especie" type="text" placeholder="Ej. Perro, Gato" />

        <label>Raza</label>
        <input v-model="report.raza" type="text" placeholder="Ej. Labrador" />

        <label>Recompensa (opcional)</label>
        <input v-model.number="report.recompensa" type="number" placeholder="Ej. 500" />

        <div class="modal-actions">
        <button type="button" class="btn-custom-secondary" @click="$emit('cancel')">Cancelar</button>
        <button type="submit" class="btn-custom-primary">Guardar</button>
      </div>
      </form>
    </div>
  </div>
</template>

<script setup>
defineProps({
  report: Object
});
defineEmits(['save', 'cancel']);
</script>
