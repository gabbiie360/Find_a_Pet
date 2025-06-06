<template>
  <section class="testimonials-section" v-fade-in-on-scroll>
    <div class="container">
      <h2 class="section-title">Clients Reviews</h2>

      <Carousel
        :items-to-show="1"
        :wrap-around="true"
        :autoplay="4000"
        pauseAutoplayOnHover
        :mouse-drag="true"
        class="testimonials-carousel"
      >
        <Slide v-for="(review, index) in reviews" :key="index">
          <div class="testimonial-card">
            <h3 class="client-name">{{ review.name }}</h3>
            <p class="client-role">{{ review.role }}</p>
            <blockquote>
              <i class="fas fa-quote-left"></i>
              {{ review.text }}
            </blockquote>
            <img :src="review.avatar" :alt="review.name" class="client-avatar" />
          </div>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>

    <img src="@/assets/testimonials/side-cat.png" alt="Cat image" class="side-cat" />
  </section>
</template>

<script setup>
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const reviews = [
  {
    name: 'Sue Shei',
    role: 'Dog Lover',
    text:
      'Patatemp dolupta orem rebibusam qui commolu Fusce mollis imperdiet interdum donec eget metus augen unc vel mauris ultricies, vest ibulum orci eget, viverra.',
    avatar: new URL('@/assets/testimonials/avatar1.jpg', import.meta.url).href,
  },
  {
    name: 'Jonas Smith',
    role: 'Cat Specialist',
    text:
      'Patatemp dolupta orem rebibusam qui commolu Fusce mollis imperdiet interdum donec eget metus augen unc vel mauris ultricies, vest ibulum orci eget, viverra.',
    avatar: new URL('@/assets/testimonials/avatar2.jpg', import.meta.url).href,
  },
]
</script>

<style scoped>
.testimonials-section {
  background: #fffdfb;
  padding: 5rem 1.5rem;
  position: relative;
  overflow: hidden;
}

.section-title {
  font-size: 2.4rem;
  text-align: center;
  color: #b86c4a;
  font-weight: 800;
  margin-bottom: 2.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.testimonials-carousel {
  max-width: 900px;
  margin: auto;
}

.testimonial-card {
  background: #f8f6f2;
  padding: 2rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  text-align: center;
  position: relative;
  min-height: 320px;
}

.testimonial-card blockquote {
  font-size: 0.95rem;
  color: #444;
  line-height: 1.6;
  margin-top: 1rem;
  position: relative;
}

.testimonial-card blockquote i {
  color: #00b49f;
  margin-right: 0.4rem;
}

.client-name {
  font-weight: 700;
  color: #222;
  margin-bottom: 0.3rem;
  font-size: 1.2rem;
  text-transform: uppercase;
}

.client-role {
  color: #00b49f;
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.client-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  margin-top: 1rem;
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
}

.side-cat {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 180px;
  max-height: 260px;
  object-fit: contain;
  z-index: 1;
}

.carousel__pagination-button {
  background: #d3b1ff;
  border: 2px solid #7d2ae8;
}

.carousel__pagination-button--active {
  background: #7d2ae8;
}
</style>
