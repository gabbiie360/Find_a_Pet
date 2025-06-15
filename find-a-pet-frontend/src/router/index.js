import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ContactForm from '@/views/ContactView.vue'
import LoginRegisterView from '@/views/LoginRegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import PetPublicView from '@/views/PetPublicView.vue';
import ReportsView from '@/views/ReportsView.vue';
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import ResetPasswordView from '@/views/ResetPasswordView.vue';


const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/contact', name: 'Contact', component: ContactForm },
  { path: '/loginregister', name: 'LoginRegister', component: LoginRegisterView },
  { path: '/profileview', name: 'ProfileView', component: ProfileView },
  { path: '/pet/:id', name: 'pet-public', component: PetPublicView},
  { path: '/reports', name: 'ReportsView', component: ReportsView },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPasswordView },
  { path: '/reset-password/:token', name: 'ResetPassword', component: ResetPasswordView }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const user = JSON.parse(localStorage.getItem('user'));

  if (requiresAuth && !user) {
    next({ name: 'LoginRegister' });
  } else {
    next();
  }
});




export default router
