import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import About from '@/components/homeComponents/About.vue'
import ContactForm from '@/views/ContactView.vue'
import LoginRegisterView from '@/views/LoginRegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'


const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: About },
  { path: '/contact', name: 'Contact', component: ContactForm },
  { path: '/loginregister', name: 'LoginRegister', component: LoginRegisterView },
  { path: '/profileview', name: 'ProfileView', component: ProfileView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// --- 3. CREA UN "GUARDIA DE NAVEGACIÓN" GLOBAL ---
// Este código se ejecuta ANTES de cada cambio de ruta.
router.beforeEach((to, from, next) => {
  // Verificamos si la ruta a la que se intenta ir (to) requiere autenticación
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // Obtenemos al usuario de localStorage para ver si hay una sesión
  const user = JSON.parse(localStorage.getItem('user'));

  // Si la ruta requiere autenticación y NO hay usuario logueado...
  if (requiresAuth && !user) {
    // ...redirigimos al usuario a la página de login.
    next({ name: 'login' });
  } else {
    // Si no requiere auth, o si sí la requiere y el usuario está logueado, lo dejamos pasar.
    next();
  }
});

export default router
