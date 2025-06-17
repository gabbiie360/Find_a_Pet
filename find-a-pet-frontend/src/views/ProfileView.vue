<template>
  <div class="profile-body">
    <!-- Estados de Carga y Error -->
    <div v-if="loading" class="feedback-container">
      <h2>Cargando tu perfil...</h2>
    </div>
    <div v-else-if="error" class="feedback-container error">
      <h2>Oops, algo salió mal</h2>
      <p>{{ error }}</p>
    </div>
    
    <!-- Contenido Principal -->
    <div v-else-if="user" class="profile-layout">
      <UserSidebar
        :user="user"
        :placeholderImage="placeholderImage"
        :formattedJoinDate="formattedJoinDate"
        @openImageViewer="openImageViewer"
        @openProfileModal="openProfileModal"
        @logout="logout"
      />
      <main class="main-content">
        <!-- Sección de Mascotas con el evento deletePet conectado a la función corregida -->
        <MyPetsSection
          :mascotas="mascotas"
          :placeholderImage="placeholderImage"
          @openPetModal="openPetModal"
          @deletePet="handleDeletePet"
          @openReportModal="openReportModal"
          @openQrModal="openQrModal"
          @openImageViewer="openImageViewer"
          @openPetDetailsModal="openPetDetailsModal"
        />
        <!-- Sección de Reportes -->
        <MyReportsSection
          :activeReports="activeReports"
          :placeholderImage="placeholderImage"
          @openGenericReportModal="openGenericReportModal"
          @openImageViewer="openImageViewer"
          @openEditReportModal="openEditReportModal"
          @deleteReport="deleteReport"
          @openQrModal="openQrModal"
          @openReportDetailsModal="openReportDetailsModal"
          @handleMarkAsFound="handleMarkAsFound"
        />
      </main>
    </div>

    <!-- ========= INICIO DE SECCIÓN DE MODALES ========= -->
    <PetModal
      v-if="showPetModal"
      :isEditing="isEditing"
      :pet="petForm"
      :imagePreviewUrl="imagePreviewUrl"
      :isSubmitting="isSubmitting"
      :errorMessage="modalError"
      @save="handleSavePet"
      @cancel="closePetModal"
      @imageSelected="handleImageSelection"
    />
    <ReportModal
      v-if="showReportModal"
      :pet="selectedPet"
      :reportForm="reportForm"
      :isSubmitting="isSubmitting"
      :errorMessage="modalError"
      @submit="handleReportLost"
      @cancel="closeReportModal"
    />
    <ReportDetailsModal
      v-if="showReportDetailsModal"
      :report="selectedReport"
      @close="closeReportDetailsModal"
    />
    <EditReportModal
      v-if="showEditReportModal"
      :report="editingReport"
      @save="handleUpdateReport"
      @cancel="closeEditReportModal"
    />
    <GenericReportModal
      v-if="showGenericReportModal"
      :report="genericReport"
      :isSubmitting="isSubmitting"
      @save="handleGenericReportSubmit"
      @cancel="closeGenericReportModal"
      @image-selected="handleGenericImageSelection"
    />
    <PetDetailsModal 
      v-if="showPetDetailsModal"
      :pet="selectedPetDetails"
      @close="closePetDetailsModal"
    />
    <ProfileModal
      v-if="showProfileModal"
      :profile="profileForm"
      :imagePreviewUrl="profileImagePreviewUrl"
      :errorMessage="modalError"
      @save="handleUpdateProfile"
      @cancel="closeProfileModal"
      @imageSelected="handleProfileImageSelection"
    />
    <QrModal
      v-if="showQrModal"
      :qrCodeUrl="qrCodeUrl"
      @close="closeQrModal"
    />
    <ImageViewerModal
      v-if="showImageViewer"
      :imageUrl="imageToView"
      @close="closeImageViewer"
    />
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
import ReportDetailsModal from '@/components/profileComponents/modals/ReportDetailsModal.vue';
import EditReportModal from '@/components/profileComponents/modals/EditReportModal.vue';
import GenericReportModal from '@/components/profileComponents/modals/GenericReportModal.vue';
import QrModal from '@/components/profileComponents/modals/QrModal.vue';
import ImageViewerModal from '@/components/profileComponents/modals/ImageViewerModal.vue';
import PetDetailsModal from '@/components/profileComponents/modals/PetDetailsModal.vue';
import ProfileModal from '@/components/profileComponents/modals/ProfileModal.vue';

// Definición de todas las variables reactivas
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
const showQrModal = ref(false);
const qrCodeUrl = ref('');
const isEditing = ref(false);
const showImageViewer = ref(false);
const imageToView = ref('');
const showReportDetailsModal = ref(false);
const showEditReportModal = ref(false);
const showGenericReportModal = ref(false);
const showPetDetailsModal = ref(false);

// Modelos de datos para formularios
const petForm = reactive({ _id: null, nombre: '', especie: '', raza: '', descripcion: '', fotos: [] });
const reportForm = reactive({ fechaPerdida: '', ubicacionTexto: '', recompensa: 0 });
const profileForm = reactive({ nombre: '', email: '', telefono: '', direccionDetallada: '', fotoPerfil: '' });
const genericReport = reactive({ tipo: '', nombre: '', especie: '', raza: '', ciudad: '', descripcion: '', recompensa: 0, imagen: null, fechaPerdida: '' });

// Variables para manejar datos seleccionados
const selectedPet = ref(null);
const selectedReport = ref({});
const editingReport = ref(null);
const selectedPetDetails = ref(null);

// Variables para manejo de archivos
const imageFile = ref(null);
const imagePreviewUrl = ref('');
const profileImageFile = ref(null);
const profileImagePreviewUrl = ref('');

// --- Lógica de Carga Inicial ---
onMounted(async () => {
  try {
    const profileResponse = await AuthService.getProfileData();
    user.value = profileResponse.data.user;
    // Cargar mascotas y reportes en paralelo para mejorar el rendimiento
    await Promise.all([fetchMisMascotas(), fetchMyReports()]);
  } catch (err) {
    error.value = 'No se pudo cargar tu perfil. Tu sesión puede haber expirado.';
    // Si falla la carga del perfil, cerramos sesión y redirigimos
    authStore.logout();
    router.push('/loginregister');
  } finally {
    loading.value = false;
  }
});

const fetchMisMascotas = async () => {
  try {
    const res = await PetService.getMyPets();
    mascotas.value = res.data; // La respuesta de axios ya está en res.data
  } catch (err) { 
    console.error("Error cargando mascotas:", err); 
    // Opcional: podrías mostrar un error no bloqueante al usuario
  }
};

const fetchMyReports = async () => {
  try {
    const res = await ReportService.getMyReports();
    myReports.value = res.data || [];
  } catch (err) { 
    console.error("Error al cargar reportes:", err); 
  }
};

// --- Lógica de Mascotas (CRUD) ---
const openPetModal = (mascota = null) => {
  isEditing.value = !!mascota;
  Object.assign(petForm, mascota ? { ...mascota } : { _id: null, nombre: '', especie: '', raza: '', descripcion: '', fotos: [] });
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
    let payload = { ...petDataFromModal };
    if (imageFile.value) {
      const res = await PetService.uploadPetImage(imageFile.value);
      payload.fotos = [res.data.secure_url];
    }
    
    if (isEditing.value) {
      await PetService.updatePet(payload._id, payload);
    } else {
      await PetService.addPet(payload);
    }
    
    await fetchMisMascotas();
    closePetModal();
    Swal.fire('¡Éxito!', `Mascota ${isEditing.value ? 'actualizada' : 'registrada'} correctamente.`, 'success');
  } catch (err) {
    console.error('Error al guardar mascota:', err);
    modalError.value = 'Error al guardar. Por favor, revisa los datos.';
  } finally {
    isSubmitting.value = false;
  }
};

// =========================================================================
// FUNCIÓN CORREGIDA PARA ELIMINAR MASCOTA
// =========================================================================
const handleDeletePet = async (petId, petName) => {
  const result = await Swal.fire({
    title: `¿Eliminar a ${petName}?`,
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, ¡eliminar!',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      // Llamada correcta al método del servicio
      await PetService.deletePet(petId);
      
      // Actualiza la lista de mascotas en la UI sin necesidad de volver a llamar al servidor
      mascotas.value = mascotas.value.filter(pet => pet._id !== petId);
      
      // Opcional: Si eliminar una mascota debe eliminar sus reportes, refresca también los reportes
      // await fetchMyReports(); 
      
      Swal.fire('¡Eliminada!', `${petName} ha sido eliminada.`, 'success');
    } catch (err) {
      console.error("Error al eliminar mascota:", err);
      Swal.fire('Error', 'No se pudo eliminar la mascota. Inténtalo de nuevo.', 'error');
    }
  }
};

// --- Lógica de Reportes (CRUD) ---
const activeReports = computed(() => myReports.value.filter(r => ['perdida', 'encontrada', 'adopcion'].includes(r.tipo)));

const openEditReportModal = (reporte) => {
  const base = { _id: null, nombre: '', ciudad: '', descripcion: '', especie: '', raza: '', recompensa: 0, tipo: '', ultimaUbicacion: { texto: '', coordinates: [0, 0] } };
  editingReport.value = { ...base, ...reporte, ultimaUbicacion: { ...base.ultimaUbicacion, ...(reporte.ultimaUbicacion || {}) } };
  showEditReportModal.value = true;
};
const closeEditReportModal = () => { showEditReportModal.value = false; editingReport.value = null; };

const handleUpdateReport = async (updatedReport) => {
  if (!updatedReport) return;
  isSubmitting.value = true;
  try {
    await ReportService.updateReport(updatedReport._id, updatedReport);
    await fetchMyReports();
    closeEditReportModal();
    Swal.fire('Éxito', 'Reporte actualizado correctamente', 'success');
  } catch (err) {
    console.error('Error actualizando reporte:', err);
    Swal.fire('Error', 'No se pudo actualizar el reporte.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const deleteReport = async (reportId) => {
  const confirm = await Swal.fire({
    title: '¿Eliminar reporte?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (confirm.isConfirmed) {
    try {
      await ReportService.deleteReport(reportId);
      await fetchMyReports();
      Swal.fire('Eliminado', 'El reporte fue eliminado con éxito.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo eliminar el reporte.', 'error');
    }
  }
};

const handleMarkAsFound = async (petId) => {
  try {
    await PetService.markAsFound(petId);
    await fetchMisMascotas();
    await fetchMyReports();
  } catch (err) { console.error("Error marcando como encontrada", err); }
};

const openReportModal = (mascota) => {
  selectedPet.value = mascota;
  showReportModal.value = true;
};

const closeReportModal = () => {
  showReportModal.value = false;
  selectedPet.value = null;
};

const handleReportLost = async (reportDataFromModal) => {
    isSubmitting.value = true;
    modalError.value = '';
    try {
        const formData = new FormData();
        formData.append('nombre', reportDataFromModal.nombre);
        formData.append('especie', reportDataFromModal.especie);
        formData.append('raza', reportDataFromModal.raza);
        formData.append('descripcion', `Reporte de pérdida para ${reportDataFromModal.nombre}.`);
        formData.append('ciudad', reportDataFromModal.ciudad || user.value.ciudad);
        formData.append('tipo', 'perdida');
        formData.append('fechaPerdida', reportDataFromModal.fechaPerdida);
        formData.append('recompensa', reportDataFromModal.recompensa || 0);
        formData.append('ultimaUbicacionTexto', reportDataFromModal.ultimaUbicacion.texto);
        formData.append('mascotaOriginalId', reportDataFromModal.mascotaId);

        await ReportService.createReportWithImage(formData);
        await PetService.updatePet(reportDataFromModal.mascotaId, { estado: 'perdida' });
        await fetchMisMascotas();
        await fetchMyReports();
        
        closeReportModal();
        Swal.fire('¡Reporte Creado!', `${reportDataFromModal.nombre} ha sido reportada como perdida.`, 'success');

    } catch(err) {
        console.error("Error al reportar mascota como perdida:", err);
        modalError.value = 'Error al generar el reporte.';
    } finally {
        isSubmitting.value = false;
    }
};

// --- Lógica de Modales Genéricos y de Usuario ---
const openGenericReportModal = () => { showGenericReportModal.value = true; };
const closeGenericReportModal = () => { showGenericReportModal.value = false; Object.assign(genericReport, { tipo: '', nombre: '', especie: '', raza: '', ciudad: '', descripcion: '', recompensa: 0, imagen: null, fechaPerdida: '' }); };

const handleGenericReportSubmit = async () => {
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    Object.keys(genericReport).forEach(key => {
      if(key === 'imagen' && genericReport[key]){
        formData.append('imagen', genericReport.imagen);
      } else if (genericReport[key] !== null) {
        formData.append(key, genericReport[key]);
      }
    });

    await ReportService.createReportWithImage(formData);
    await fetchMyReports();
    closeGenericReportModal();
    Swal.fire('Éxito', '¡Reporte creado con éxito!', 'success');
  } catch (err) {
    console.error('Error al crear reporte:', err);
    Swal.fire('Error', 'No se pudo crear el reporte.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};
const handleGenericImageSelection = (e) => { const file = e.target.files[0]; if (file) genericReport.imagen = file; };


// --- Lógica de Modales de Visualización ---
const openPetDetailsModal = (mascota) => {
  selectedPetDetails.value = mascota;
  showPetDetailsModal.value = true;
};
const closePetDetailsModal = () => { showPetDetailsModal.value = false; };

const openReportDetailsModal = (reporte) => {
  selectedReport.value = reporte;
  showReportDetailsModal.value = true;
};
const closeReportDetailsModal = () => { showReportDetailsModal.value = false; };

const openQrModal = async (petId) => {
  qrCodeUrl.value = '';
  showQrModal.value = true;
  try {
    const res = await PetService.getPetQrCode(petId);
    qrCodeUrl.value = res.data.qrCode;
  } catch (err) { console.error("Error generando QR", err); }
};
const closeQrModal = () => { showQrModal.value = false; };

const openImageViewer = (imageUrl) => { if (imageUrl) { imageToView.value = imageUrl; showImageViewer.value = true; }};
const closeImageViewer = () => { showImageViewer.value = false; };

// --- Lógica de Perfil de Usuario ---
const openProfileModal = () => {
  if (!user.value) return;
  Object.assign(profileForm, { ...user.value });
  profileImagePreviewUrl.value = user.value.fotoPerfil || '';
  profileImageFile.value = null;
  modalError.value = '';
  showProfileModal.value = true;
};

const closeProfileModal = () => { showProfileModal.value = false; };

const handleUpdateProfile = async (profileDataFromModal) => {
  isSubmitting.value = true;
  modalError.value = '';
  try {
    let payload = { ...profileDataFromModal };

    if (profileImageFile.value) {
      const res = await PetService.uploadPetImage(profileImageFile.value); 
      payload.fotoPerfil = res.data.secure_url;
    }

    const response = await AuthService.updateProfile(payload);
    
    // Actualizar el estado local y el store
    user.value = response.data.user;
    authStore.setUser(response.data.user);

    closeProfileModal();
    Swal.fire('¡Éxito!', 'Tu perfil ha sido actualizado.', 'success');

  } catch (err) {
    console.error("Error actualizando perfil:", err);
    modalError.value = "No se pudo actualizar el perfil.";
  } finally {
    isSubmitting.value = false;
  }
};

// --- Lógica de Manejo de Imágenes y Misceláneos ---
const handleProfileImageSelection = (event) => {
  const file = event.target.files[0];
  if (file) {
    profileImageFile.value = file;
    profileImagePreviewUrl.value = URL.createObjectURL(file);
  }
};

const handleImageSelection = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    imagePreviewUrl.value = URL.createObjectURL(file);
  }
};

const formattedJoinDate = computed(() => 
  user.value?.fechaRegistro 
    ? new Date(user.value.fechaRegistro).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) 
    : ''
);

const logout = () => {
  authStore.logout();
  router.push('/loginregister');
};
</script>


<style scoped>
/* ESTILOS COMPLETOS Y CORREGIDOS PARA TARJETAS Y MODALES */

/* Estilos de la página principal */
.profile-body { background-color: #F4F2F8; min-height: 100vh; font-family: 'Poppins', sans-serif; padding-top: 115px; padding-left: 40px; padding-right: 40px; padding-bottom: 40px; box-sizing: border-box; }
.feedback-container { text-align: center; padding: 50px; background-color: white; border-radius: 20px; max-width: 600px; margin: 50px auto; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
.feedback-container.error h2, .feedback-container.error p { color: #721c24; }
.profile-layout { display: grid; grid-template-columns: 320px 1fr; gap: 40px; max-width: 1400px; margin: 0 auto; }
.main-content .content-section { background-color: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); margin-bottom: 40px; }

:deep(.section-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #F4F2F8;
  padding-bottom: 15px;
}
:deep(.section-header h2) { margin: 0; }
/* ========================================================================= */
/* ESTILOS PARA COMPONENTES HIJOS (TARJETAS)                                 */
/* ========================================================================= */

:deep(.pets-grid), :deep(.reports-grid) { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
:deep(.pet-card), :deep(.report-card-active) { position: relative; border: 1px solid #f0f0f0; padding: 15px; border-radius: 15px; display: flex; flex-direction: column; background: #fafafa; }
:deep(.report-card-active) { background-color: #fff; border-left: 5px solid #ff6f00; box-shadow: 0 5px 15px rgba(0,0,0,0.07); }
:deep(.pet-photo) { width: 100%; height: 180px; object-fit: cover; border-radius: 10px; margin-bottom: 15px; background-color: #eee; cursor: zoom-in; }
:deep(.pet-info) { flex-grow: 1; }
:deep(.pet-card h3), :deep(.report-card-active h3) { margin: 0 0 5px 0; }
:deep(.pet-breed) { color: #666; font-size: 0.9rem; }
:deep(.pet-description) { margin-top: 10px; color: #333; font-size: 0.95rem; }
:deep(.pet-status) { position: absolute; top: 15px; right: 15px; padding: 4px 12px; font-size: 0.8rem; border-radius: 20px; font-weight: 600; text-transform: capitalize; }
:deep(.en-casa) { background-color: #e8f5e9; color: #2e7d32; }
:deep(.perdida) { background-color: #ffebee; color: #c62828; }
:deep(.pet-card-icons) { position: absolute; top: 15px; left: 15px; display: flex; gap: 8px; z-index: 1; }
:deep(.pet-actions) { margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap; }
:deep(.btn-action) { padding: 6px 12px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 500; }
:deep(.btn-action.found) { border-color: #2e7d32; color: #2e7d32; }
:deep(.btn-action.qr) { border-color: #6c757d; color: #6c757d; }
:deep(.btn-icon) { padding: 6px 8px; border: 1px solid #ddd; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(2px); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
:deep(.btn-icon:hover) { background: white; transform: scale(1.1); }
:deep(.btn-icon.delete) { color: #c62828; }
:deep(.no-content-message) { text-align: center; padding: 40px; border: 2px dashed #e0e0e0; border-radius: 15px; }


/* ========================================================================= */
/* ESTILOS PARA TODOS LOS MODALES (AHORA CON :DEEP)                          */
/* ========================================================================= */
:deep(.modal-overlay) { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 20px; box-sizing: border-box; overflow-y: auto; }
:deep(.modal-content) { background: white; padding: 30px 40px; border-radius: 15px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-sizing: border-box; animation: modal-fade-in 0.3s ease; }
@keyframes modal-fade-in { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
:deep(.detail-photo) { width: 100%; max-height: 250px; object-fit: cover; border-radius: 10px; margin-bottom: 20px; }
:deep(.modal-content.qr-modal) { text-align: center; }
:deep(.qr-modal img) { max-width: 80%; border: 1px solid #ddd; }
:deep(.modal-content h2) { margin-top: 0; }
:deep(.modal-content form .form-grid) { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
:deep(.modal-content form .form-group) { margin-bottom: 15px; }
:deep(.modal-content form input), :deep(.modal-content form textarea), :deep(.modal-content form select) { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; font-family: 'Poppins', sans-serif; }
:deep(.modal-content form label) { font-weight: 500; margin-bottom: 5px; display: block; }
:deep(.image-upload-field) { margin-top: 15px; }
:deep(.image-preview) { max-width: 100px; max-height: 100px; margin-top: 10px; border-radius: 5px; border: 1px solid #ddd; object-fit: cover; }
:deep(.modal-actions) { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
:deep(.btn-secondary) { background: #eee; color: #333; padding: 12px 25px; border-radius: 8px; border: none; cursor: pointer; }
:deep(.btn-primary.report-confirm) { background-color: #c62828; color: white; }
:deep(.error-message) { color: #c62828; margin-top: 15px; text-align: center; }
:deep(.modal-overlay.image-viewer) { background-color: rgba(0, 0, 0, 0.85); display: flex; align-items: center; justify-content: center; cursor: zoom-out; }
:deep(.image-viewer-content) { position: relative; }
:deep(.image-viewer-content img) { display: block; max-width: 90vw; max-h: 90vh; width: auto; height: auto; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); cursor: default; }
:deep(.image-viewer-content .close-button) { position: absolute; top: 10px; right: 10px; width: 40px; height: 40px; border-radius: 50%; background-color: rgba(0, 0, 0, 0.5); color: white; border: 2px solid white; font-size: 1.8rem; line-height: 36px; text-align: center; cursor: pointer; transition: transform 0.2s, background-color 0.2s; }
:deep(.image-viewer-content .close-button:hover) { transform: scale(1.1); background-color: rgba(200, 0, 0, 0.8); }
</style>