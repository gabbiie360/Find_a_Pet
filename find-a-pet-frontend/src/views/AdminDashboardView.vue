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
            <!-- CORRECCIÓN #1: Usar stats.totalReportes -->
            <div class="stat-card"><h2>{{ stats.totalReportes || 0 }}</h2><p>Reportes Creados</p></div>
            <div class="stat-card lost"><h2>{{ stats.mascotasPerdidas || 0 }}</h2><p>Mascotas Perdidas Ahora</p></div>
          </div>
          <div class="chart-container">
            <h3>Actividad de los Últimos 7 Días</h3>
            <Line v-if="!loading" :data="chartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Vista de Usuarios -->
        <div v-show="currentView === 'users'" class="table-view">
          <h1>Gestionar Usuarios</h1>
          <table>
            <thead>
              <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id">
                <td>{{ user.nombre }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.rol }}</td>
                <td><button @click="deleteUser(user._id)" class="btn-delete">Eliminar</button></td>
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
                <td><span class="status-tag" :class="pet.estado">{{ pet.estado }}</span></td>
                <td>{{ pet.propietarioId?.nombre || 'N/A' }}</td>
                <td><button @click="deletePet(pet._id)" class="btn-delete">Eliminar</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import AdminService from '@/services/adminService';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const currentView = ref('stats');
const loading = ref(true);
const stats = ref({
  nuevosUsuarios: [],
  nuevasMascotas: []
});
const users = ref([]);
const pets = ref([]);

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

// --- CORRECCIÓN #2: Lógica del Gráfico más Robusta ---
const chartData = computed(() => {
    const hoy = new Date();
    // Genera un rango de los últimos 7 días, terminando en hoy.
    const diasDelIntervalo = eachDayOfInterval({ start: subDays(hoy, 6), end: hoy });

    // Crea las etiquetas para el eje X del gráfico (ej: "10 jun", "11 jun")
    const labels = diasDelIntervalo.map(dia => format(dia, 'd MMM', { locale: es }));

    // Asegura que los datos del backend sean un array, incluso si vienen nulos o undefined
    const datosNuevosUsuarios = Array.isArray(stats.value.nuevosUsuarios) ? stats.value.nuevosUsuarios : [];
    const datosNuevasMascotas = Array.isArray(stats.value.nuevasMascotas) ? stats.value.nuevasMascotas : [];
    
    // Función auxiliar para buscar el recuento de un día específico
    const getCountForDay = (dataArray, day) => {
        const diaFormato = format(day, 'yyyy-MM-dd');
        const match = dataArray.find(d => d._id === diaFormato);
        return match ? match.count : 0;
    };

    // Mapea los datos de usuarios y mascotas a los 7 días del intervalo
    const dataUsuarios = diasDelIntervalo.map(dia => getCountForDay(datosNuevosUsuarios, dia));
    const dataMascotas = diasDelIntervalo.map(dia => getCountForDay(datosNuevasMascotas, dia));

    return {
        labels,
        datasets: [
            {
                label: 'Nuevos Usuarios',
                backgroundColor: '#b098d6',
                borderColor: '#b098d6',
                data: dataUsuarios,
                tension: 0.3
            },
            {
                label: 'Nuevas Mascotas',
                backgroundColor: '#f7de8e',
                borderColor: '#f7de8e',
                data: dataMascotas,
                tension: 0.3
            }
        ]
    };
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                // Asegura que el eje Y solo muestre números enteros
                stepSize: 1
            }
        }
    }
};

const deleteUser = async (userId) => {
  if (confirm('¿Seguro que quieres eliminar este usuario y todas sus mascotas?')) {
    await AdminService.deleteUser(userId);
    users.value = users.value.filter(u => u._id !== userId);
  }
};

const deletePet = async (petId) => {
  if (confirm('¿Seguro que quieres eliminar esta mascota?')) {
    await AdminService.deletePet(petId);
    pets.value = pets.value.filter(p => p._id !== petId);
  }
};
</script>

<style scoped>
/* Tus estilos no necesitan cambios, son correctos */
.admin-body { display: flex; min-height: 100vh; background-color: #f8f9fa; font-family: 'Poppins', sans-serif; }
.sidebar { width: 250px; background-color: #343a40; color: white; padding-top: 20px; flex-shrink: 0; position: fixed; height: 100%; }
.main-content { margin-left: 250px; flex-grow: 1; padding: 40px; }
.sidebar-header { font-size: 1.5rem; text-align: center; margin-bottom: 30px; font-weight: 600; }
.sidebar-nav a { display: block; color: #adb5bd; padding: 15px 20px; text-decoration: none; transition: all 0.2s; border-left: 3px solid transparent; }
.sidebar-nav a:hover { background-color: #495057; color: white; }
.sidebar-nav a.active { background-color: #007bff; color: white; border-left-color: #f7de8e; }
.loading-message { font-size: 1.2rem; text-align: center; margin-top: 50px; }
.stats-view h1, .table-view h1 { margin-bottom: 20px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin: 20px 0 40px 0; }
.stat-card { background: white; padding: 25px; border-radius: 8px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.stat-card h2 { font-size: 3rem; margin: 0; color: #b098d6; }
.stat-card.lost h2 { color: #dc3545; }
.stat-card p { margin: 5px 0 0 0; color: #6c757d; font-weight: 500; }
.chart-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); height: 400px; }
.table-view { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 15px; border-bottom: 1px solid #dee2e6; text-align: left; vertical-align: middle; }
th { background-color: #e9ecef; font-weight: 600; }
.btn-delete { background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; }
.status-tag { padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; }
.status-tag.perdida { background: #ffebee; color: #c62828; }
.status-tag.en-casa { background: #e8f5e9; color: #2e7d32; }
</style>