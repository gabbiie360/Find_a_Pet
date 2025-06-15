import { createRouter, createWebHistory } from 'vue-router';
// --- ¡AÑADE ESTA LÍNEA DE IMPORTACIÓN! ---
import { authStore } from '@/store/authStore';

// Tus imports de vistas existentes
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import ContactForm from '@/views/ContactView.vue';
import LoginRegisterView from '@/views/LoginRegisterView.vue';
import ProfileView from '@/views/ProfileView.vue';
import PetPublicView from '@/views/PetPublicView.vue';
import ReportsView from '@/views/ReportsView.vue';
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import ResetPasswordView from '@/views/ResetPasswordView.vue';
import AdminDashboard from '@/views/AdminDashboardView.vue';


const routes = [
  { path: '/', name: 'home', component: HomeView }, // Cambiado a 'home' para consistencia
  { path: '/about', name: 'about', component: AboutView }, // Cambiado a 'about'
  { path: '/contact', name: 'contact', component: ContactForm }, // Cambiado a 'contact'
  { path: '/login', name: 'login', component: LoginRegisterView }, // Cambiado a '/login' y name 'login'
  { path: '/profileview', name: 'profile', component: ProfileView, meta: { requiresAuth: true } }, // Cambiado a '/perfil' y name 'profile'
  { path: '/pet/:id', name: 'pet-public', component: PetPublicView},
  { path: '/reports', name: 'reports', component: ReportsView }, // Cambiado a 'reports'
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordView },
  { path: '/reset-password/:token', name: 'reset-password', component: ResetPasswordView },
  { path: '/admin', name: 'admin-dashboard', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Este guardia ahora funcionará porque `authStore` está definido
router.beforeEach((to, from, next) => {
  const user = authStore.user;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  if (requiresAuth && !user) {
    // Redirige a la página de login si la ruta requiere autenticación y no hay usuario
    next({ name: 'login' });
  } else if (requiresAdmin && user?.user?.rol !== 'admin') {
    // Si la ruta requiere ser admin y el usuario no lo es (o no existe), redirige al home
    next({ name: 'home' });
  } else {
    // En todos los demás casos, permite la navegación
    next();
  }
});

export default router;