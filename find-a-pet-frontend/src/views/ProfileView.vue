<template>
  <div class="profile-body">
    <!-- Estado de Carga -->
    <div v-if="loading" class="feedback-container">
      <p>Cargando tu perfil...</p>
      <!-- Aquí podrías añadir un componente de spinner/loading visualmente más atractivo -->
    </div>

    <!-- Estado de Error -->
    <div v-else-if="error" class="feedback-container error">
      <h2>¡Ups! Algo salió mal</h2>
      <p>{{ error }}</p>
      <button @click="logout" class="btn btn-secondary">Volver al Login</button>
    </div>

    <!-- Contenido del Perfil (cuando todo está correcto) -->
    <div v-else-if="user" class="profile-layout">
      
      <!-- Columna Izquierda: Información del Usuario -->
      <aside class="user-sidebar">
        <div class="user-card">
          <div class="user-avatar">
            <span>{{ user.nombre.charAt(0).toUpperCase() }}</span>
          </div>
          <h2>{{ user.nombre }}</h2>
          <p class="user-email">{{ user.email }}</p>
          <hr>
          <div class="user-details">
            <p><strong>Teléfono:</strong> {{ user.telefono }}</p>
            <p><strong>Ciudad:</strong> {{ user.ciudad }}</p>
            <p><strong>Miembro desde:</strong> {{ formattedJoinDate }}</p>
          </div>
          <button @click="logout" class="btn-logout">Cerrar Sesión</button>
        </div>
      </aside>

      <!-- Columna Derecha: Contenido Principal -->
      <main class="main-content">
        <!-- SECCIÓN "MIS MASCOTAS" -->
        <section class="content-section">
          <div class="section-header">
            <h2>Mis Mascotas</h2>
            <button @click="openPetModal" class="btn btn-primary">Registrar Mascota</button>
          </div>
          <div v-if="mascotas.length > 0" class="pets-grid">
            <div v-for="mascota in mascotas" :key="mascota._id" class="pet-card">
              <span class="pet-status" :class="mascota.estado.replace(' ', '-')">{{ mascota.estado }}</span>
              <h3>{{ mascota.nombre }}</h3>
              <p class="pet-breed">{{ mascota.especie }} - {{ mascota.raza || 'Sin raza especificada' }}</p>
              <p class="pet-description">{{ mascota.descripcion }}</p>
              <div class="pet-actions">
                <button class="btn-action edit">Editar</button>
                <button v-if="mascota.estado === 'en casa'" class="btn-action report">Reportar Perdida</button>
              </div>
            </div>
          </div>
          <div v-else class="no-content-message">
            <p>Aún no has registrado ninguna mascota. ¡Añade a tu primer compañero!</p>
          </div>
        </section>

        <!-- SECCIÓN "MIS REPORTES ACTIVOS" -->
        <section class="content-section">
          <div class="section-header">
            <h2>Mis Reportes Activos</h2>
          </div>
          <div v-if="reports.length > 0" class="reports-grid">
            <div v-for="report in reports" :key="report._id" class="report-card">
              <span class="report-tag" :class="`tag-${report.tipo}`">{{ report.tipo }}</span>
              <p class="report-description">{{ report.descripcion }}</p>
              <div class="report-footer">
                <span class="report-location">{{ report.ciudad }}</span>
                <span class="report-date">{{ new Date(report.fecha).toLocaleDateString() }}</span>
              </div>
            </div>
          </div>
          <div v-else class="no-content-message">
            <p>No tienes reportes activos en este momento.</p>
          </div>
        </section>
      </main>
    </div>

    <!-- MODAL PARA AGREGAR MASCOTA -->
    <div v-if="showPetModal" class="modal-overlay" @click.self="closePetModal">
      <div class="modal-content animate__animated animate__fadeInUp">
        <h2>Registrar Nueva Mascota</h2>
        <p>Mantén la información de tus compañeros a salvo.</p>
        <form @submit.prevent="handleAgregarMascota">
          <input type="text" v-model="newPetForm.nombre" placeholder="Nombre de la mascota" required>
          <input type="text" v-model="newPetForm.especie" placeholder="Especie (ej. Perro, Gato)" required>
          <input type="text" v-model="newPetForm.raza" placeholder="Raza (ej. Labrador, Siamés)">
          <textarea v-model="newPetForm.descripcion" placeholder="Descripción y señas particulares..." required rows="4"></textarea>
          <div class="modal-actions">
            <button type="button" @click="closePetModal" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Guardando...' : 'Guardar Mascota' }}
            </button>
          </div>
          <p v-if="modalError" class="error-message">{{ modalError }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '@/services/authService';
import PetService from '@/services/petService'; // Importamos el servicio de mascotas
import { authStore } from '@/store/authStore';

const router = useRouter();

// Variables reactivas para los datos
const user = ref(null);
const reports = ref([]);
const mascotas = ref([]); // Lista para las mascotas del usuario
const loading = ref(true);
const error = ref('');

// --- Lógica del Modal ---
const showPetModal = ref(false);
const isSubmitting = ref(false);
const modalError = ref('');
const newPetForm = reactive({
  nombre: '',
  especie: '',
  raza: '',
  descripcion: ''
});

// onMounted se ejecuta cuando el componente está listo
onMounted(async () => {
  try {
    // Obtenemos los datos del perfil (usuario y reportes) en una sola llamada
    const profileResponse = await AuthService.getProfileData();
    user.value = profileResponse.data.user;
    reports.value = profileResponse.data.reports;
    // Obtenemos las mascotas del usuario
    await fetchMisMascotas();
  } catch (err) {
    error.value = 'No se pudo cargar tu perfil. Tu sesión puede haber expirado.';
    authStore.logout();
  } finally {
    loading.value = false;
  }
});

// Función para obtener las mascotas y actualizar la lista
const fetchMisMascotas = async () => {
  try {
    const petsResponse = await PetService.getMyPets();
    mascotas.value = petsResponse.data;
  } catch (err) {
    // Si falla la carga de mascotas, no rompemos toda la página, solo lo mostramos en consola
    console.error("No se pudieron cargar las mascotas:", err);
    error.value = 'No se pudieron cargar tus mascotas, pero tu perfil está aquí. Intenta recargar la página.';
  }
};

// --- Funciones del Modal ---
const openPetModal = () => { showPetModal.value = true; };
const closePetModal = () => {
  showPetModal.value = false;
  // Limpiar formulario y error al cerrar
  Object.assign(newPetForm, { nombre: '', especie: '', raza: '', descripcion: '' });
  modalError.value = '';
};
const handleAgregarMascota = async () => {
  isSubmitting.value = true;
  modalError.value = '';
  try {
    await PetService.addPet(newPetForm);
    await fetchMisMascotas(); // Recargamos la lista para mostrar la nueva mascota
    closePetModal();
  } catch (err) {
    modalError.value = 'Error al guardar la mascota. Revisa los datos e inténtalo de nuevo.';
  } finally {
    isSubmitting.value = false;
  }
};

// Propiedad computada para formatear la fecha
const formattedJoinDate = computed(() => {
  if (user.value && user.value.fechaRegistro) {
    return new Date(user.value.fechaRegistro).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
  return '';
});

// Función para cerrar sesión
const logout = () => {
  authStore.logout();
  router.push('/login'); // Corregido para que apunte a la ruta correcta
};
</script>

<style scoped>
/* Estilos existentes (optimizados y con adiciones) */
.profile-body {
  background-color: #F4F2F8;
  min-height: calc(100vh - 75px);
  padding: 40px;
  font-family: 'Poppins', sans-serif;
}
.feedback-container {
  text-align: center;
  padding: 50px; 
  background-color: white; 
  border-radius: 20px;
  max-width: 600px; 
  margin: 50px auto; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}
.feedback-container.error h2, .feedback-container.error p { 
  color: #721c24; 
}

.profile-layout {
  display: grid; 
  grid-template-columns: 320px 1fr; 
  gap: 40px;
  max-width: 1400px; 
  margin: 0 auto;
}
.user-sidebar .user-card {
  background-color: white; 
  padding: 30px; 
  border-radius: 20px; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  text-align: center; 
  position: sticky; 
  top: 100px;
}
.user-avatar {
  width: 100px; 
  height: 100px; 
  border-radius: 50%; 
  background-color: #b098d6; 
  color: white;
  font-size: 3rem; 
  font-weight: 700; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  margin: 0 auto 20px auto; 
  border: 4px solid #f7de8e;
}
.user-card h2 { 
  margin: 0; 
  font-size: 1.8rem; 
}
.user-card .user-email { 
  color: #777; 
  margin-bottom: 20px; 
}
.user-card .user-details { 
  text-align: left; 
  margin-top: 20px; 
}
.user-details p { 
  margin-bottom: 10px; 
  color: #555; 
}
.user-details strong { 
  color: #333; 
}
.btn-logout {
  width: 100%; 
  margin-top: 20px; 
  background-color: #f8d7da; 
  color: #721c24;
  border: none; 
  padding: 12px; 
  border-radius: 8px; 
  font-weight: 600; 
  cursor: pointer;
}

.main-content .content-section {
  background-color: white; 
  padding: 30px; 
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08); 
  margin-bottom: 40px;
}
.section-header {
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  margin-bottom: 20px; 
  border-bottom: 2px solid #F4F2F8; 
  padding-bottom: 15px;
}
.section-header h2 { 
  margin: 0; 
}
.btn-primary {
  background-color: #f7de8e; 
  color: #8b7bab; 
  font-weight: 700;
  padding: 12px 25px; 
  border-radius: 8px; 
  border: none; 
  cursor: pointer; 
  transition: all 0.2s;
}
.btn-primary:hover { 
  transform: translateY(-2px); 
  box-shadow: 0 4px 10px rgba(0,0,0,0.1); 
}
.btn-primary:disabled { 
  background-color: #ccc; 
  cursor: not-allowed; 
}

.pets-grid, .reports-grid {
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
  gap: 25px;
}

/* Estilos de las tarjetas de mascota */
.pet-card {
  border: 1px solid #f0f0f0; 
  padding: 20px; 
  border-radius: 15px; 
  position: relative;
  display: flex; 
  flex-direction: column;
}
.pet-card h3 { 
  margin: 0 0 5px 0; 
}
.pet-breed { 
  color: #666; 
  font-size: 0.9rem; 
}
.pet-description { 
  flex-grow: 1; 
  margin-top: 10px; 
  color: #333; 
}
.pet-status {
  position: absolute; 
  top: 15px; 
  right: 15px; 
  padding: 4px 12px;
  font-size: 0.8rem; 
  border-radius: 20px; 
  font-weight: 600; 
  text-transform: capitalize;
}
.en-casa { 
  background-color: #e8f5e9; 
  color: #2e7d32; 
}
.perdida { background-color: #ffebee; 
  color: #c62828; 
}
.pet-actions { 
  margin-top: 15px; 
  display: flex; 
  gap: 10px; 
}
.btn-action {
  padding: 6px 12px; 
  border: 1px solid #ccc; 
  background: #f9f9f9;
  border-radius: 6px; 
  cursor: pointer; 
  font-size: 0.85rem; 
  font-weight: 500;
}
.btn-action.report { 
  border-color: #c62828; 
  color: #c62828; 
  background: white; 
}

.no-content-message { 
  text-align: center; 
  padding: 40px; 
  border: 2px dashed #e0e0e0; 
  border-radius: 15px; 
}

/* Modal Styles */
.modal-overlay {
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  background-color: rgba(0,0,0,0.6); 
  display: flex; 
  justify-content: center;
  align-items: center; 
  z-index: 1000;
}
.modal-content {
  background: white; 
  padding: 30px 40px; 
  border-radius: 15px;
  width: 90%; 
  max-width: 500px;
}
.modal-content h2 { 
  margin-top: 0; 
}
.modal-content p { 
  color: #666; 
  margin-bottom: 25px; 
}
.modal-content form input, .modal-content form textarea {
  width: 100%; 
  padding: 12px; 
  margin-bottom: 15px; 
  border: 1px solid #ccc; 
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
}
.modal-actions { 
  display: flex; 
  justify-content: flex-end; 
  gap: 10px; 
  margin-top: 20px; 
}
.btn-secondary {
  background: #eee; 
  color: #333; 
  padding: 12px 25px; 
  border-radius: 8px; 
  border: none; 
  cursor: pointer;
}
.error-message { 
  color: #c62828; 
  margin-top: 15px; 
  text-align: center; 
  }
</style>