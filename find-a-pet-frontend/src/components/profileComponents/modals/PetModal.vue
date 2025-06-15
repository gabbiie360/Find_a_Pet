<template>
  <div class="modal-overlay" @click.self="$emit('cancel')"> <!-- CORREGIDO -->
    <div class="modal-content animate__animated animate__fadeInUp">
      <h2>{{ isEditing ? 'Editar Mascota' : 'Registrar Nueva Mascota' }}</h2>
      <form @submit.prevent="$emit('save')">
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" v-model="pet.nombre" placeholder="Nombre" required />
        </div>
        <div class="form-group">
          <label>Especie</label>
          <input type="text" v-model="pet.especie" placeholder="Especie" required />
        </div>
        <div class="form-group">
          <label>Raza</label>
          <input type="text" v-model="pet.raza" placeholder="Raza" />
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <textarea v-model="pet.descripcion" placeholder="Descripción" required rows="3"></textarea>
        </div>

        <div class="image-upload-field">
          <label for="petImage">Añadir foto:</label>
          <input
            type="file"
            id="petImage"
            @change="$emit('imageSelected', $event)"
            accept="image/*"
          />
          <img
            v-if="imagePreviewUrl"
            :src="imagePreviewUrl"
            class="image-preview"
            alt="Vista previa"
          />
        </div>

        <div class="modal-actions">
           <!-- CORREGIDO -->
          <button type="button" @click="$emit('cancel')" class="btn-custom-secondary">Cancelar</button>
          <button type="submit" class="btn-custom-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
defineProps({
  pet: Object,
  isEditing: Boolean,
  imagePreviewUrl: String,
  isSubmitting: Boolean,
  errorMessage: String
});

// CORREGIDO
defineEmits(['cancel', 'save', 'imageSelected']);
</script>

<style scoped>
/* NOTA: He añadido la clase .form-group que faltaba en los estilos */
.form-group {
  margin-bottom: 15px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

.modal-content {
  background: white;
  padding: 30px 40px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;
}

.modal-content h2 {
  margin-top: 0;
  text-align: left;
}

.modal-content form input,
.modal-content form textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
}

.modal-content form label {
  font-weight: 500;
  margin-bottom: 5px;
  display: block;
  text-align: left;
}

.image-upload-field {
  margin-top: 15px;
  text-align: left;
}

.image-preview {
  max-width: 100px;
  max-height: 100px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  object-fit: cover;
  display: block;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.error-message {
  color: #c62828;
  margin-top: 15px;
  text-align: center;
}
</style>