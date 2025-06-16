<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content animate__animated animate__fadeInUp">
      <h2>{{ isEditing ? 'Editar Mascota' : 'Registrar Nueva Mascota' }}</h2>
      
      <form v-if="localPet" @submit.prevent="saveChanges">
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" v-model="localPet.nombre" placeholder="Nombre de la mascota" required />
        </div>
        <div class="form-group">
          <label>Especie</label>
          <input type="text" v-model="localPet.especie" placeholder="Ej. Perro, Gato" required />
        </div>
        <div class="form-group">
          <label>Raza</label>
          <input type="text" v-model="localPet.raza" placeholder="Ej. Labrador, Siames" />
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <textarea v-model="localPet.descripcion" placeholder="Señas particulares, personalidad, etc." required rows="3"></textarea>
        </div>
        
        <div class="image-upload-field">
          <label for="petImage">Foto de la mascota:</label>
          <input type="file" id="petImage" @change="$emit('imageSelected', $event)" accept="image/*" />
          <img v-if="imagePreviewUrl" :src="imagePreviewUrl" class="image-preview" alt="Vista previa" />
        </div>

        <div class="modal-actions">
          <button type="button" @click="$emit('cancel')" class="btn-custom-secondary">Cancelar</button>
          <button type="submit" class="btn-custom-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Registrar Mascota') }}
          </button>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  pet: Object,
  isEditing: Boolean,
  imagePreviewUrl: String,
  isSubmitting: Boolean,
  errorMessage: String
});

const emit = defineEmits(['cancel', 'save', 'imageSelected']);

const localPet = ref({});

watch(() => props.pet, (newPet) => {
  localPet.value = { ...newPet };
}, { immediate: true, deep: true });

const saveChanges = () => {
  emit('save', localPet.value);
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: .5rem;
  font-weight: 500;
  text-align: left;
}
.form-group input, .form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
}
.image-upload-field {
  text-align: left;
  margin-top: 15px;
}
.image-preview {
  display: block;
  margin-top: 10px;
  max-width: 100px;
  max-height: 100px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #ddd;
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