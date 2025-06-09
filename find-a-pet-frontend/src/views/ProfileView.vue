<template>
  <div class="profile-body">
    <!-- Estado de Carga -->
    <div v-if="loading" class="feedback-container">
      <p>Cargando tu perfil...</p>
      <!-- Podrías poner un spinner aquí -->
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
            <!-- Inicial del nombre del usuario como avatar -->
            <span>{{ user.nombre.charAt(0) }}</span>
          </div>
          <h2>{{ user.nombre }}</h2>
          <p class="user-email">{{ user.email }}</p>
          <hr>
          <div class="user-details">
            <p><strong>Teléfono:</strong> {{ user.telefono }}</p>
            <p><strong>Ciudad:</strong> {{ user.ciudad }}</p>
            <p><strong>Miembro desde:</strong> {{ formattedJoinDate }}</p>
          </div>
          <button @click="logout" class="btn btn-logout">Cerrar Sesión</button>
        </div>
      </aside>

      <!-- Columna Derecha: Reportes del Usuario -->
      <main class="reports-main">
        <div class="reports-header">
          <h1>Mis Reportes</h1>
          <button class="btn btn-primary">Crear Nuevo Reporte</button>
        </div>
        
        <div v-if="reports.length > 0" class="reports-grid">
          <!-- Iteramos sobre cada reporte del usuario -->
          <div v-for="report in reports" :key="report._id" class="report-card">
            <span class="report-tag" :class="`tag-${report.tipo}`">{{ report.tipo }}</span>
            <p class="report-description">{{ report.descripcion }}</p>
            <div class="report-footer">
              <span class="report-location">{{ report.ciudad }}</span>
              <span class="report-date">{{ new Date(report.fecha).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
        
        <div v-else class="no-reports-message">
          <p>¡Aún no has creado ningún reporte! Empieza a ayudar a la comunidad creando tu primer reporte.</p>
        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '@/services/authService';
import { authStore } from '@/store/authStore';

const router = useRouter();

// Variables reactivas para almacenar los datos
const user = ref(null);
const reports = ref([]);
const loading = ref(true); // Empezamos en modo carga por defecto
const error = ref('');

// `onMounted` es un "hook" de Vue que se ejecuta justo cuando el componente se ha montado en la página.
// Es el lugar perfecto para cargar datos iniciales.
onMounted(async () => {
  try {
    // 1. Llamamos a nuestro servicio para obtener los datos del perfil
    const response = await AuthService.getProfileData();

    // 2. Si todo sale bien, guardamos los datos en nuestras variables reactivas
    user.value = response.data.user;
    reports.value = response.data.reports;
  } catch (err) {
    // 3. Si hay un error (ej. token inválido), lo guardamos para mostrar un mensaje
    error.value = 'No se pudo cargar tu perfil. Tu sesión puede haber expirado.';
    // Forzamos el logout para limpiar el estado local
    authStore.logout();
  } finally {
    // 4. Se ejecuta siempre al final. Dejamos de mostrar el estado de carga.
    loading.value = false;
  }
});

// Una "propiedad computada" para formatear la fecha de registro. Es más limpio que hacerlo en el template.
const formattedJoinDate = computed(() => {
  if (user.value && user.value.fechaRegistro) {
    return new Date(user.value.fechaRegistro).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return '';
});

// Función para cerrar sesión
const logout = () => {
  authStore.logout();
  router.push('/loginregister');
};
</script>

<style scoped>
/* Estilos para el contenedor principal */
.profile-body {
  background-color: #F4F2F8;
  min-height: calc(100vh - 75px); /* Restamos la altura del navbar */
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
.feedback-container.error h2 { color: #721c24; }
.feedback-container.error p { color: #721c24; }


/* Layout principal del perfil */
.profile-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Columna izquierda: Sidebar del usuario */
.user-sidebar .user-card {
  background-color: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  text-align: center;
  position: sticky; /* Para que se quede fija al hacer scroll */
  top: 100px; /* Espacio desde el navbar */
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

/* Columna derecha: Contenido principal */
.reports-main .reports-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.reports-header h1 {
  margin: 0;
}
.btn.btn-primary {
  background-color: #f7de8e;
  color: #8b7bab;
  font-weight: 700;
  padding: 12px 25px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}
.report-card {
  background-color: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}
.report-tag {
  align-self: flex-start;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 15px;
}
.tag-perdido { background-color: #ffebee; color: #c62828; }
.tag-encontrado { background-color: #e3f2fd; color: #1565c0; }
.tag-adopcion { background-color: #e8f5e9; color: #2e7d32; }

.report-description {
  flex-grow: 1; /* Hace que la descripción ocupe el espacio disponible */
  color: #333;
}

.report-footer {
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #888;
}

.no-reports-message {
  background-color: white;
  border-radius: 15px;
  padding: 50px;
  text-align: center;
  border: 2px dashed #ddd;
}
.no-reports-message p {
  max-width: 400px;
  margin: 0 auto 20px auto;
  line-height: 1.6;
}
</style>