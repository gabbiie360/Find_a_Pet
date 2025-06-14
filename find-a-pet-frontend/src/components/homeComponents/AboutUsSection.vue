<template>
  <section class="about-section" v-fade-in-on-scroll>
    <div class="container">
      <h2 class="section-title">Sobre Nosotros</h2>

      <div class="about-grid">
        <div class="about-text">
          <h3 class="about-subtitle">Para tu mejor amigo</h3>
          <p class="about-description">
            En <strong>Find a Pet</strong>, cuidamos a cada animal como parte de nuestra familia.
            Ofrecemos servicios que buscan superar tus expectativas con amor, respeto y compromiso.
          </p>

          <div class="accordion">
  <div
    class="accordion-item"
    v-for="(item, index) in accordionItems"
    :key="index"
    :class="{ active: activeIndex === index }"
  >
    <button class="accordion-header" @click="toggle(index)">
  <span class="icon-text">
    <span class="emoji" :class="{ rotated: activeIndex === index }">{{ item.icon }}</span>
    {{ item.title }}
  </span>
  <svg
    :class="{ rotated: activeIndex === index }"
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#5e2ca5"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="icon-chevron"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
</button>

    <transition name="accordion-fade">
      <div v-if="activeIndex === index" :class="['accordion-body', `body-${index}`]">
        <p>{{ item.content }}</p>
      </div>
    </transition>
  </div>
</div>

        </div>

        <div class="about-image">
          <img src="@/assets/about/about-pets.png" alt="Happy pets" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const activeIndex = ref(null)

const accordionItems = [
  {
    title: 'Responsabilidad Social',
    content: 'Apoyamos activamente a refugios de animales y promovemos la tenencia responsable mediante educación comunitaria.',
    icon: '🐾',
  },
  {
    title: 'Nuestra Misión',
    content: 'Reunir mascotas perdidas con sus familias y fomentar la adopción de animales que buscan un hogar.',
    icon: '🎯',
  },
  {
    title: '¿Qué ofrecemos?',
    content: 'Te ayudamos a reportar, encontrar, adoptar y compartir mascotas perdidas o en espera de una nueva familia.',
    icon: '💡',
  },
]


const toggle = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index
}
</script>

<style scoped>
.about-section {
  background: linear-gradient(to bottom right, #fffdfa, #f9f6f3);
  padding: 5rem 1.5rem;
}

.section-title {
  font-size: 2.6rem;
  color: #7d2ae8;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 2rem;
  letter-spacing: 1px;
}

.about-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
}

.about-text {
  flex: 1 1 500px;
}

.about-subtitle {
  font-size: 1.8rem;
  color: #222;
  margin-bottom: 1rem;
  font-weight: 700;
}

.about-description {
  color: #555;
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: justify;
  animation: fadeUp 0.8s ease both;
}

.accordion {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.accordion-item {
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.accordion-header {
  width: 100%;
  background: #fef2e5;
  padding: 1rem 1.4rem;
  font-weight: 600;
  font-size: 1.05rem;
  color: #2e2e2e;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s ease;
}

.accordion-item.active {
  box-shadow: 0 6px 20px rgba(125, 42, 232, 0.15);
  transform: translateY(-2px);
}

.accordion-header:hover {
  background-color: #9969e2;
  transform: scale(1.02);
}

.accordion-header span {
  transition: transform 0.3s ease;
}

.accordion-header .rotated {
  transform: rotate(180deg);
}

.accordion-body {
  background-color: #f4fdfc;
  padding: 1rem 1.5rem;
  font-size: 0.95rem;
  color: #444;
  line-height: 1.6;
  border-top: 1px solid #e3e3e3;
  transition: background-color 0.3s ease;
}

.accordion-header .icon-chevron {
  transition: transform 0.4s ease;
}
/* Fade animation */
.accordion-fade-enter-active,
.accordion-fade-leave-active {
  transition: all 0.3s ease;
}
.accordion-fade-enter-from,
.accordion-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.about-image {
  flex: 1 1 400px;
  display: flex;
  justify-content: center;
}

.about-image img {
  width: 100%;
  max-width: 380px;
  border-radius: 20px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12);
  object-fit: contain;
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Responsive */
@media (max-width: 768px) {
  .about-grid {
    flex-direction: column;
    text-align: center;
  }

  .about-text {
    text-align: center;
  }

  .accordion-header {
    justify-content: center;
  }
}

.body-0 {
  background-color: #e1c6e2; /* verde suave */
}

.body-1 {
  background-color: #e1c6e2; /* lila claro */
}

.body-2 {
  background-color: #e1c6e2; /* amarillo suave */
}

.icon-text {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.emoji {
  font-size: 1.2rem;
  display: inline-block;
  transition: transform 0.5s ease, color 0.5s ease;
  color: #e1c6e2;
}

.emoji.rotated {
  transform: rotate(360deg) scale(1.2);
  color: #e1c6e2;
  animation: bounce 0.4s ease-out;
}

.icon-chevron {
  transition: transform 0.3s ease;
}

.icon-chevron.rotated {
  transform: rotate(180deg);
}

@keyframes bounce {
  0% {
    transform: scale(1) translateY(0);
  }
  30% {
    transform: scale(1.2) translateY(-5px);
  }
  60% {
    transform: scale(0.95) translateY(3px);
  }
  100% {
    transform: scale(1) translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


</style>
