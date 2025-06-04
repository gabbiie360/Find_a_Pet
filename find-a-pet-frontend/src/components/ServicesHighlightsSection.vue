<template>
  <section class="highlights-section">
    <div class="container">
      <div class="highlight-grid">
        <div class="highlight-card" v-for="(service, index) in services" :key="index">
          <div class="icon-wrapper">
            <i :class="service.icon"></i>
          </div>
          <h3 class="highlight-title">{{ service.title }}</h3>
          <p class="highlight-description">{{ service.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
const services = [
  {
    icon: 'fa-solid fa-dog',
    title: 'Housing',
    description:
      'Aenean lacinia bibendum nulla sed consectetur purus sit amet fermentum sociis natoque penatibus et magnis.',
  },
  {
    icon: 'fa-solid fa-hand-holding-heart',
    title: 'High Quality',
    description:
      'Aenean lacinia bibendum nulla sed consectetur purus sit amet fermentum sociis natoque penatibus et magnis.',
  },
  {
    icon: 'fa-solid fa-paw',
    title: 'Vet Services',
    description:
      'Aenean lacinia bibendum nulla sed consectetur purus sit amet fermentum sociis natoque penatibus et magnis.',
  },
  {
    icon: 'fa-solid fa-user-nurse',
    title: 'Special Care',
    description:
      'Aenean lacinia bibendum nulla sed consectetur purus sit amet fermentum sociis natoque penatibus et magnis.',
  },
]
</script>


<style scoped>
.highlights-section {
  padding: 5rem 1.5rem;
  background-color: #fefaf7;
}

.highlight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: auto;
  text-align: center;
}

.highlight-card {
  padding: 1.5rem 1rem;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 6px 20px rgba(125, 42, 232, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.highlight-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 26px rgba(125, 42, 232, 0.15);
}

.icon-wrapper {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.2rem;
  border: 3px solid #d9c4f0; /* Lila suave */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper i {
  font-size: 2rem;
  color: #5e2ca5;
}

.highlight-title {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #222;
}

.highlight-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
}
</style>
