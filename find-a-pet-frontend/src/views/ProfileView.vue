<template>
  <div class="profile-body">
    <div v-if="loading" class="loading-container">
      <p>Cargando perfil...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="logout" class="btn-secondary">Volver al Login</button>
    </div>

    <div v-else class="profile-container">
      <div class="profile-header">
        <h1>Bienvenido, {{ user.nombre }}</h1>
        <p>Aquí puedes gestionar tu información y tus reportes.</p>
        <button @click="logout" class="btn-logout">Cerrar Sesión</button>
      </div>

      <div class="profile-content">
        <!-- Tarjeta de Información del Usuario -->
        <div class="info-card">
          <h2>Tu Información</h2>
          <ul>
            <li><strong>Email:</strong> {{ user.email }}</li>
            <li><strong>Teléfono:</strong> {{ user.telefono }}</li>
            <li><strong>Ciudad:</strong> {{ user.ciudad }}</li>
            <li><strong>Miembro desde:</strong> {{ new Date(user.fechaRegistro).toLocaleDateString() }}</li>
          </ul>
        </div>

        <!-- Sección de Reportes -->
        <div class="reports-section">
          <h2>Mis Reportes ({{ reports.length }})</h2>
          <div v-if="reports.length > 0" class="reports-grid">
            <div v-for="report in reports" :key="report._id" class="report-card">
              <span class="report-tag" :class="report.tipo">{{ report.tipo }}</span>
              <p class="report-description">{{ report.descripcion }}</p>
              <div class="report-footer">
                <span>{{ report.ciudad }}</span>
                <span>{{ new Date(report.fecha).toLocaleDateString() }}</span>
              </div>
            </div>
          </div>
          <div v-else class="no-reports">
            <p>Aún no has creado ningún reporte.</p>
            <button class="btn-primary">Crear nuevo reporte</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '@/services/authService';

const router = useRouter();
const user = ref(null);
const reports = ref([]);
const loading = ref(true);
const error = ref('');

// onMounted se ejecuta automáticamente cuando el componente se carga
onMounted(async () => {
  try {
    const response = await AuthService.getProfileData();
    user.value = response.data.user;
    reports.value = response.data.reports;
  } catch (err) {
    // Si el token es inválido, expiró o no existe, el servicio lo rechazará
    error.value = 'No se pudo cargar tu perfil. Tu sesión puede haber expirado.';
    // Opcional: limpiar localStorage si hay un error de autenticación
    AuthService.logout();
  } finally {
    loading.value = false;
  }
});

const logout = () => {
  AuthService.logout();
  router.push('/login');
};
</script>

<style scoped>
.profile-body {
  font-family: 'Poppins', sans-serif;
  background-color: #F4F2F8;
  min-height: 100vh;
  padding: 40px;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-header {
  background-color: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.profile-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}
.profile-header p {
  margin: 0;
  color: #777;
}
.btn-logout {
  padding: 10px 20px;
  border-radius: 8px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  font-weight: 600;
  cursor: pointer;
}

.profile-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
}

.info-card {
  background-color: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}
.info-card h2 {
  margin-top: 0;
  border-bottom: 2px solid #F4F2F8;
  padding-bottom: 15px;
  margin-bottom: 20px;
}
.info-card ul {
  list-style: none;
  padding: 0;
}
.info-card li {
  margin-bottom: 15px;
  color: #555;
}
.info-card li strong {
  color: #333;
}

.reports-section h2 {
  margin-top: 0;
}
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.report-card {
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  border-left: 5px solid #ccc;
}
.report-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 15px;
  text-transform: capitalize;
}
.report-tag.perdido {
  background-color: #f8d7da;
  color: #721c24;
}
.report-tag.encontrado {
  background-color: #d1ecf1;
  color: #0c5460;
}
.report-tag.adopcion {
  background-color: #d4edda;
  color: #155724;
}

.report-description {
  color: #333;
}
.report-footer {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #F4F2F8;
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #888;
}

.no-reports {
  background-color: white;
  padding: 40px;
  text-align: center;
  border-radius: 15px;
}
.btn-primary {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  background-color: #FFD93D;
  color: #333;
  font-weight: 600;
  cursor: pointer;
}
</style>