<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <h2>Editar Perfil</h2>
      
      <form v-if="localProfile" @submit.prevent="saveChanges">
        
        <!-- Vista previa de la foto y campo para subir nueva -->
        <div class="profile-picture-section">
          <img :src="imagePreviewUrl || localProfile.fotoPerfil || '/src/assets/placeholder-pet.png'" alt="Foto de perfil" class="profile-preview">
          <div class="form-group">
            <label for="profileImage">Cambiar foto de perfil</label>
            <input type="file" id="profileImage" @change="$emit('imageSelected', $event)" accept="image/*" />
          </div>
        </div>
        
        <hr>

        <div class="form-group">
          <label>Nombre Completo</label>
          <input type="text" v-model="localProfile.nombre" required />
        </div>
        <div class="form-group">
          <label>Correo Electrónico</label>
          <input type="email" :value="localProfile.email" disabled title="No se puede cambiar el correo desde aquí." />
          <small>El correo no se puede modificar por seguridad.</small>
        </div>
        <div class="form-group">
          <label>Número de Teléfono</label>
          <input type="tel" v-model="localProfile.telefono" />
        </div>
        <div class="form-group">
          <label>Dirección Específica</label>
          <textarea v-model="localProfile.direccionDetallada" rows="3" placeholder="Colonia, bloque, número de casa..."></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" @click="$emit('cancel')" class="btn-custom-secondary">Cancelar</button>
          <button type="submit" class="btn-custom-primary">Guardar Cambios</button>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  profile: Object,
  imagePreviewUrl: String,
  errorMessage: String,
});

const emit = defineEmits(['save', 'cancel', 'imageSelected']);

const localProfile = ref({});

watch(() => props.profile, (newProfile) => {
  if (newProfile) {
    localProfile.value = { ...newProfile };
  }
}, { immediate: true, deep: true });

const saveChanges = () => {
  emit('save', localProfile.value);
};
</script>

<style scoped>
.profile-picture-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 1rem;
}
.profile-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
}
hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 1.5rem 0;
}
.form-group { margin-bottom: 1rem; text-align: left; }
.form-group label { display: block; margin-bottom: .5rem; font-weight: 500; }
.form-group input, .form-group textarea { width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #ccc; border-radius: 8px; }
.form-group input:disabled { background-color: #f5f5f5; cursor: not-allowed; }
.form-group small { font-size: 0.8rem; color: #777; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
</style>