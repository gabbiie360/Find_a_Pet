<template>
  <div class="profile-body">
    <!-- 1. Muestra un mensaje mientras se cargan los datos -->
    <div v-if="loading" class="feedback-container">
      <h2>Cargando tu perfil...</h2>
      <!-- Podrías poner un spinner de carga aquí si quieres -->
    </div>

    <!-- 2. Muestra un mensaje de error si la carga falla -->
    <div v-else-if="error" class="feedback-container error">
      <h2>Oops, algo salió mal</h2>
      <p>{{ error }}</p>
    </div>

    <!-- 3. Solo muestra el contenido principal CUANDO 'user' tiene datos -->
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
        <MyPetsSection
          :mascotas="mascotas"
          :placeholderImage="placeholderImage"
          @openPetModal="openPetModal"
          @openReportModal="openReportModal"
          @openQrModal="openQrModal"
          @openImageViewer="openImageViewer"
          @openReportDetailsModal="openReportDetailsModal"
        />

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

    <!-- Los modales se quedan fuera del renderizado condicional, ya que se activan con v-if -->
    <PetModal
      v-if="showPetModal"
      :isEditing="isEditing"
      :pet="petForm"
      :imagePreview="imagePreviewUrl"
      :isSubmitting="isSubmitting"
      :errorMessage="modalError"
      @save="handleSavePet"
      @cancel="closePetModal"
      @image-selected="handleImageSelection"
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

import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/authService'
import PetService from '@/services/petService'
import ReportService from '@/services/reportService'
import { authStore } from '@/store/authStore'
import placeholderImage from '@/assets/placeholder-pet.png'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import UserSidebar from '@/components/profileComponents/UserSidebar.vue'
import MyPetsSection from '@/components/profileComponents/MyPetsSection.vue'
import MyReportsSection from '@/components/profileComponents/MyReportsSection.vue'

import PetModal from '@/components/profileComponents/modals/PetModal.vue'
import ReportModal from '@/components/profileComponents/modals/ReportModal.vue'
import ReportDetailsModal from '@/components/profileComponents/modals/ReportDetailsModal.vue'
import EditReportModal from '@/components/profileComponents/modals/EditReportModal.vue'
import GenericReportModal from '@/components/profileComponents/modals/GenericReportModal.vue'
import QrModal from '@/components/profileComponents/modals/QrModal.vue'
import ImageViewerModal from '@/components/profileComponents/modals/ImageViewerModal.vue'



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
const showImageViewer = ref(false);
const imageToView = ref('');

const petForm = reactive({ _id: null, nombre: '', especie: '', raza: '', descripcion: '', fotos: [] });
const reportForm = reactive({ fechaPerdida: '', ubicacionTexto: '', recompensa: 0 });
const profileForm = reactive({ nombre: '', telefono: '', ciudad: '', fotoPerfil: '' });

const imageFile = ref(null);
const imagePreviewUrl = ref('');
const profileImageFile = ref(null);
const profileImagePreviewUrl = ref('');

const showReportDetailsModal = ref(false);
const selectedReport = ref({});

const openReportDetailsModal = (reporte) => {
  selectedReport.value = { ...reporte };
  showReportDetailsModal.value = true;
};

const closeReportDetailsModal = () => {
  showReportDetailsModal.value = false;
  selectedReport.value = {};
};


const myReports = ref([]);

const fetchMyReports = async () => {
  try {
    const res = await ReportService.getMyReports();
    myReports.value = res.data || [];
  } catch (err) {
    console.error("Error al cargar reportes:", err);
  }
};

const handleUpdateReport = async () => {
  try {
    await ReportService.updateReport(editingReport.value._id, editingReport.value);
    await fetchMyReports();
    closeEditReportModal();
    Swal.fire('Éxito', 'Reporte actualizado', 'success');
  } catch (err) {
    console.error('Error actualizando reporte:', err);
    Swal.fire('Error', 'No se pudo actualizar el reporte.', 'error');
  }
};


const showGenericReportModal = ref(false);
const genericReport = reactive({
  tipo: '',
  nombre: '',
  especie: '',
  raza: '',
  ciudad: '',
  descripcion: '',
  recompensa: 0,
  imagen: null,
  fechaPerdida: '',
});


const openGenericReportModal = () => {
  showGenericReportModal.value = true;
};

const closeGenericReportModal = () => {
  showGenericReportModal.value = false;
  Object.assign(genericReport, {
    tipo: '', ciudad: '', descripcion: '', imagen: null
  });
};

const handleGenericImageSelection = (e) => {
  const file = e.target.files[0];
  if (file) genericReport.imagen = file;
};

const handleGenericReportSubmit = async () => {
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append('tipo', genericReport.tipo);
    formData.append('nombre', genericReport.nombre);
    formData.append('especie', genericReport.especie);
    formData.append('raza', genericReport.raza);
    formData.append('descripcion', genericReport.descripcion);
    formData.append('ciudad', genericReport.ciudad);
    formData.append('recompensa', genericReport.recompensa || 0);
    if (genericReport.imagen) {
      formData.append('imagen', genericReport.imagen);
    }
    if (genericReport.tipo === 'perdida' && genericReport.fechaPerdida) {
  formData.append('fechaPerdida', genericReport.fechaPerdida);
}

    if (genericReport.ultimaUbicacionTexto) {
  formData.append('ultimaUbicacionTexto', genericReport.ultimaUbicacionTexto);
}
if (genericReport.latitud && genericReport.longitud) {
  formData.append('latitud', genericReport.latitud);
  formData.append('longitud', genericReport.longitud);
}


    await ReportService.createReportWithImage(formData);

    await fetchMisMascotas(); // refrescar mascotas
    await fetchMyReports();   // 🔄 recargar los reportes del usuario

    closeGenericReportModal();
    Swal.fire('Éxito', '¡Reporte creado con éxito!', 'success');

  } catch (err) {
    console.error('Error al crear reporte:', err);
    Swal.fire('Error', 'No se pudo crear el reporte.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const editingReport = ref(null);
const showEditReportModal = ref(false);

const openEditReportModal = (reporte) => {
  editingReport.value = {
    _id: reporte._id,
    nombre: reporte.nombre || '',
    ciudad: reporte.ciudad || '',
    ultimaUbicacion: {
      texto: reporte.ultimaUbicacion?.texto || '',
      coordinates: reporte.ultimaUbicacion?.coordinates || [0, 0]
    },
    descripcion: reporte.descripcion || '',
    especie: reporte.especie || '',
    raza: reporte.raza || '',
    recompensa: reporte.recompensa || 0
  };

  showEditReportModal.value = true;
};



const closeEditReportModal = () => {
  showEditReportModal.value = false;
  editingReport.value = null;
};


const deleteReport = async (reportId) => {
  const confirm = await Swal.fire({
    title: '¿Eliminar reporte?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (confirm.isConfirmed) {
    try {
      await ReportService.deleteReport(reportId);
      await fetchMyReports(); // recargar
      Swal.fire('Eliminado', 'El reporte fue eliminado con éxito.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo eliminar el reporte.', 'error');
    }
  }
};


onMounted(async () => {
  try {
    const profileResponse = await AuthService.getProfileData();
    user.value = profileResponse.data.user;
    await fetchMisMascotas();
    await fetchMyReports(); 
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
const closePetModal = () => { showPetModal.value = false; modalError.value = ''; imageFile.value = null; imagePreviewUrl.value = ''; };

const openReportModal = (mascota) => { selectedPet.value = mascota; showReportModal.value = true; };
const closeReportModal = () => { showReportModal.value = false; modalError.value = ''; };

const openProfileModal = (event) => {
    event.stopPropagation();
    Object.assign(profileForm, user.value);
    profileImagePreviewUrl.value = user.value.fotoPerfil || '';
    showProfileModal.value = true;
};
const closeProfileModal = () => { showProfileModal.value = false; profileImageFile.value = null; profileImagePreviewUrl.value = ''; };

const openQrModal = async (petId) => {
    qrCodeUrl.value = '';
    showQrModal.value = true;
    try {
        const res = await PetService.getPetQrCode(petId);
        qrCodeUrl.value = res.data.qrCode;
    } catch (err) { console.error("Error generando QR", err); }
};
const closeQrModal = () => { showQrModal.value = false; };

const openImageViewer = (imageUrl) => {
  if (imageUrl) { imageToView.value = imageUrl; showImageViewer.value = true; }
};
const closeImageViewer = () => { showImageViewer.value = false; };

const handleImageSelection = (event) => { const file = event.target.files[0]; if (file) { imageFile.value = file; imagePreviewUrl.value = URL.createObjectURL(file); } };
const handleProfileImageSelection = (event) => { const file = event.target.files[0]; if (file) { profileImageFile.value = file; profileImagePreviewUrl.value = URL.createObjectURL(file); } };

const activeReports = computed(() =>
  myReports.value.filter(r => ['perdida', 'encontrada', 'adopcion'].includes(r.tipo))

);

const formattedJoinDate = computed(() => {
  if (user.value?.fechaRegistro) {
    return new Date(user.value.fechaRegistro).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return '';
});

const logout = () => { authStore.logout(); router.push('/login'); };
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
:deep(.image-viewer-content img) { display: block; max-width: 90vw; max-height: 90vh; width: auto; height: auto; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); cursor: default; }
:deep(.image-viewer-content .close-button) { position: absolute; top: 10px; right: 10px; width: 40px; height: 40px; border-radius: 50%; background-color: rgba(0, 0, 0, 0.5); color: white; border: 2px solid white; font-size: 1.8rem; line-height: 36px; text-align: center; cursor: pointer; transition: transform 0.2s, background-color 0.2s; }
:deep(.image-viewer-content .close-button:hover) { transform: scale(1.1); background-color: rgba(200, 0, 0, 0.8); }
</style>