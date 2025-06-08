<template>
  <nav
    class="navbar navbar-expand-lg custom-navbar fixed-top animate__animated animate__fadeInDown"
  >
    <div class="container">
      <!-- Logo + Título -->
      <RouterLink class="navbar-brand d-flex align-items-center" to="/">
        <img
          src="@/assets/logo.png"
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
        <ul class="navbar-nav align-items-center">
          <!-- Links Estáticos -->
          <li class="nav-item" v-for="(item, i) in navLinks" :key="i">
            <RouterLink class="nav-link" :to="item.path">
              {{ item.label }}
            </RouterLink>
          </li>
          
          <!-- ========================================================== -->
          <!--       SECCIÓN DINÁMICA DE AUTENTICACIÓN (LOGIN/LOGOUT)     -->
          <!-- ========================================================== -->

          <!-- CASO 1: NO HAY USUARIO LOGUEADO -->
          <template v-if="!authStore.user">
            <li class="nav-item d-none d-lg-block">
              <div class="nav-link-separator"></div>
            </li>
            <li class="nav-item">
              <RouterLink to="/loginregister" class="nav-link nav-link-signup">
                Sign In/Sign Up
              </RouterLink>
            </li>
          </template>

          <!-- CASO 2: SÍ HAY USUARIO LOGUEADO -->
          <template v-else>
            <li class="nav-item d-none d-lg-block">
              <div class="nav-link-separator"></div>
            </li>
            <!-- Enlace al Perfil -->
            <li class="nav-item">
              <RouterLink to="/perfil" class="nav-link">
                Mi Perfil
              </RouterLink>
            </li>
            <!-- Botón para Cerrar Sesión -->
            <li class="nav-item">
              <a href="#" @click.prevent="handleLogout" class="nav-link nav-link-logout">
                Cerrar Sesión
              </a>
            </li>
          </template>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
// Importa el store de autenticación que creamos
import { authStore } from '@/store/authStore';

// Links estáticos de navegación que no cambian
const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const router = useRouter();

// Función que se ejecuta al hacer clic en "Cerrar Sesión"
const handleLogout = () => {
  // Llama a la función logout de nuestro store para limpiar los datos
  authStore.logout();
  // Redirige al usuario a la página de inicio
  router.push('/');
};
</script>

<style scoped>
/* ==================================================================== */
/*                  TUS ESTILOS ORIGINALES (INTACTOS)                   */
/* ==================================================================== */

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap');

.custom-navbar {
  background-color: #b098d6;
  height: 75px; 
  padding: 0 1rem;
}

.navbar-brand {
  height: 100%; 
  position: relative;
}

.logo-img {
  position: absolute;
  height: 110px;
  width: auto;
  top: -30px; 
  left: 15px;
  transition: all 0.3s ease;
}

.brand-text {
  color: #ffffff;
  font-weight: 700;
  font-size: 1.6rem;
  margin-left: 120px; 
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
  background-color: rgba(255, 255, 252, 0.2);
  color: #fff700;
}

.navbar-nav .router-link-exact-active {
  background-color: #f7de8e;
  color: #b098d6;
  font-weight: 700;
}

.navbar-toggler {
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.8%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.nav-link-signup {
  background-color: #f7de8e;
  color: #8b7bab !important;
  font-weight: 700;
  padding: 8px 20px !important;
  border-radius: 20px;
  transition: all 0.3s ease;
  margin-left: 0.5rem;
}

.nav-link-signup:hover {
  background-color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.nav-link-separator {
    height: 25px;
    width: 1px;
    background-color: rgba(255, 255, 255, 0.3);
    margin: 0 1rem;
}

/* ==================================================================== */
/*    NUEVA CLASE PARA EL BOTÓN DE LOGOUT (PUEDES AJUSTARLA)    */
/* ==================================================================== */
.nav-link-logout {
  background-color: #e6a8a8; /* Un rojo suave para diferenciarlo */
  color: #5c2121 !important;
  font-weight: 700;
  padding: 8px 20px !important;
  border-radius: 20px;
  transition: all 0.3s ease;
  margin-left: 0.5rem;
  cursor: pointer; /* Importante para que parezca un botón */
}

.nav-link-logout:hover {
  background-color: #f8d7da;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}


/* Ajustes para la vista móvil */
@media (max-width: 991.98px) {
  .logo-img {
    height: 90px;
    top: -18px;
  }

  .brand-text {
    margin-left: 100px;
    font-size: 1.4rem;
  }
  
  .navbar-collapse {
    background-color: rgba(97, 76, 133, 0.8);
    backdrop-filter: blur(5px);
    border-radius: 8px;
    margin-top: 15px;
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .navbar-nav .nav-item {
    text-align: center;
    margin-bottom: 5px;
  }

  .navbar-nav .nav-link {
    margin-left: 0;
  }

  .nav-link-signup, .nav-link-logout {
      width: 100%;
      text-align: center;
      margin-left: 0;
      margin-top: 10px;
  }
}
</style>