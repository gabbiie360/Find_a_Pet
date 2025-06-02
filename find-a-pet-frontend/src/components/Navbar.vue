<template>
  <nav
    class="navbar navbar-expand-lg custom-navbar fixed-top animate__animated animate__fadeInDown"
  >
    <div class="container">
      <!-- Logo + Título -->
      <RouterLink class="navbar-brand d-flex align-items-center" to="/">
        <img
          src="@/assets/logo.jpg"
          alt="Find a Pet"
          class="logo-img me-2 animate__animated animate__fadeInLeft"
        />
        <span class="brand-text animate__animated animate__fadeIn animate__delay-1s"
          >Find a Pet</span
        >
      </RouterLink>

      <!-- Toggler para móvil -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Links de Navegación -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item" v-for="(item, i) in navLinks" :key="i">
            <RouterLink
              class="nav-link animate__animated animate__fadeInUp"
              :class="`animate__delay-${i + 2}s`"
              :to="item.path"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap');

.custom-navbar {
  background-color: #7e4cc9; /* Morado fijo */
  padding: 0.8rem 1rem;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logo-img {
  height: 42px;
}

.brand-text {
  color: #ffffff;
  font-weight: 700;
  font-size: 1.5rem;
}

.navbar-nav .nav-link {
  color: #ffffff;
  margin-left: 1rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.navbar-nav .nav-link:hover {
  background-color: rgba(255, 255, 252, 0.2); /* Como cuadrito hover */
  color: #fff700;
}

.navbar-nav .nav-link::after {
  content: '';
  display: block;
  width: 0;
  height: 2px;
  background: #ffd700;
  transition: width 0.3s ease;
  margin-top: 4px;
}

.navbar-nav .nav-link:hover::after {
  width: 100%;
}

.navbar-nav .router-link-exact-active {
  background-color: #ffd700;
  color: #5e2ca5;
  font-weight: 700;
}
</style>
