<template>
  <section class="highlights-section" v-fade-in-on-scroll>
    <div class="container">
      <div class="highlight-grid">
        <div class="highlight-card" v-for="(service, index) in services" :key="index">
          <div class="icon-wrapper animated-icon">
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
    description: 'Housing support with care and attention to your pet’s comfort.',
  },
  {
    icon: 'fa-solid fa-hand-holding-heart',
    title: 'High Quality',
    description: 'Premium services with compassion and high standards.',
  },
  {
    icon: 'fa-solid fa-paw',
    title: 'Vet Services',
    description: 'On-demand medical care and routine wellness checks.',
  },
  {
    icon: 'fa-solid fa-user-nurse',
    title: 'Special Care',
    description: 'Personalized care for pets with special needs or recovery.',
  },
]
</script>



<style scoped>
.highlights-section {
  padding: 5rem 1.5rem;
  background-color: #fefaf7;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease;
}

.highlights-section.visible {
  opacity: 1;
  transform: translateY(0);
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
  padding: 1.8rem 1.2rem;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 6px 18px rgba(125, 42, 232, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.highlight-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 28px rgba(125, 42, 232, 0.2);
}

.icon-wrapper {
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem;
  border: 3px solid #d9c4f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fdf7ff;
  transition: background 0.3s ease, transform 0.3s ease;
}

.icon-wrapper i {
  font-size: 2rem;
  color: #5e2ca5;
  transition: transform 0.3s ease;
}

.highlight-title {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #222;
}

.highlight-description {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
}

.highlight-card:hover .icon-wrapper {
  background: #f1e6fd;
  transform: scale(1.05);
}

.highlight-card:hover .icon-wrapper i {
  transform: rotate(10deg) scale(1.1);
}

.animated-icon {
  animation: floaty 5s ease-in-out infinite;
}

@keyframes floaty {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}
</style>
