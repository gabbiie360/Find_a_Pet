<template>
  <div class="admin-body">
    <aside class="sidebar">
      <div class="sidebar-header">Admin Dashboard</div>
      <nav class="sidebar-nav">
        <a href="#" @click.prevent="currentView = 'stats'" :class="{ active: currentView === 'stats' }">Estadísticas</a>
        <a href="#" @click.prevent="currentView = 'users'" :class="{ active: currentView === 'users' }">Gestionar Usuarios</a>
        <a href="#" @click.prevent="currentView = 'pets'" :class="{ active: currentView === 'pets' }">Gestionar Mascotas</a>
      </nav>
    </aside>

    <main class="main-content">
      <div v-if="loading" class="loading-message">Cargando datos...</div>
      
      <div v-else>
        <!-- Vista de Estadísticas -->
        <div v-show="currentView === 'stats'" class="stats-view">
          <h1>Estadísticas Generales</h1>
          <div class="stats-grid">
            <div class="stat-card"><h2>{{ stats.totalUsers || 0 }}</h2><p>Usuarios Totales</p></div>
            <div class="stat-card"><h2>{{ stats.totalMascotas || 0 }}</h2><p>Mascotas Registradas</p></div>
            <div class="stat-card"><h2>{{ stats.totalReportes || 0 }}</h2><p>Reportes Creados</p></div>
            <div class="stat-card lost"><h2>{{ stats.mascotasPerdidas || 0 }}</h2><p>Mascotas Perdidas Ahora</p></div>
            <div class="stat-card found"><h2>{{ stats.mascotasEncontradas || 0 }}</h2><p>Mascotas Encontradas</p></div>
          </div>
          <div class="chart-container">
            <h3>Actividad de los Últimos 7 Días</h3>
            <Line v-if="!loading" :data="chartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Vista de Usuarios -->
        <div v-show="currentView === 'users'" class="table-view">
          <div class="view-header">
            <h1>Gestionar Usuarios</h1>
            <button @click="openUserModal(null)" class="btn-add">Añadir Usuario</button>
          </div>
          <table>
            <thead>
              <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id">
                <td>{{ user.nombre }}</td>
                <td>{{ user.email }}</td>
                <td><span class="status-tag" :class="`role-${user.rol}`">{{ user.rol }}</span></td>
                <td class="action-buttons">
                  <button @click="openUserModal(user)" class="btn-edit">Editar</button>
                  <button @click="deleteUser(user._id)" class="btn-delete">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Vista de Mascotas -->
        <div v-show="currentView === 'pets'" class="table-view">
          <h1>Gestionar Mascotas</h1>
          <table>
             <thead>
              <tr><th>Nombre</th><th>Especie</th><th>Estado</th><th>Dueño</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              <tr v-for="pet in pets" :key="pet._id">
                <td>{{ pet.nombre }}</td>
                <td>{{ pet.especie }}</td>
                <td><span class="status-tag" :class="pet.estado.replace(' ', '-')">{{ pet.estado }}</span></td>
                <td>{{ pet.propietarioId?.nombre || 'N/A' }}</td>
                <td class="action-buttons">
                  <button @click="deletePet(pet._id)" class="btn-delete">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- MODAL PARA AÑADIR/EDITAR USUARIO -->
    <div v-if="showUserModal" class="modal-overlay" @click.self="closeUserModal">
      <div class="modal-content animate__animated animate__fadeInUp">
        <h2>{{ isEditingUser ? 'Editar Usuario' : 'Añadir Nuevo Usuario' }}</h2>
        <form @submit.prevent="handleSaveUser">
          <input type="text" v-model="userForm.nombre" placeholder="Nombre completo" required>
          <input type="email" v-model="userForm.email" placeholder="Email" required>
          <input type="text" v-model="userForm.telefono" placeholder="Teléfono" required>
          <input type="text" v-model="userForm.ciudad" placeholder="Ciudad" required>
          <select v-model="userForm.rol">
            <option value="usuario">Usuario</option>
            <option value="admin">Admin</option>
          </select>
          <input type="password" v-model="userForm.password" :placeholder="isEditingUser ? 'Nueva contraseña (opcional)' : 'Contraseña'" :required="!isEditingUser">
          
          <div class="modal-actions">
            <button type="button" @click="closeUserModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="isSubmitting">{{ isSubmitting ? 'Guardando...' : 'Guardar' }}</button>
          </div>
           <p v-if="modalError" class="error-message">{{ modalError }}</p>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import AdminService from '@/services/adminService';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const currentView = ref('stats');
const loading = ref(true);
const stats = ref({ nuevosUsuarios: [], nuevasMascotas: [], mascotasEncontradasDiarias: [] });
const users = ref([]);
const pets = ref([]);
const isSubmitting = ref(false);
const modalError = ref('');

// --- Estados para el Modal de Usuario ---
const showUserModal = ref(false);
const isEditingUser = ref(false);
const userForm = reactive({
  _id: null,
  nombre: '',
  email: '',
  telefono: '',
  ciudad: '',
  password: '',
  rol: 'usuario'
});

onMounted(async () => {
  try {
    const [statsRes, usersRes, petsRes] = await Promise.all([
      AdminService.getStats(),
      AdminService.getUsers(),
      AdminService.getPets(),
    ]);
    stats.value = statsRes.data;
    users.value = usersRes.data;
    pets.value = petsRes.data;
  } catch (err) {
    console.error("Error cargando datos del dashboard:", err);
  } finally {
    loading.value = false;
  }
});

const chartData = computed(() => {
    const hoy = new Date();
    const diasDelIntervalo = eachDayOfInterval({ start: subDays(hoy, 6), end: hoy });
    const labels = diasDelIntervalo.map(dia => format(dia, 'd MMM', { locale: es }));
    
    const datosNuevosUsuarios = Array.isArray(stats.value.nuevosUsuarios) ? stats.value.nuevosUsuarios : [];
    const datosNuevasMascotas = Array.isArray(stats.value.nuevasMascotas) ? stats.value.nuevasMascotas : [];
    const datosMascotasEncontradas = Array.isArray(stats.value.mascotasEncontradasDiarias) ? stats.value.mascotasEncontradasDiarias : [];

    const getCountForDay = (dataArray, day) => {
        const diaFormato = format(day, 'yyyy-MM-dd');
        const match = dataArray.find(d => d._id === diaFormato);
        return match ? match.count : 0;
    };

    const dataUsuarios = diasDelIntervalo.map(dia => getCountForDay(datosNuevosUsuarios, dia));
    const dataMascotas = diasDelIntervalo.map(dia => getCountForDay(datosNuevasMascotas, dia));
    const dataEncontradas = diasDelIntervalo.map(dia => getCountForDay(datosMascotasEncontradas, dia));

    return {
        labels,
        datasets: [
            { label: 'Nuevos Usuarios', backgroundColor: '#b098d6', borderColor: '#b098d6', data: dataUsuarios, tension: 0.3 },
            { label: 'Nuevas Mascotas', backgroundColor: '#f7de8e', borderColor: '#f7de8e', data: dataMascotas, tension: 0.3 },
            { label: 'Mascotas Encontradas', backgroundColor: '#28a745', borderColor: '#28a745', data: dataEncontradas, tension: 0.3 }
        ]
    };
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
};

// --- Lógica del CRUD de Usuarios ---
const openUserModal = (user) => {
  if (user) {
    isEditingUser.value = true;
    Object.assign(userForm, { ...user, password: '' }); // Limpiamos el campo de contraseña
  } else {
    isEditingUser.value = false;
    Object.assign(userForm, { _id: null, nombre: '', email: '', telefono: '', ciudad: '', password: '', rol: 'usuario' });
  }
  showUserModal.value = true;
};

const closeUserModal = () => {
  showUserModal.value = false;
  modalError.value = '';
};

const handleSaveUser = async () => {
    isSubmitting.value = true;
    modalError.value = '';
    try {
        const payload = { ...userForm };
        if (!payload.password) delete payload.password;

        if (isEditingUser.value) {
            await AdminService.updateUser(payload._id, payload);
        } else {
            await AdminService.createUser(payload);
        }
        
        const usersRes = await AdminService.getUsers();
        users.value = usersRes.data;
        closeUserModal();
    } catch (err) {
        modalError.value = err.response?.data?.msg || 'Error al guardar el usuario.';
        console.error("Error guardando usuario:", err);
    } finally {
        isSubmitting.value = false;
    }
};

const deleteUser = async (userId) => {
  if (confirm('¿Seguro que quieres eliminar este usuario y todas sus mascotas? Esta acción es irreversible.')) {
    try {
      await AdminService.deleteUser(userId);
      users.value = users.value.filter(u => u._id !== userId);
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    }
  }
};

const deletePet = async (petId) => {
  if (confirm('¿Seguro que quieres eliminar esta mascota?')) {
    try {
      await AdminService.deletePet(petId);
      pets.value = pets.value.filter(p => p._id !== petId);
    } catch (err) {
      console.error("Error al eliminar mascota:", err);
    }
  }
};
</script>

<style scoped>
/* ESTILOS COMPLETOS (CON ADICIONES PARA EL CRUD) */
.admin-body { display: flex; min-height: 100vh; background-color: #f8f9fa; font-family: 'Poppins', sans-serif; }
.sidebar { width: 250px; background-color: #343a40; color: white; padding-top: 20px; flex-shrink: 0; position: fixed; height: 100%; }
.main-content { margin-left: 250px; flex-grow: 1; padding: 40px; }
.sidebar-header { font-size: 1.5rem; text-align: center; margin-bottom: 30px; font-weight: 600; }
.sidebar-nav a { display: block; color: #adb5bd; padding: 15px 20px; text-decoration: none; transition: all 0.2s; border-left: 3px solid transparent; }
.sidebar-nav a:hover { background-color: #495057; color: white; }
.sidebar-nav a.active { background-color: #007bff; color: white; border-left-color: #f7de8e; }
.loading-message { font-size: 1.2rem; text-align: center; margin-top: 50px; }
.stats-view h1, .table-view h1 { margin-bottom: 20px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin: 20px 0 40px 0; }
.stat-card { background: white; padding: 25px; border-radius: 8px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.stat-card h2 { font-size: 3rem; margin: 0; color: #b098d6; }
.stat-card.lost h2 { color: #dc3545; }
.stat-card.found h2 { color: #28a745; }
.stat-card p { margin: 5px 0 0 0; color: #6c757d; font-weight: 500; }
.chart-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); height: 400px; }

.table-view { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.view-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.btn-add { background: #007bff; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-weight: 600; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 15px; border-bottom: 1px solid #dee2e6; text-align: left; vertical-align: middle; }
th { background-color: #e9ecef; font-weight: 600; }
.action-buttons { display: flex; gap: 10px; }
.btn-edit { background: #ffc107; color: #212529; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; }
.btn-delete { background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; }
.status-tag { padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; text-transform: capitalize; }
.status-tag.perdida { background: #ffebee; color: #c62828; }
.status-tag.encontrada { background: #d4edda; color: #155724; }
.status-tag.en-casa { background: #e8f5e9; color: #2e7d32; }
.status-tag.role-admin { background-color: #d1ecf1; color: #0c5460; }
.status-tag.role-usuario { background-color: #f8f9fa; color: #343a40; border: 1px solid #dee2e6; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 20px; box-sizing: border-box; overflow-y: auto; }
.modal-content { background: white; padding: 30px 40px; border-radius: 15px; width: 90%; max-width: 500px; }
.modal-content h2 { margin-top: 0; }
.modal-content form input, .modal-content form select, .modal-content form textarea { width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 8px; font-family: 'Poppins', sans-serif; background: white; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.btn-secondary { background: #eee; color: #333; padding: 12px 25px; border-radius: 8px; border: none; cursor: pointer; }
.btn-primary:disabled { background-color: #ccc; cursor: not-allowed; transform: none; box-shadow: none;}
.error-message { color: #c62828; margin-top: 15px; text-align: center; }
</style>