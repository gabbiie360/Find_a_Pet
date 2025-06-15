<template>
  <section class="hero-section">
    <Carousel
      v-model="currentSlide"
      :autoplay="10000"
      :transition="600"
      :wrapAround="true"
      :paginationEnabled="true"
      :navigationEnabled="false"
      class="custom-carousel"
    >
      <Slide v-for="(slide, index) in slides" :key="index">
        <div class="slide" :style="{ backgroundImage: `url(${slide.image})` }">
          <div class="overlay">
            <div class="hero-text" :class="{ active: currentSlide === index }">
              <div class="hero-bubble">
                <img src="@/assets/paw-icon.svg" alt="Paw Icon" class="paw-icon" />
                <h1 class="fade-item delay-1">{{ slide.title }}</h1>
                <p class="fade-item delay-2">{{ slide.subtitle }}</p>
                <RouterLink
                  class="btn-cta fade-item delay-3"
                  :to="slide.link"
                  aria-label="Go to contact page"
                >
                  <svg
                    class="icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M15.24 8.94a1.76 1.76 0 1 0 0-3.52 1.76 1.76 0 0 0 0 3.52Zm3.72 1.2c-.96.18-1.7 1.06-1.88 2.12s.3 2 1.14 2.2 1.88-.6 2.08-1.66-.36-2.12-1.34-2.66ZM8.76 8.94a1.76 1.76 0 1 0 0-3.52 1.76 1.76 0 0 0 0 3.52Zm-3.72 1.2c-.98.54-1.46 1.6-1.34 2.66s1.1 1.84 2.08 1.66 1.46-1.14 1.14-2.2-.92-1.94-1.88-2.12Zm3.5 4.98c-.84.5-1.02 1.56-.42 2.38s1.62 2.22 4.06 2.22 3.42-1.4 4.02-2.22.42-1.88-.42-2.38a4.84 4.84 0 0 0-4.08-.36 4.89 4.89 0 0 0-2.16.36Zm4.7-4.98a1.76 1.76 0 1 0 0-3.52 1.76 1.76 0 0 0 0 3.52Z"
                    />
                  </svg>
                  <span>Contactanos</span>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const currentSlide = ref(0)

const slides = [
  {
    image: new URL('@/assets/slider1.jpg', import.meta.url).href,
    title: '¡Amamos a los animales!',
    subtitle: 'El mejor cuidado y amor para tus amigos peludos',
    link: '/contact',
  },
  {
    image: new URL('@/assets/slider2.jpg', import.meta.url).href,
    title: '¿Perdiste o encontraste una mascota?',
    subtitle: 'Reportá y encontrá mascotas perdidas en tu comunidad',
    link: '/contact',
  },
  {
    image: new URL('@/assets/slider3.jpg', import.meta.url).href,
    title: '¡Adoptá un nuevo amigo!',
    subtitle: 'Dale un hogar lleno de amor a una mascota hoy mismo',
    link: '/contact',
  },
  {
    image: new URL('@/assets/slider4.jpg', import.meta.url).href,
    title: '¡Cuidá a tu mascota!',
    subtitle: 'Consejos y recursos para el bienestar de tus peludos',
    link: '/contact',
  },
  {
    image: new URL('@/assets/slider5.jpg', import.meta.url).href,
    title: '¡Unidos por los animales!',
    subtitle: 'Juntos hacemos la diferencia en la vida de las mascotas',
    link: '/contact',
  },
  {
    image: new URL('@/assets/slider6.jpg', import.meta.url).href,
    title: '¡Encontrá tu compañero ideal!',
    subtitle: 'Explorá nuestra comunidad de mascotas en adopción',
    link: '/contact',
  },
  {
    image: new URL('@/assets/slider7.jpg', import.meta.url).href,
    title: '¡Hacemos magia por los animales!',
    subtitle: 'Unidos por un mundo mejor para nuestras mascotas',
    link: '/contact',
  },
]
</script>



<style scoped>
.hero-section {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.custom-carousel {
  height: 100%;
  width: 100%;
  position: relative;
}

.slide {
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: stretch;
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 60%;
  height: 100%;
  background: linear-gradient(to right, rgba(94, 44, 165, 0.85), rgba(94, 44, 165, 0));
  clip-path: ellipse(80% 100% at 0% 50%);
  z-index: 1;
  display: flex;
  align-items: center;
  padding-left: 5%;
}

.hero-text {
  color: white;
  max-width: 600px;
}

.hero-bubble {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
  padding: 2rem 2.5rem;
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  max-width: 520px;
  position: relative;
  transition: transform 0.3s ease;
}

.hero-bubble:hover {
  transform: translateY(-2px);
}

.paw-icon {
  width: 40px;
  margin-bottom: 1rem;
  filter: brightness(0) invert(1);
}

.btn-cta {
  background-color: #ffd700;
  color: #5e2ca5;
  font-weight: bold;
  padding: 0.9rem 2.2rem;
  border-radius: 50px;
  text-decoration: none;
  display: inline-block;
  margin-top: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.btn-cta:active {
  animation: clickPop 0.25s ease-in-out;
}

.btn-cta::before {
  content: '';
  position: absolute;
  background-color: #ffcf00;
  width: 0%;
  height: 100%;
  top: 0;
  left: 0;
  transition: width 0.3s ease;
  z-index: -1;
  border-radius: 50px;
}

.btn-cta:hover::before {
  width: 100%;
}

.btn-cta:hover {
  color: #fff;
  animation: shadowPulse 1s ease forwards;
  transform: scale(1.05);
}

@keyframes shadowPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(255, 215, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
  }
}

@keyframes clickPop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.92);
  }
  100% {
    transform: scale(1);
  }
}

.hero-text.active .fade-item {
  opacity: 0;
  animation: fadeSlideIn 1.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.fade-item {
  opacity: 0;
}

.delay-1 {
  animation-delay: 0.4s;
}
.delay-2 {
  animation-delay: 0.9s;
}
.delay-3 {
  animation-delay: 1.4s;
}

@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateY(60px);
  }
  60% {
    opacity: 1;
    transform: translateY(-4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .overlay {
    width: 100%;
    clip-path: none;
    background: rgba(94, 44, 165, 0.75);
    padding: 2rem 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hero-text {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .hero-bubble {
    border-radius: 1.5rem;
    padding: 1.5rem;
    width: 100%;
    max-width: 90vw;
  }

  .hero-text h1 {
    font-size: 2.2rem;
  }

  .hero-text p {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .hero-text h1 {
    font-size: 1.8rem;
  }

  .hero-text p {
    font-size: 1rem;
  }
}
</style>

<style>
.carousel__pagination {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 20;
}

.carousel__pagination-button {
  width: 14px;
  height: 14px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  border: 2px solid #fff;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.carousel__pagination-button:hover {
  background-color: #ffd700;
  transform: scale(1.1);
}

.carousel__pagination-button--active {
  background-color: #ffd700;
  border-color: #ffd700;
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(1.4);
  }
}
</style>
