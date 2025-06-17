<template>
  <div class="profile-body">
    <!-- Estados de Carga y Error -->
    <div v-if="loading" class="feedback-container"><h2>Cargando tu perfil...</h2></div>
    <div v-else-if="error" class="feedback-container error"><h2>Oops...</h2><p>{{ error }}</p></div>
    
    <!-- Contenido Principal -->
    <div v-else-if="user" class="profile-layout">
      <UserSidebar :user="user" :placeholderImage="placeholderImage" :formattedJoinDate="formattedJoinDate" @openImageViewer="openImageViewer" @openProfileModal="openProfileModal" @logout="logout" />
      <main class="main-content">
        <MyPetsSection :mascotas="mascotas" :placeholderImage="placeholderImage" @openPetModal="openPetModal" @deletePet="handleDeletePet" @openReportModal="openReportModal" @openQrModal="openQrModal" @openImageViewer="openImageViewer" @openPetDetailsModal="openPetDetailsModal" />
        <MyReportsSection :activeReports="activeReports" :placeholderImage="placeholderImage" @openGenericReportModal="openGenericReportModal" @openImageViewer="openImageViewer" @openEditReportModal="openPetModal" @deleteReport="handleDeletePet" @openQrModal="openQrModal" @openReportDetailsModal="openPetDetailsModal" @handleMarkAsFound="handleMarkAsFound" />
      </main>
    </div>

    <!-- MODALES -->
    <PetModal v-if="showPetModal" :isEditing="isEditing" :pet="petForm" :imagePreviewUrl="imagePreviewUrl" :isSubmitting="isSubmitting" :errorMessage="modalError" @save="handleSavePet" @cancel="closePetModal" @imageSelected="handleImageSelection" />
    <ReportModal v-if="showReportModal" :pet="selectedPet" :isSubmitting="isSubmitting" :errorMessage="modalError" @submit="handleReportLost" @cancel="closeReportModal" />
    <PetDetailsModal v-if="showPetDetailsModal" :pet="selectedPetDetails" @close="closePetDetailsModal" />
    <ProfileModal v-if="showProfileModal" :profile="profileForm" :imagePreviewUrl="profileImagePreviewUrl" :errorMessage="modalError" @save="handleUpdateProfile" @cancel="closeProfileModal" @imageSelected="handleProfileImageSelection" />
    <GenericReportModal v-if="showGenericReportModal" :isSubmitting="isSubmitting" :errorMessage="modalError" @save="handleGenericReportSubmit" @cancel="closeGenericReportModal" @image-selected="handleGenericImageSelection" />
    <QrModal v-if="showQrModal" :qrCodeUrl="qrCodeUrl" @close="closeQrModal" />
    <ImageViewerModal v-if="showImageViewer" :imageUrl="imageToView" @close="closeImageViewer" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '@/services/authService';
import PetService from '@/services/petService';
import ReportService from '@/services/reportService';
import { authStore } from '@/store/authStore';
import placeholderImage from '@/assets/placeholder-pet.png';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Importación de todos los componentes
import UserSidebar from '@/components/profileComponents/UserSidebar.vue';
import MyPetsSection from '@/components/profileComponents/MyPetsSection.vue';
import MyReportsSection from '@/components/profileComponents/MyReportsSection.vue';
import PetModal from '@/components/profileComponents/modals/PetModal.vue';
import ReportModal from '@/components/profileComponents/modals/ReportModal.vue';
import PetDetailsModal from '@/components/profileComponents/modals/PetDetailsModal.vue';
import ProfileModal from '@/components/profileComponents/modals/ProfileModal.vue';
import GenericReportModal from '@/components/profileComponents/modals/GenericReportModal.vue';
import QrModal from '@/components/profileComponents/modals/QrModal.vue';
import ImageViewerModal from '@/components/profileComponents/modals/ImageViewerModal.vue';

// --- ESTADO Y VARIABLES REACTIVAS ---
const router = useRouter();
const user = ref(null);
const mascotas = ref([]);
const myReports = ref([]);
const loading = ref(true);
const error = ref('');
const isSubmitting = ref(false);
const modalError = ref('');

// Controladores de visibilidad de modales
const showPetModal = ref(false);
const showReportModal = ref(false);
const showProfileModal = ref(false);
const showPetDetailsModal = ref(false);
const showGenericReportModal = ref(false);
const showQrModal = ref(false);
const showImageViewer = ref(false);
const isEditing = ref(false);

// Datos para los modales
const selectedPet = ref(null);
const selectedPetDetails = ref(null);
const qrCodeUrl = ref('');
const imageToView = ref('');

// Formularios
const petForm = reactive({ _id: null, nombre: '', especie: '', raza: '', descripcion: '', estado: 'en-casa' });
const reportForm = reactive({ fechaPerdida: '', recompensa: 0, ultimaUbicacion: { texto: '' } });
const profileForm = reactive({ nombre: '', email: '', telefono: '', direccionDetallada: '', fotoPerfil: '' });
const genericReportForm = reactive({ nombre: '', especie: '', raza: '', descripcion: '', ciudad: '', estado: 'adopcion', recompensa: 0, imagen: null });

// Manejo de archivos
const imageFile = ref(null);
const imagePreviewUrl = ref('');
const profileImageFile = ref(null);
const profileImagePreviewUrl = ref('');

// --- LÓGICA DE CARGA INICIAL ---
onMounted(async () => {
  try {
    const profileResponse = await AuthService.getProfileData();
    user.value = profileResponse.data.user;
    await Promise.all([fetchMisMascotas(), fetchMisReportes()]);
  } catch (err) { error.value = 'No se pudo cargar tu perfil.'; } 
  finally { loading.value = false; }
});
const fetchMisMascotas = async () => { try { mascotas.value = (await PetService.getMyPets()).data; } catch (err) { console.error("Error cargando mascotas:", err); } };
const fetchMisReportes = async () => { try { myReports.value = (await ReportService.getMyReports()).data || []; } catch (err) { console.error("Error al cargar reportes:", err); } };
const activeReports = computed(() => myReports.value);

// --- LÓGICA DE MASCOTAS (Crear y Editar) ---
const openPetModal = (mascota = null) => {
  isEditing.value = !!mascota;
  const basePet = { _id: null, nombre: '', especie: '', raza: '', descripcion: '', estado: 'en-casa', fotos: [] };
  Object.assign(petForm, mascota ? mascota : basePet);
  imagePreviewUrl.value = mascota?.fotos?.[0] || '';
  imageFile.value = null;
  modalError.value = '';
  showPetModal.value = true;
};
const closePetModal = () => { showPetModal.value = false; };

const handleSavePet = async (petDataFromModal) => {
  isSubmitting.value = true;
  modalError.value = '';
  try {
    const formData = new FormData();
    formData.append('nombre', petDataFromModal.nombre);
    formData.append('especie', petDataFromModal.especie);
    formData.append('raza', petDataFromModal.raza);
    formData.append('descripcion', petDataFromModal.descripcion);
    formData.append('estado', petDataFromModal.estado);
    formData.append('ciudad', user.value.ciudad);
    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }
    
    if (isEditing.value) {
      await PetService.updatePet(petDataFromModal._id, formData);
    } else {
      await PetService.addPet(formData);
    }
    
    await Promise.all([fetchMisMascotas(), fetchMisReportes()]);
    closePetModal();
    Swal.fire('¡Éxito!', `Mascota ${isEditing.value ? 'actualizada' : 'registrada'}.`, 'success');
  } catch (err) {
    console.error('Error al guardar mascota:', err);
    modalError.value = "Error al guardar la mascota.";
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeletePet = async (petId) => {
  const result = await Swal.fire({ title: '¿Estás seguro?', text: "¡No podrás revertir esto!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6', confirmButtonText: 'Sí, ¡elimínalo!' });
  if (result.isConfirmed) {
    try {
      await PetService.deletePet(petId);
      await Promise.all([fetchMisMascotas(), fetchMisReportes()]);
      Swal.fire('¡Eliminado!', 'La entrada ha sido eliminada.', 'success');
    } catch (err) { Swal.fire('Error', 'No se pudo eliminar.', 'error'); }
  }
};

// --- LÓGICA DE REPORTES (Cambiar estado de mascota existente) ---
const openReportModal = (mascota) => {
  selectedPet.value = mascota;
  Object.assign(reportForm, { fechaPerdida: '', recompensa: 0, ultimaUbicacion: { texto: '' } });
  showReportModal.value = true;
};
const closeReportModal = () => { showReportModal.value = false; };

const handleReportLost = async (reportData) => {
  isSubmitting.value = true;
  modalError.value = '';
  try {
    const petId = selectedPet.value._id;
    const payload = { estado: 'perdida', fechaPerdida: reportData.fechaPerdida, recompensa: reportData.recompensa, ultimaUbicacion: { texto: reportData.ultimaUbicacion.texto } };
    await PetService.updatePet(petId, payload);
    await Promise.all([fetchMisMascotas(), fetchMisReportes()]);
    closeReportModal();
    Swal.fire('Éxito', 'Mascota reportada como perdida.', 'success');
  } catch (err) { modalError.value = "Error al reportar."; } 
  finally { isSubmitting.value = false; }
};

const handleMarkAsFound = async (mascotaId) => {
  try {
    await PetService.updatePet(mascotaId, { estado: 'en-casa', fechaPerdida: null, recompensa: 0, ultimaUbicacion: {} });
    await Promise.all([fetchMisMascotas(), fetchMisReportes()]);
  } catch (err) { console.error("Error marcando como encontrada", err); }
};

// --- LÓGICA DE REPORTES GENÉRICOS (Crear nueva mascota/reporte) ---
const openGenericReportModal = () => {
  Object.assign(genericReportForm, { nombre: '', especie: '', raza: '', descripcion: '', ciudad: '', estado: 'adopcion', recompensa: 0, imagen: null });
  showGenericReportModal.value = true;
};
const closeGenericReportModal = () => { showGenericReportModal.value = false; };
const handleGenericImageSelection = (e) => { genericReportForm.imagen = e.target.files[0]; };

const handleGenericReportSubmit = async (reportData) => {
  isSubmitting.value = true;
  modalError.value = '';
  try {
    const formData = new FormData();
    formData.append('nombre', reportData.nombre);
    formData.append('especie', reportData.especie);
    formData.append('raza', reportData.raza);
    formData.append('descripcion', reportData.descripcion);
    formData.append('ciudad', reportData.ciudad);
    formData.append('recompensa', reportData.recompensa || 0);
    formData.append('estado', reportData.estado);
    if (genericReportForm.imagen) {
      formData.append('image', genericReportForm.imagen);
    }
    await PetService.addPet(formData);
    await fetchMisReportes();
    closeGenericReportModal();
    Swal.fire('Éxito', 'Reporte creado.', 'success');
  } catch (err) { modalError.value = "Error al crear reporte."; } 
  finally { isSubmitting.value = false; }
};

// --- LÓGICA DE PERFIL DE USUARIO ---
const openProfileModal = () => {
  if (!user.value) return;
  Object.assign(profileForm, { ...user.value, direccionDetallada: user.value.direccionDetallada || '' });
  profileImagePreviewUrl.value = user.value.fotoPerfil || '';
  profileImageFile.value = null;
  showProfileModal.value = true;
};
const closeProfileModal = () => { showProfileModal.value = false; };
const handleProfileImageSelection = (e) => {
  const file = e.target.files[0];
  if (file) { profileImageFile.value = file; profileImagePreviewUrl.value = URL.createObjectURL(file); }
};
const handleUpdateProfile = async (profileData) => {
  isSubmitting.value = true;
  modalError.value = '';
  try {
    const formData = new FormData();
    formData.append('nombre', profileData.nombre);
    formData.append('telefono', profileData.telefono);
    formData.append('ciudad', profileData.ciudad);
    formData.append('direccionDetallada', profileData.direccionDetallada);
    if (profileImageFile.value) {
      formData.append('image', profileImageFile.value);
    }
    const response = await AuthService.updateProfile(formData);
    user.value = response.data.user;
    authStore.login({ ...authStore.user, user: response.data.user });
    closeProfileModal();
    Swal.fire('Éxito', 'Perfil actualizado.', 'success');
  } catch (err) { modalError.value = "Error al actualizar."; } 
  finally { isSubmitting.value = false; }
};

// --- LÓGICA DE VISUALIZACIÓN Y MISC ---
const openPetDetailsModal = (mascota) => { selectedPetDetails.value = mascota; showPetDetailsModal.value = true; };
const closePetDetailsModal = () => { showPetDetailsModal.value = false; };
const openQrModal = async (petId) => { qrCodeUrl.value = ''; showQrModal.value = true; try { const res = await PetService.getPetQrCode(petId); qrCodeUrl.value = res.data.qrCode; } catch (err) { console.error("Error generando QR", err); }};
const closeQrModal = () => { showQrModal.value = false; };
const openImageViewer = (url) => { if (url) { imageToView.value = url; showImageViewer.value = true; } };
const closeImageViewer = () => { showImageViewer.value = false; };
const formattedJoinDate = computed(() => user.value?.createdAt ? new Date(user.value.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : '');
const logout = () => { authStore.logout(); router.push('/loginregister'); };
const handleImageSelection = (e) => { imageFile.value = e.target.files[0]; imagePreviewUrl.value = URL.createObjectURL(e.target.files[0]); };
</script>

<style scoped>
.profile-body { background-color: #F4F2F8; min-height: 100vh; font-family: 'Poppins', sans-serif; padding-top: 115px; padding-left: 40px; padding-right: 40px; padding-bottom: 40px; box-sizing: border-box; }
.feedback-container { text-align: center; padding: 50px; background-color: white; border-radius: 20px; max-width: 600px; margin: 50px auto; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
.feedback-container.error h2, .feedback-container.error p { color: #721c24; }
.profile-layout { display: grid; grid-template-columns: 320px 1fr; gap: 40px; max-width: 1400px; margin: 0 auto; }
.main-content { min-width: 0; }
.content-section { background-color: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); margin-bottom: 40px; }
:deep(.section-header) { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #F4F2F8; padding-bottom: 15px; }
:deep(.section-header h2) { margin: 0; }
:deep(.pets-grid), :deep(.reports-grid) { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
:deep(.pet-card), :deep(.report-card-active) { position: relative; border: 1px solid #f0f0f0; padding: 15px; border-radius: 15px; display: flex; flex-direction: column; background: #fafafa; }
:deep(.report-card-active) { background-color: #fff; border-left: 5px solid #ff6f00; box-shadow: 0 5px 15px rgba(0,0,0,0.07); }
:deep(.pet-photo) { width: 100%; height: 180px; object-fit: cover; border-radius: 10px; margin-bottom: 15px; background-color: #eee; cursor: zoom-in; }
:deep(.pet-info) { flex-grow: 1; text-align: left; }
:deep(.pet-card h3), :deep(.report-card-active h3) { margin: 0 0 5px 0; }
:deep(.pet-breed) { color: #666; font-size: 0.9rem; }
:deep(.pet-description) { margin-top: 10px; color: #333; font-size: 0.95rem; }
:deep(.pet-status) { position: absolute; top: 15px; right: 15px; padding: 4px 12px; font-size: 0.8rem; border-radius: 20px; font-weight: 600; text-transform: capitalize; }
:deep(.en-casa) { background-color: #e8f5e9; color: #2e7d32; }
:deep(.perdida) { background-color: #ffebee; color: #c62828; }
:deep(.adopcion) { background-color: #e8eaf6; color: #3f51b5; }
:deep(.encontrada) { background-color: #fff9c4; color: #f57f17; }
:deep(.pet-card-icons) { position: absolute; top: 15px; left: 15px; display: flex; gap: 8px; z-index: 1; }
:deep(.pet-actions) { margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap; }
:deep(.btn-action) { padding: 6px 12px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 500; }
:deep(.btn-action.report) { border-color: #c62828; color: #c62828; }
:deep(.btn-action.found) { border-color: #2e7d32; color: #2e7d32; }
:deep(.btn-action.qr) { border-color: #6c757d; color: #6c757d; }
:deep(.btn-icon) { padding: 6px 8px; border: 1px solid #ddd; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(2px); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
:deep(.btn-icon:hover) { background: white; transform: scale(1.1); }
:deep(.btn-icon.delete) { color: #c62828; }
:deep(.no-content-message) { text-align: center; padding: 40px; border: 2px dashed #e0e0e0; border-radius: 15px; }
:deep(.modal-overlay) { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 20px; box-sizing: border-box; overflow-y: auto; }
:deep(.modal-content) { background: white; padding: 30px 40px; border-radius: 15px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-sizing: border-box; animation: modal-fade-in 0.3s ease; }
@keyframes modal-fade-in { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
:deep(.detail-photo) { width: 100%; max-height: 250px; object-fit: cover; border-radius: 10px; margin-bottom: 20px; }
:deep(.modal-actions) { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
</style>