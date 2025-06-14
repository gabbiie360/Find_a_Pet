<template>
  <section class="about-section">
    <div class="container">
      <h1 class="title" v-fade-in-on-scroll>About Find a Pet</h1>
      <p class="intro" v-fade-in-on-scroll>
        We help connect lost, found, and adoptable pets with their future families.
      </p>

      <div class="features">
        <div class="feature-box" v-fade-in-on-scroll>
          <i class="fas fa-search-location"></i>
          <h3>Find Lost Pets</h3>
          <p>Use our smart search to help reunite families with their beloved animals.</p>
        </div>
        <div class="feature-box" v-fade-in-on-scroll>
          <i class="fas fa-home"></i>
          <h3>Pet Adoption</h3>
          <p>Give pets a second chance by adopting those in need of a loving home.</p>
        </div>
        <div class="feature-box" v-fade-in-on-scroll>
          <i class="fas fa-hands-helping"></i>
          <h3>Community Support</h3>
          <p>Join a caring community dedicated to animal welfare and support.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// No se necesita lógica
</script>

<style scoped>
.about-section {
  padding: 6rem 1rem 3rem; /* Ajuste superior para evitar que el h1 se oculte */
  background-color: #fdf7ff;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 2.5rem;
  color: #663399;
  margin-bottom: 1rem;
}

.intro {
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 2rem;
  color: #444;
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.feature-box {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 0 10px #ccc;
  max-width: 300px;
  transition: 0.3s ease;
}

.feature-box:hover {
  transform: translateY(-5px);
}

.feature-box i {
  font-size: 2rem;
  color: #a067ff;
  margin-bottom: 1rem;
}

/* Animaciones con directiva */
.before-visible {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease;
}

.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
