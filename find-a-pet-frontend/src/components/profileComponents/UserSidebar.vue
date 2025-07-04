<template>
  <aside class="user-sidebar">
    <div class="user-card">
      <div class="user-avatar" @click="openImageViewer(user.fotoPerfil || placeholderImage)">
        <img v-if="user.fotoPerfil" :src="user.fotoPerfil" alt="Foto de perfil">
        <span v-else>{{ user.nombre.charAt(0).toUpperCase() }}</span>
        <div class="avatar-overlay" @click.stop="openProfileModal">Editar</div>
      </div>
      <h2>{{ user.nombre }}</h2>
      <p class="user-email">{{ user.email }}</p>
      <hr />
      <div class="user-details">
        <p><strong>Teléfono:</strong> {{ user.telefono }}</p>
        <p><strong>Ciudad:</strong> {{ user.ciudad }}</p>
        <p><strong>Miembro desde:</strong> {{ formattedJoinDate }}</p>
      </div>
      <button @click="logout" class="btn-logout">Cerrar Sesión</button>
    </div>
  </aside>
</template>

<script setup>
defineProps(['user', 'placeholderImage', 'formattedJoinDate'])

// ÚNICA LLAMADA a defineEmits, asignada a la constante 'emit'
const emit = defineEmits(['logout', 'openImageViewer', 'openProfileModal'])

// Las funciones que usan 'emit' ahora funcionarán perfectamente
const openImageViewer = (url) => emit('openImageViewer', url)
const openProfileModal = () => emit('openProfileModal')
const logout = () => emit('logout')
</script>


<style scoped>
/* ESTILOS COMPLETOS Y CORREGIDOS */
.profile-body {
  background-color: #F4F2F8;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  padding-top: 115px; /* 75px de navbar + 40px de espacio */
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 40px;
  box-sizing: border-box;
}

.feedback-container { text-align: center; padding: 50px; background-color: white; border-radius: 20px; max-width: 600px; margin: 50px auto; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
.feedback-container.error h2, .feedback-container.error p { color: #721c24; }
.profile-layout { display: grid; grid-template-columns: 320px 1fr; gap: 40px; max-width: 1400px; margin: 0 auto; }
.user-sidebar .user-card { background-color: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); text-align: center; position: sticky; top: 115px; }

.user-avatar { width: 120px; height: 120px; border-radius: 50%; background-color: #b098d6; color: white; font-size: 3.5rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; border: 4px solid #f7de8e; position: relative; cursor: zoom-in; overflow: hidden; }
.user-avatar img { width: 100%; height: 100%; object-fit: cover; }
.user-avatar .avatar-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); color: white; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; font-size: 1rem; cursor: pointer; }
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
.pet-photo { width: 100%; height: 180px; object-fit: cover; border-radius: 10px; margin-bottom: 15px; background-color: #eee; cursor: zoom-in; }
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

.detail-photo {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
}


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

/* ==================================================================== */
/*          NUEVOS ESTILOS DEFINITIVOS PARA EL VISOR DE IMÁGENES        */
/* ==================================================================== */
.modal-overlay.image-viewer {
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}

/* Contenedor relativo para posicionar el botón de cierre */
.image-viewer-content {
  position: relative;
  /* El contenedor no necesita tamaño, dejará que la imagen lo defina */
}

/* La imagen es la que manda */
.image-viewer-content img {
  display: block;
  /* La imagen se ajustará para caber dentro de estos límites */
  max-width: 90vw;   /* No puede ser más ancha que el 90% de la ventana */
  max-height: 90vh;  /* No puede ser más alta que el 90% de la ventana */
  width: auto;       /* Mantiene la proporción */
  height: auto;      /* Mantiene la proporción */
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  cursor: default;
}

/* El botón de cierre se posiciona relativo a la imagen */
.image-viewer-content .close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparente para integrarse mejor */
  color: white;
  border: 2px solid white;
  font-size: 1.8rem;
  line-height: 36px; /* Ajuste para centrar la X */
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.image-viewer-content .close-button:hover {
    transform: scale(1.1);
    background-color: rgba(200, 0, 0, 0.8);
}
</style>