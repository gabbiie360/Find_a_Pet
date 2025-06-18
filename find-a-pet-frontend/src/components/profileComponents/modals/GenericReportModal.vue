<template>
  <div class="modal-overlay" @click.self="onCancel">
    <div class="modal-content animate__animated animate__fadeInUp">
      <h2>Crear Nuevo Reporte</h2>
      
      <!-- El formulario ahora llama a un método local 'handleSubmit' -->
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Tipo de Reporte</label>
          <!-- v-model ahora se enlaza a la copia local 'form' -->
          <select v-model="form.tipo" required>
            <option disabled value="">Selecciona un tipo</option>
            <option value="perdida">Mascota Perdida</option>
            <option value="encontrada">Mascota Encontrada</option>
            <option value="adopcion">Poner en Adopción</option>
          </select>
        </div>

        <!-- El input de fecha solo aparece si el tipo es 'perdida' -->
        <div v-if="form.tipo === 'perdida'" class="form-group">
          <label for="fechaPerdida">Fecha en que se perdió</label>
          <input id="fechaPerdida" type="date" v-model="form.fechaPerdida" required>
        </div>

        <div class="form-group">
          <label>Nombre del animal</label>
          <input v-model.trim="form.nombre" type="text" placeholder="Ej. Fido" required />
        </div>
        
        <div class="form-grid">
          <div class="form-group">
            <label>Especie</label>
            <input v-model.trim="form.especie" type="text" placeholder="Ej. Perro, Gato" required />
          </div>
          <div class="form-group">
            <label>Raza</label>
            <input v-model.trim="form.raza" type="text" placeholder="Ej. Mestizo, Labrador" />
          </div>
        </div>

        <div class="form-group">
          <label>Ciudad</label>
          <input v-model.trim="form.ciudad" type="text" placeholder="Ej. San Pedro Sula" required />
        </div>

        <div class="form-group">
          <label>Descripción</label>
          <textarea v-model.trim="form.descripcion" placeholder="Describe la mascota, colores, señas particulares, etc." required rows="4"></textarea>
        </div>
        
        <div class="form-group">
          <label>Recompensa (opcional, en Lempiras)</label>
          <input type="number" v-model.number="form.recompensa" placeholder="0" />
        </div>
        
        <div class="form-group">
          <label>Foto (muy recomendado)</label>
          <!-- El @change llama a un método local 'handleImageSelection' -->
          <input type="file" @change="handleImageSelection" accept="image/*" />
          <img v-if="imagePreview" :src="imagePreview" class="image-preview" alt="Vista previa" />
        </div>

        <div class="modal-actions">
          <button type="button" @click="onCancel" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creando Reporte...' : 'Crear Reporte' }}
          </button>
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';

// --- DEFINICIÓN DE PROPS Y EMITS ---
const props = defineProps({
  // 'report' se usa ahora solo para recibir los valores iniciales
  report: {
    type: Object,
    required: true
  },
  isSubmitting: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  }
});

// El componente solo emite 'save' (con datos) y 'cancel'
const emit = defineEmits(['save', 'cancel']);


// --- ESTADO LOCAL DEL COMPONENTE ---
// 'form' es una copia local reactiva de los datos. Esto es lo que modificaremos.
const form = reactive({ ...props.report });
// 'imageFile' almacenará el objeto de archivo seleccionado.
const imageFile = ref(null);
const imagePreview = ref('');

// --- WATCHER PARA SINCRONIZAR PROPS CON ESTADO LOCAL ---
// Esto asegura que si el padre cambia los datos iniciales, el modal se actualiza.
watch(() => props.report, (newReportData) => {
  // Copiamos los nuevos datos de la prop al estado local 'form'
  Object.assign(form, newReportData);
  // Limpiamos la selección de imagen anterior
  imageFile.value = null;
  imagePreview.value = '';
}, { deep: true, immediate: true });


// --- MÉTODOS DEL COMPONENTE ---

// Maneja la selección de un archivo de imagen
const handleImageSelection = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    // Creamos una URL local para la vista previa
    imagePreview.value = URL.createObjectURL(file);
  } else {
    imageFile.value = null;
    imagePreview.value = '';
  }
};

// Se ejecuta al enviar el formulario
const handleSubmit = () => {
  // Creamos un paquete (payload) con todos los datos del formulario local
  // y el archivo de imagen.
  const payload = {
    ...form,
    imagen: imageFile.value // El padre recibirá el archivo bajo la clave 'imagen'
  };
  // Emitimos el evento 'save' con el paquete de datos
  emit('save', payload);
};

// Se ejecuta al hacer clic en cancelar o en el fondo
const onCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
/* Tus estilos aquí, no necesitan cambios. He añadido algunos para mejorar la UX. */
.form-group {
  margin-bottom: 1.2rem;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}
input[type="text"],
input[type="date"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
}
textarea {
  resize: vertical;
}
.image-preview {
  margin-top: 10px;
  max-width: 100px;
  max-height: 100px;
  border-radius: 8px;
  border: 1px solid #ddd;
  object-fit: cover;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
.btn-primary, .btn-secondary {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.btn-primary {
  background-color: #b98bff;
  color: white;
}
.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}
.error-message {
  color: red;
  text-align: center;
  margin-top: 1rem;
}
</style>
