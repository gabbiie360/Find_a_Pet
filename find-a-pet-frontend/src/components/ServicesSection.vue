<template>
  <section ref="sectionRef" class="services-section" :class="{ 'is-visible': visible }">
    <div class="container">
      <h2 class="title">Our Services</h2>
      <p class="subtitle">
        We care for your pets with love and professionalism. Discover what we offer to make their lives healthier and happier.
      </p>

      <Carousel
        :items-to-show="3"
        :wrapAround="true"
        :transition="500"
        :autoplay="6000"
        pauseAutoplayOnHover
        class="services-carousel"
        :breakpoints="breakpoints"
      >
        <Slide v-for="(service, index) in services" :key="index">
          <div class="service-card">
            <img :src="service.image" :alt="service.title" />
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </div>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const visible = ref(false)
const sectionRef = ref(null)

const services = [
  {
    image: new URL('@/assets/services/bird.jpg', import.meta.url).href,
    title: 'Exotic Bird Care',
    description: 'Specialized care for your feathered friends.',
  },
  {
    image: new URL('@/assets/services/dog-vet.jpg', import.meta.url).href,
    title: 'Veterinary Services',
    description: 'Health check-ups and emergency care.',
  },
  {
    image: new URL('@/assets/services/cat.jpg', import.meta.url).href,
    title: 'Cat Grooming',
    description: 'Gentle and professional grooming for your cats.',
  },
  {
    image: new URL('@/assets/services/dog-training.jpg', import.meta.url).href,
    title: 'Dog Training',
    description: 'Positive reinforcement training programs.',
  },
]

const breakpoints = {
  1024: { itemsToShow: 3 },
  768: { itemsToShow: 2 },
  0: { itemsToShow: 1 }
}

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.2 }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})

onUnmounted(() => {
  sectionRef.value = null
})
</script>

<style scoped>
.services-section {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1s ease, transform 1s ease;
  margin-top: 4rem;
}

.services-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.title {
  font-size: 2.5rem;
  color: #7d2ae8;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-inline: auto;
}

.services-carousel {
  max-width: 1200px;
  margin: auto;
}

.service-card {
  background: #fdfdfd;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.07);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.15);
}

.fade-in {
  opacity: 0;
  transform: translateY(40px);
  animation: fadeInUp 1s ease-out forwards;
  animation-delay: 0.3s;
}

.service-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
  transition: transform 0.4s ease-in-out;
}

.service-card:hover img {
  transform: scale(1.06);
}

.service-card h3 {
  color: #5e2ca5;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.service-card p {
  font-size: 0.95rem;
  color: #555;
}

.carousel__pagination {
  position: relative;
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  z-index: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
}


@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


</style>

<style>
.carousel__pagination-button {
  width: 14px;
  height: 14px;
  background-color: #d1cfd6; /* más visible sobre blanco */
  border-radius: 50%;
  border: 2px solid #5e2ca5;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.carousel__pagination-button:hover {
  background-color: #ffd700;
  transform: scale(1.2);
  box-shadow: 0 0 5px rgba(94, 44, 165, 0.4);
}

.carousel__pagination-button--active {
  background-color: #ffd700;
  border-color: #5e2ca5;
  transform: scale(1.2);
}

</style>
