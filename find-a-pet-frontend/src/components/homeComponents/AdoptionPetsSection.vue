<template>
  <section class="adoption-section">
    <div class="container">
      <h2 class="section-title" v-fade-in-on-scroll>Mascotas en Adopción</h2>
      <p class="section-subtitle" v-fade-in-on-scroll>Estas adorables mascotas están buscando un hogar lleno de amor. ¡Adoptá y cambiá una vida!</p>

      <div v-if="loading" class="loading-msg">Cargando mascotas...</div>
      <div v-else-if="pets.length === 0" class="empty-msg">No hay mascotas en adopción en este momento.</div>
      <div v-else class="pets-grid">
        <div v-for="mascota in pets" :key="mascota._id" class="pet-card" v-fade-in-on-scroll>
          <img :src="mascota.fotos[0] || placeholderImage" alt="Mascota" class="pet-image" />
          <div class="pet-info">
            <h3>{{ mascota.nombre }}</h3>
            <p>{{ mascota.especie }} | {{ mascota.ciudad }}</p>
            <router-link :to="`/pet/${mascota._id}`" class="btn-more">Ver más</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PetService from '@/services/petService'
import placeholderImage from '@/assets/placeholder-pet.png'

const pets = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await PetService.getPetsByStatus('adopcion')
    pets.value = response.data
  } catch (err) {
    console.error('Error al obtener mascotas en adopción:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.adoption-section {
  background-color: #fcf7ff;
  padding: 4rem 1rem;
  text-align: center;
}
.section-title {
  font-size: 2.2rem;
  color: #6c2ca4;
  margin-bottom: 0.5rem;
}
.section-subtitle {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2rem;
}
.pets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}
.pet-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: 0.3s ease;
}
.pet-card:hover {
  transform: translateY(-5px);
}
.pet-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.pet-info {
  padding: 1rem;
}
.pet-info h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #333;
}
.pet-info p {
  margin: 0.3rem 0;
  color: #777;
}
.btn-more {
  display: inline-block;
  margin-top: 0.7rem;
  background-color: #b98bff;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}
.loading-msg, .empty-msg {
  font-size: 1.1rem;
  color: #777;
  margin-top: 2rem;
}
</style>
