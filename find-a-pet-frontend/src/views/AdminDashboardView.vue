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
      <div v-if="loading">Cargando...</div>
      <div v-else>
        <!-- Vista de Estadísticas -->
        <div v-if="currentView === 'stats'" class="stats-view">
          <h1>Estadísticas Generales</h1>
          <div class="stats-grid">
            <div class="stat-card"><h2>{{ stats.totalUsers }}</h2><p>Usuarios Totales</p></div>
            <div class="stat-card"><h2>{{ stats.totalMascotas }}</h2><p>Mascotas Registradas</p></div>
            <div class="stat-card"><h2>{{ stats.mascotasPerdidas }}</h2><p>Mascotas Perdidas</p></div>
          </div>
          <div class="chart-placeholder">
            <h3>Gráfico de Actividad (Placeholder)</h3>
            <p>Aquí iría una librería de gráficos como Chart.js</p>
          </div>
        </div>

        <!-- Vista de Usuarios -->
        <div v-if="currentView === 'users'" class="table-view">
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
                <td>
                  <button @click="deleteUser(user._id)" class="btn-delete">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Vista de Mascotas -->
        <div v-if="currentView === 'pets'" class="table-view">
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
                <td>
                  <button @click="deletePet(pet._id)" class="btn-delete">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminService from '@/services/adminService';

const currentView = ref('stats');
const loading = ref(true);
const stats = ref({});
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
.admin-body { display: flex; min-height: 100vh; background-color: #f8f9fa; }
.sidebar { width: 250px; background-color: #343a40; color: white; padding-top: 20px; flex-shrink: 0; }
.sidebar-header { font-size: 1.5rem; text-align: center; margin-bottom: 30px; font-weight: 600; }
.sidebar-nav a { display: block; color: #adb5bd; padding: 15px 20px; text-decoration: none; transition: all 0.2s; }
.sidebar-nav a:hover, .sidebar-nav a.active { background-color: #495057; color: white; }
.main-content { flex-grow: 1; padding: 40px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
.stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.stat-card h2 { font-size: 2.5rem; margin: 0; }
.chart-placeholder { background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px dashed #ddd; }
table { width: 100%; border-collapse: collapse; background: white; }
th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
th { background-color: #f2f2f2; }
.btn-delete { background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; }
.status-tag { padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; }
.status-tag.perdida { background: #ffebee; color: #c62828; }
.status-tag.en-casa { background: #e8f5e9; color: #2e7d32; }
</style>