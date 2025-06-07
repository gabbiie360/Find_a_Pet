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
          <li class="nav-item" v-for="(item, i) in navLinks" :key="i">
      <RouterLink class="nav-link" :to="item.path">
        {{ item.label }}
      </RouterLink>
    </li>
       <li class="nav-item d-none d-lg-block">
        <div class="nav-link-separator"></div>
    </li>
    <li class="nav-item">
      <RouterLink to="/loginregister" class="nav-link nav-link-signup">
        Sign In/Sign Up
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
  background-color: #b098d6;
  /* CLAVE 1: Damos una altura fija a la barra para tener control total. */
  height: 75px; 
  padding: 0 1rem; /* Eliminamos el padding vertical para que la altura sea exacta. */
}

/* El contenedor del logo y el texto */
.navbar-brand {
  /* CLAVE 2: Hacemos que el contenedor del logo ocupe toda la altura de la navbar. */
  /* Esto es crucial para centrar el texto verticalmente de forma correcta. */
  height: 100%; 
  position: relative; /* Mantenemos la posición relativa para el logo absoluto */
  /* ELIMINADO: Quitamos los paddings que hacían la barra más alta y desalineaban todo. */
  /* padding-top: 15px; */
  /* padding-bottom: 15px; */
}

.logo-img {
  position: absolute;
  height: 110px; /* Reducimos un poco el tamaño para un mejor balance */
  width: auto;
  /* CLAVE 3: Posicionamos el logo de forma explícita desde arriba. */
  /* Un valor negativo lo empuja hacia arriba, creando el efecto de superposición. */
  top: -30px; 
  left: 15px;
  /* ELIMINADO: La técnica de transform ya no es necesaria y era parte del problema. */
  /* transform: translateY(-60%); */
  transition: all 0.3s ease;
}

.brand-text {
  color: #ffffff;
  font-weight: 700;
  font-size: 1.6rem;
  /* CLAVE 4: Ajustamos el margen para alinear el texto correctamente al lado del nuevo tamaño del logo. */
  margin-left: 120px; 
  /* d-flex y align-items-center en el padre se encargan de la alineación vertical. */
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


@media (max-width: 991.98px) {
  .logo-img {
    height: 90px;
    top: -18px; /* Ajustamos la posición vertical para móvil */
  }

  .brand-text {
    margin-left: 100px; /* Reducimos el margen para móvil */
    font-size: 1.4rem; /* Hacemos el texto un poco más pequeño */
  }
  
  .navbar-collapse {
    background-color: rgba(97, 76, 133, 0.8); /* Un fondo más oscuro y con más opacidad */
    backdrop-filter: blur(5px); /* Efecto de desenfoque para un look moderno */
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
}

.nav-link-login {
  font-weight: 600;
}

/* Estilo para el botón de Sign Up (llamativo) */
.nav-link-signup {
  background-color: #f7de8e; /* Tu color amarillo característico */
  color: #8b7bab !important; /* Un morado oscuro del texto para contraste */
  font-weight: 700;
  padding: 8px 20px !important;
  border-radius: 20px;
  transition: all 0.3s ease;
  margin-left: 0.5rem; /* Espacio entre Login y Sign Up */
}

.nav-link-signup:hover {
  background-color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

/* Estilo para el separador vertical (opcional) */
.nav-link-separator {
    height: 25px;
    width: 1px;
    background-color: rgba(255, 255, 255, 0.3);
    margin: 0 1rem;
}

/* Ajustes para la vista móvil */
@media (max-width: 991.98px) {
    .nav-link-signup {
        width: 100%;
        text-align: center;
        margin-left: 0;
        margin-top: 10px; /* Espacio en el menú desplegado */
    }
}
</style>