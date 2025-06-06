<template>
  <section class="testimonials-section" v-fade-in-on-scroll>
    <div class="container">
      <h2 class="section-title">Clients Reviews</h2>

      <Carousel
        :items-to-show="1"
        :wrap-around="true"
        :autoplay="6000"
        pauseAutoplayOnHover
        class="carousel"
      >
        <Slide v-for="(review, index) in reviews" :key="index">
          <div class="testimonial-card">
            <div class="quote-icon">❝</div>
            <p class="testimonial-text"> {{ review.text }} </p>
            <div class="client-info">
              <img :src="review.avatar" :alt="review.name" class="client-avatar" />
              <div>
                <h3 class="client-name">{{ review.name }}</h3>
                <p class="client-role">{{ review.role }}</p>
              </div>
            </div>
          </div>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>

    <img src="@/assets/testimonials/side-cat.png" alt="Cat" class="side-cat" />
  </section>
</template>

<script setup>
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const reviews = [
  {
    name: 'Sue Shei',
    role: 'Dog Lover',
    text: 'Patatemp dolupta orem rebibusam qui commolu Fusce mollis imperdiet interdum donec eget metus augen unc vel mauris ultricies, vest ibulum orci eget, viverra.',
    avatar: new URL('@/assets/testimonials/avatar1.jpg', import.meta.url).href,
  },
  {
    name: 'Jonas Smith',
    role: 'Cat Specialist',
    text: 'Patatemp dolupta orem rebibusam qui commolu Fusce mollis imperdiet interdum donec eget metus augen unc vel mauris ultricies, vest ibulum orci eget, viverra.',
    avatar: new URL('@/assets/testimonials/avatar2.jpg', import.meta.url).href,
  },
]
</script>

<style scoped>
.testimonials-section {
  background: #fffdfa;
  padding: 5rem 1rem;
  position: relative;
  overflow: hidden;
}

.section-title {
  font-size: 2.4rem;
  color: #b86c4a;
  text-align: center;
  font-weight: 800;
  margin-bottom: 3rem;
  text-transform: uppercase;
}

.carousel {
  max-width: 800px;
  margin: auto;
}

.testimonial-card {
  background: #fefefe;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  position: relative;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.quote-icon {
  font-size: 3rem;
  color: #7d2ae8;
  margin-bottom: 1rem;
}

.testimonial-text {
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  padding: 0 1rem;
  margin-bottom: 2rem;
}

.client-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.client-avatar {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #7d2ae8;
  margin-bottom: 0.5rem;
}

.client-name {
  font-weight: 700;
  color: #222;
  margin-bottom: 0.2rem;
  font-size: 1.1rem;
  text-transform: uppercase;
}

.client-role {
  font-size: 0.9rem;
  color: #00b49f;
}

/* Pagination */
.carousel__pagination-button {
  background: #d3b1ff;
  border: 2px solid #7d2ae8;
}
.carousel__pagination-button--active {
  background: #7d2ae8;
}

/* Arrows */
.carousel__prev,
.carousel__next {
  background-color: #f3e4ff;
  border-radius: 50%;
  padding: 0.6rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #7d2ae8;
  transition: all 0.3s ease;
}
.carousel__prev:hover,
.carousel__next:hover {
  background-color: #7d2ae8;
  color: white;
}

.side-cat {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 180px;
  max-height: 260px;
  object-fit: contain;
  z-index: 0;
}
</style>
