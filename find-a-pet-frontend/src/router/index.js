import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import About from '@/components/homeComponents/About.vue'
import ContactForm from '@/views/ContactView.vue'
import LoginRegisterView from '@/views/LoginRegisterView.vue'


const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/about', name: 'About', component: About },
  { path: '/contact', name: 'Contact', component: ContactForm },
  { path: '/loginregister', name: 'LoginRegister', component: LoginRegisterView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
