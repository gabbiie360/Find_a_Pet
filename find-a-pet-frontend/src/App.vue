<template>
  <div id="app">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/generalComponents/Navbar.vue'
</script>

<style scoped>
/*Fondo claro y Fuente base */
body {
  background-color: #fff;
  color: #333;
  margin: 0;
  font-family: 'Lato', sans-serif;
} /* <--- AGREGA ESTA LLAVE DE CIERRE */

main {
  padding: 0;
  margin: 0;
}

#app {
  min-height: 100vh;
}

/*Corrige el body en modo oscuro de Vite */
html {
  background-color: #fff;
}

.before-visible {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease;
}

.visible {
  opacity: 1;
  transform: translateY(0);
}

</style>