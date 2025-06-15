<template>
  <div class="search-page-body">
    <div class="reports-wrapper">
      <div class="search-header">
        <h1>Explora los Reportes de Mascotas</h1>
        <p>
          Filtra por tipo de reporte, especie o ciudad para encontrar o ayudar a una mascota.
        </p>
      </div>

      <!-- Barra de Filtros -->
      <div class="filter-bar">
        <form @submit.prevent="performSearch" class="filter-form">
          <input
            type="text"
            v-model="filters.ciudad"
            placeholder="Buscar por ciudad..."
            class="filter-input"
          />

          <select v-model="filters.especie" class="filter-select">
            <option value="">Todas las especies</option>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Loro">Loro</option>
            <option value="Otro">Otro</option>
          </select>

          <select v-model="filters.estado" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="perdida">Perdida</option>
            <option value="encontrada">Encontrada</option>
            <option value="adopcion">Adopción</option>
          </select>

          <button type="submit" class="btn btn-primary">Buscar</button>
        </form>
      </div>

      <!-- Contenedor de Resultados -->
      <div class="results-container">
        <div v-if="loading" class="feedback-message">Cargando reportes...</div>
        <div v-else-if="error" class="feedback-message error">{{ error }}</div>
        <div v-else-if="filteredPets.length === 0" class="feedback-message">
          No se encontraron mascotas con esos criterios.
        </div>
        <div v-else class="pets-grid">
          <div
            v-for="mascota in filteredPets"
            :key="mascota._id"
            class="pet-card"
            :class="{
              'border-lost': mascota.estado === 'perdida',
              'border-found': mascota.estado === 'encontrada',
              'border-adopt': mascota.estado === 'adopcion'
            }"
          >
            <img
              :src="mascota.fotos[0] || placeholderImage"
              alt="Foto de la mascota"
              class="pet-photo"
            />
            <div class="pet-info">
              <h3>{{ mascota.nombre }}</h3>
              <p class="pet-breed">
                {{ mascota.especie }} - {{ mascota.raza || 'No especificada' }}
              </p>
              <p class="pet-description lost-info">
                {{ estadoTexto(mascota.estado) }}
                <span v-if="mascota.fechaPerdida">
                  - {{ new Date(mascota.fechaPerdida).toLocaleDateString() }}
                </span>
              </p>
            </div>
            <router-link :to="`/pet/${mascota._id}`" class="btn-action view-more">
              Ver Más
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import PetService from '@/services/petService'
import placeholderImage from '@/assets/placeholder-pet.png'

const filteredPets = ref([])
const loading = ref(true)
const error = ref('')

const filters = reactive({
  ciudad: '',
  especie: '',
  estado: ''
})

const estadoTexto = estado => {
  switch (estado) {
    case 'perdida':
      return 'Mascota Perdida'
    case 'encontrada':
      return 'Mascota Encontrada'
    case 'adopcion':
      return 'Mascota en Adopción'
    default:
      return 'Estado desconocido'
  }
}

const performSearch = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await PetService.getFilteredPets(filters)
    // Solo mostrar mascotas que tengan estado válido (no 'en casa')
    filteredPets.value = response.data.filter(m =>
      ['perdida', 'encontrada', 'adopcion'].includes(m.estado)
    )
  } catch (err) {
    error.value = 'No se pudieron cargar los reportes. Inténtalo más tarde.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(performSearch)
</script>

<style scoped>
.search-page-body {
  background-color: #f4f2f8;
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: 100px;
  display: flex;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
}
.reports-wrapper {
  width: 100%;
  max-width: 1200px;
}

.search-header {
  text-align: center;
  margin-bottom: 40px;
}
.search-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
}
.search-header p {
  font-size: 1.2rem;
  color: #666;
}

.filter-bar {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 40px;
}
.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}
.filter-input,
.filter-select {
  flex-grow: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-width: 200px;
}
.btn-primary {
  background-color: #f7de8e;
  color: #8b7bab;
  font-weight: 700;
  padding: 12px 25px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.results-container {
  margin-bottom: 60px;
}
.feedback-message {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #555;
}
.feedback-message.error {
  color: #c62828;
}

.pets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.pet-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
}
.pet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.border-lost {
  border-left: 5px solid #ff6f00;
}
.border-found {
  border-left: 5px solid #4caf50;
}
.border-adopt {
  border-left: 5px solid #2196f3;
}

.pet-photo {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.pet-info {
  padding: 20px;
  flex-grow: 1;
}
.pet-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.4rem;
}
.pet-breed {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
}
.lost-info {
  font-weight: 500;
  color: #333;
}
.btn-action.view-more {
  display: block;
  width: calc(100% - 40px);
  margin: 0 20px 20px 20px;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  background-color: #b098d6;
  color: white;
  text-decoration: none;
  font-weight: 600;
}
</style>
