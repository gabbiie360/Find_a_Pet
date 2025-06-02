<template>
  <section class="services-section">
    <div class="container">
      <h2 class="title">Our Services</h2>
      <p class="subtitle">
        We care for your pets with love and professionalism. Discover what we offer to make their lives healthier and happier.
      </p>

      <Carousel
        :items-to-show="3"
        :wrapAround="true"
        :transition="500"
        class="services-carousel"
        :autoplay="6000"
        pauseAutoplayOnHover
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
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

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
</script>

<style scoped>
.services-section {
  background: #fff;
  padding: 4rem 1rem;
  text-align: center;
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
</style>
