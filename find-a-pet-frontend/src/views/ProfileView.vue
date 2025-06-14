<template>
  <div class="profile-body">
    <!-- Estado de Carga -->
    <div v-if="loading" class="feedback-container">
      <p>Cargando tu perfil...</p>
    </div>

    <!-- Estado de Error -->
    <div v-else-if="error" class="feedback-container error">
      <h2>¡Ups! Algo salió mal</h2>
      <p>{{ error }}</p>
      <button @click="logout" class="btn btn-secondary">Volver al Login</button>
    </div>

    <!-- Contenido del Perfil -->
    <div v-else-if="user" class="profile-layout">
      <!-- Columna Izquierda: Información del Usuario -->
      <aside class="user-sidebar">
        <div class="user-card">
          <div class="user-avatar" @click="openProfileModal">
            <img v-if="user.fotoPerfil" :src="user.fotoPerfil" alt="Foto de perfil">
            <span v-else>{{ user.nombre.charAt(0).toUpperCase() }}</span>
            <div class="avatar-overlay">Editar</div>
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
            <button @click="openPetModal(null)" class="btn btn-primary">Registrar Mascota</button>
          </div>
          <div v-if="mascotas.length > 0" class="pets-grid">
            <div v-for="mascota in mascotas" :key="mascota._id" class="pet-card">
              <img :src="mascota.fotos[0] || placeholderImage" alt="Foto de la mascota" class="pet-photo">
              <div class="pet-info">
                <h3>{{ mascota.nombre }}</h3>
                <p class="pet-breed">{{ mascota.especie }} - {{ mascota.raza || 'No especificada' }}</p>
                <p class="pet-description">{{ mascota.descripcion }}</p>
              </div>
              <div class="pet-actions">
                <button @click="openPetModal(mascota)" class="btn-action edit">Editar</button>
                <button v-if="mascota.estado === 'en casa'" @click="openReportModal(mascota)" class="btn-action report">Reportar Perdida</button>
                <button @click="openQrModal(mascota._id)" class="btn-action qr">Ver QR</button>
              </div>
              <span class="pet-status" :class="mascota.estado.replace(' ', '-')">{{ mascota.estado }}</span>
            </div>
          </div>
          <div v-else class="no-content-message"><p>Aún no has registrado ninguna mascota.</p></div>
        </section>

        <!-- SECCIÓN "MIS REPORTES ACTIVOS" -->
        <section class="content-section">
          <div class="section-header"><h2>Mis Reportes Activos</h2></div>
          <div v-if="activeReports.length > 0" class="reports-grid">
            <div v-for="reporte in activeReports" :key="reporte._id" class="report-card-active">
              <img :src="reporte.fotos[0] || placeholderImage" alt="Foto de la mascota" class="pet-photo">
              <div class="pet-info">
                 <h3>{{ reporte.nombre }} (Perdida)</h3>
                 <p class="pet-breed">Perdida desde: {{ new Date(reporte.fechaPerdida).toLocaleDateString() }}</p>
                 <p class="pet-description">Última vez vista en {{ reporte.ultimaUbicacion && reporte.ultimaUbicacion.coordinates ? 'coordenadas.' : 'ubicación no especificada.' }}</p>
              </div>
              <div class="pet-actions">
                <button @click="handleMarkAsFound(reporte._id)" class="btn-action found">Marcar como Encontrada</button>
              </div>
            </div>
          </div>
          <div v-else class="no-content-message"><p>No tienes reportes activos en este momento.</p></div>
        </section>
      </main>
    </div>

    <!-- MODAL PARA AGREGAR/EDITAR MASCOTA -->
    <div v-if="showPetModal" class="modal-overlay" @click.self="closePetModal">
      <div class="modal-content animate__animated animate__fadeInUp">
        <h2>{{ isEditing ? 'Editar Mascota' : 'Registrar Nueva Mascota' }}</h2>
        <form @submit.prevent="handleSavePet">
          <input type="text" v-model="petForm.nombre" placeholder="Nombre" required>
          <input type="text" v-model="petForm.especie" placeholder="Especie" required>
          <input type="text" v-model="petForm.raza" placeholder="Raza">
          <textarea v-model="petForm.descripcion" placeholder="Descripción" required rows="3"></textarea>
          <div class="image-upload-field">
            <label for="petImage">Añadir foto:</label>
            <input type="file" id="petImage" @change="handleImageSelection" accept="image/*">
            <img v-if="imagePreviewUrl" :src="imagePreviewUrl" class="image-preview" alt="Vista previa">
          </div>
          <div class="modal-actions">
            <button type="button" @click="closePetModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="isSubmitting">{{ isSubmitting ? 'Guardando...' : 'Guardar' }}</button>
          </div>
          <p v-if="modalError" class="error-message">{{ modalError }}</p>
        </form>
      </div>
    </div>
    
    <!-- MODAL PARA REPORTAR PERDIDA -->
    <div v-if="showReportModal" class="modal-overlay" @click.self="closeReportModal">
        <div class="modal-content animate__animated animate__fadeInUp">
            <h2>Reportar a "{{ selectedPet?.nombre }}" como perdida</h2>
            <form @submit.prevent="handleReportLost">
                <label for="fechaPerdida">Fecha en que se perdió</label>
                <input id="fechaPerdida" type="date" v-model="reportForm.fechaPerdida" required>
                <label for="ubicacionTexto">Última ubicación vista (ciudad, barrio)</label>
                <input id="ubicacionTexto" type="text" placeholder="Ej: San Pedro Sula, Barrio Guamilito" v-model="reportForm.ubicacionTexto">
                <label for="recompensa">Recompensa (opcional)</label>
                <input id="recompensa" type="number" v-model.number="reportForm.recompensa" placeholder="0">
                <div class="modal-actions">
                    <button type="button" @click="closeReportModal" class="btn-secondary">Cancelar</button>
                    <button type="submit" class="btn-primary report-confirm" :disabled="isSubmitting">{{ isSubmitting ? 'Reportando...' : 'Confirmar Reporte' }}</button>
                </div>
                <p v-if="modalError" class="error-message">{{ modalError }}</p>
            </form>
        </div>
    </div>
    
    <!-- MODAL PARA EDITAR PERFIL DE USUARIO -->
    <div v-if="showProfileModal" class="modal-overlay" @click.self="closeProfileModal">
        <div class="modal-content animate__animated animate__fadeInUp">
            <h2>Editar Perfil</h2>
            <form @submit.prevent="handleUpdateProfile">
                <input type="text" v-model="profileForm.nombre" placeholder="Nombre completo">
                <input type="text" v-model="profileForm.telefono" placeholder="Teléfono">
                <input type="text" v-model="profileForm.ciudad" placeholder="Ciudad">
                <div class="image-upload-field">
                    <label>Foto de Perfil:</label>
                    <input type="file" @change="handleProfileImageSelection" accept="image/*">
                    <img v-if="profileImagePreviewUrl" :src="profileImagePreviewUrl" class="image-preview">
                </div>
                <div class="modal-actions">
                    <button type="button" @click="closeProfileModal" class="btn-secondary">Cancelar</button>
                    <button type="submit" class="btn-primary" :disabled="isSubmitting">Guardar Cambios</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- MODAL PARA MOSTRAR CÓDIGO QR -->
    <div v-if="showQrModal" class="modal-overlay" @click.self="closeQrModal">
      <div class="modal-content qr-modal animate__animated animate__zoomIn">
        <h2>Código QR para la Placa</h2>
        <p>Escanea este código para ver la información pública de tu mascota.</p>
        <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="Código QR">
        <div v-else><p>Generando código...</p></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '@/services/authService';
import PetService from '@/services/petService';
import { authStore } from '@/store/authStore';
import placeholderImage from '@/assets/placeholder-pet.png';

const router = useRouter();
const user = ref(null);
const mascotas = ref([]);
const loading = ref(true);
const error = ref('');
const isSubmitting = ref(false);
const modalError = ref('');

const showPetModal = ref(false);
const showReportModal = ref(false);
const showProfileModal = ref(false);
const showQrModal = ref(false);
const qrCodeUrl = ref('');
const isEditing = ref(false);
const selectedPet = ref(null);

const petForm = reactive({ _id: null, nombre: '', especie: '', raza: '', descripcion: '', fotos: [] });
const reportForm = reactive({ fechaPerdida: '', ubicacionTexto: '', recompensa: 0 });
const profileForm = reactive({ nombre: '', telefono: '', ciudad: '', fotoPerfil: '' });

const imageFile = ref(null);
const imagePreviewUrl = ref('');
const profileImageFile = ref(null);
const profileImagePreviewUrl = ref('');

onMounted(async () => {
  try {
    const profileResponse = await AuthService.getProfileData();
    user.value = profileResponse.data.user;
    await fetchMisMascotas();
  } catch (err) {
    error.value = 'No se pudo cargar tu perfil. Tu sesión puede haber expirado.';
    authStore.logout();
  } finally {
    loading.value = false;
  }
});

const fetchMisMascotas = async () => {
  try {
    const res = await PetService.getMyPets();
    mascotas.value = res.data;
  } catch (err) { console.error("Error cargando mascotas:", err); }
};

const handleSavePet = async () => {
  isSubmitting.value = true;
  modalError.value = '';
  try {
    let petDataPayload = { ...petForm };
    if (imageFile.value) {
      const res = await PetService.uploadPetImage(imageFile.value);
      petDataPayload.fotos = [res.data.secure_url];
    }
    if (isEditing.value) {
      await PetService.updatePet(petForm._id, petDataPayload);
    } else {
      await PetService.addPet(petDataPayload);
    }
    await fetchMisMascotas();
    closePetModal();
  } catch (err) {
    modalError.value = 'Error al guardar. Por favor, revisa los datos.';
  } finally {
    isSubmitting.value = false;
  }
};

const handleReportLost = async () => {
    isSubmitting.value = true;
    modalError.value = '';
    try {
        const reportData = {
            fechaPerdida: reportForm.fechaPerdida,
            recompensa: reportForm.recompensa,
            ultimaUbicacion: { type: 'Point', coordinates: [-88.025, 15.504] }
        };
        await PetService.reportAsLost(selectedPet.value._id, reportData);
        await fetchMisMascotas();
        closeReportModal();
    } catch(err) {
        modalError.value = 'Error al generar el reporte.';
    } finally {
        isSubmitting.value = false;
    }
};

const handleMarkAsFound = async (petId) => {
    try {
        await PetService.markAsFound(petId);
        await fetchMisMascotas();
    } catch (err) { console.error("Error marcando como encontrada", err); }
};

const handleUpdateProfile = async () => {
    isSubmitting.value = true;
    try {
        let profileData = { ...profileForm };
        if (profileImageFile.value) {
            const res = await PetService.uploadPetImage(profileImageFile.value);
            profileData.fotoPerfil = res.data.secure_url;
        }
        const response = await AuthService.updateProfile(profileData);
        const updatedUser = { ...authStore.user, user: response.data.user };
        authStore.login(updatedUser);
        user.value = response.data.user;
        closeProfileModal();
    } catch (err) { console.error("Error actualizando perfil", err); }
    finally { isSubmitting.value = false; }
};

const openPetModal = (mascota) => {
  isEditing.value = !!mascota;
  Object.assign(petForm, mascota ? { ...mascota } : { _id: null, nombre: '', especie: '', raza: '', descripcion: '', fotos: [] });
  imagePreviewUrl.value = mascota?.fotos[0] || '';
  showPetModal.value = true;
};
const closePetModal = () => {
  showPetModal.value = false; modalError.value = ''; imageFile.value = null; imagePreviewUrl.value = '';
};

const openReportModal = (mascota) => { selectedPet.value = mascota; showReportModal.value = true; };
const closeReportModal = () => { showReportModal.value = false; modalError.value = ''; };

const openProfileModal = () => {
    Object.assign(profileForm, user.value);
    profileImagePreviewUrl.value = user.value.fotoPerfil || '';
    showProfileModal.value = true;
};
const closeProfileModal = () => {
    showProfileModal.value = false; profileImageFile.value = null; profileImagePreviewUrl.value = '';
};

const openQrModal = async (petId) => {
    qrCodeUrl.value = '';
    showQrModal.value = true;
    try {
        const res = await PetService.getPetQrCode(petId);
        qrCodeUrl.value = res.data.qrCode;
    } catch (err) { console.error("Error generando QR", err); }
};
const closeQrModal = () => { showQrModal.value = false; };

const handleImageSelection = (event) => {
  const file = event.target.files[0];
  if (file) { imageFile.value = file; imagePreviewUrl.value = URL.createObjectURL(file); }
};
const handleProfileImageSelection = (event) => {
  const file = event.target.files[0];
  if (file) { profileImageFile.value = file; profileImagePreviewUrl.value = URL.createObjectURL(file); }
};

const activeReports = computed(() => mascotas.value.filter(m => m.estado === 'perdida'));
const formattedJoinDate = computed(() => {
  if (user.value?.fechaRegistro) {
    return new Date(user.value.fechaRegistro).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return '';
});

const logout = () => { authStore.logout(); router.push('/login'); };
</script>

<style scoped>
/* ESTILOS COMPLETOS Y CORREGIDOS */
.profile-body {
  background-color: #F4F2F8;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  padding-top: 115px; /* 75px de navbar + 40px de espacio libre */
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 40px;
  box-sizing: border-box;
}

.feedback-container { text-align: center; padding: 50px; background-color: white; border-radius: 20px; max-width: 600px; margin: 50px auto; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
.feedback-container.error h2, .feedback-container.error p { color: #721c24; }
.profile-layout { display: grid; grid-template-columns: 320px 1fr; gap: 40px; max-width: 1400px; margin: 0 auto; }
.user-sidebar .user-card { background-color: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); text-align: center; position: sticky; top: 115px; }

.user-avatar { width: 120px; height: 120px; border-radius: 50%; background-color: #b098d6; color: white; font-size: 3.5rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; border: 4px solid #f7de8e; position: relative; cursor: pointer; overflow: hidden; }
.user-avatar img { width: 100%; height: 100%; object-fit: cover; }
.user-avatar .avatar-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); color: white; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; font-size: 1rem; }
.user-avatar:hover .avatar-overlay { opacity: 1; }

.user-card h2 { margin: 0; font-size: 1.8rem; }
.user-card .user-email { color: #777; margin-bottom: 20px; word-break: break-all; }
.user-card .user-details { text-align: left; margin-top: 20px; }
.user-details p { margin-bottom: 10px; color: #555; }
.user-details strong { color: #333; }
.btn-logout { width: 100%; margin-top: 20px; background-color: #f8d7da; color: #721c24; border: none; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; }

.main-content .content-section { background-color: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); margin-bottom: 40px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #F4F2F8; padding-bottom: 15px; }
.section-header h2 { margin: 0; }
.btn-primary { background-color: #f7de8e; color: #8b7bab; font-weight: 700; padding: 12px 25px; border-radius: 8px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.btn-primary:disabled { background-color: #ccc; cursor: not-allowed; transform: none; box-shadow: none;}

.pets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
.pet-card, .report-card-active { border: 1px solid #f0f0f0; padding: 15px; border-radius: 15px; position: relative; display: flex; flex-direction: column; background: #fafafa; }
.pet-photo { width: 100%; height: 180px; object-fit: cover; border-radius: 10px; margin-bottom: 15px; background-color: #eee; }
.pet-info { flex-grow: 1; }
.pet-card h3, .report-card-active h3 { margin: 0 0 5px 0; }
.pet-breed { color: #666; font-size: 0.9rem; }
.pet-description { margin-top: 10px; color: #333; font-size: 0.95rem; }
.pet-status { position: absolute; top: 10px; right: 10px; padding: 4px 12px; font-size: 0.8rem; border-radius: 20px; font-weight: 600; text-transform: capitalize; }
.en-casa { background-color: #e8f5e9; color: #2e7d32; }
.perdida { background-color: #ffebee; color: #c62828; }
.pet-actions { margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;}
.btn-action { padding: 6px 12px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 500; }
.btn-action.report { border-color: #c62828; color: #c62828; }
.btn-action.found { border-color: #2e7d32; color: #2e7d32; }
.btn-action.qr { border-color: #6c757d; color: #6c757d; }
.no-content-message { text-align: center; padding: 40px; border: 2px dashed #e0e0e0; border-radius: 15px; }
.reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
.report-card-active { background-color: #fff; border-left: 5px solid #ff6f00; box-shadow: 0 5px 15px rgba(0,0,0,0.07); }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 20px; box-sizing: border-box; overflow-y: auto; }
.modal-content { background: white; padding: 30px 40px; border-radius: 15px; width: 90%; max-width: 500px; }
.modal-content.qr-modal { text-align: center; }
.qr-modal img { max-width: 80%; border: 1px solid #ddd; }
.modal-content h2 { margin-top: 0; }
.modal-content form input, .modal-content form textarea { width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 8px; font-family: 'Poppins', sans-serif; }
.modal-content form label { font-weight: 500; margin-bottom: 5px; display: block; }
.image-upload-field { margin-top: 15px; }
.image-preview { max-width: 100px; max-height: 100px; margin-top: 10px; border-radius: 5px; border: 1px solid #ddd; object-fit: cover; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.btn-secondary { background: #eee; color: #333; padding: 12px 25px; border-radius: 8px; border: none; cursor: pointer; }
.btn-primary.report-confirm { background-color: #c62828; color: white; }
.error-message { color: #c62828; margin-top: 15px; text-align: center; }
</style>