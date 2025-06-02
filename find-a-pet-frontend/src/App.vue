<template>
  <div id="app">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<style>
/*Fondo claro y Fuente base */
body {
  background-color: #fff;
  color: #333;
  margin: 0;
  font-family: 'Lato', sans-serif;
}

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
</style>
