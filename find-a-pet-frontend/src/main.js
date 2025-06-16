import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { ObserveVisibility } from 'vue-observe-visibility'
import fadeInOnScroll from './directives/fadeInOnScroll';

// --- Dependencias de Estilos ---
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'animate.css'
import './styles/custom-buttons.css'

// --- 1. IMPORTACIONES DE FONT AWESOME ---
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons' // Importa los iconos específicos

// --- 2. AÑADE LOS ICONOS A LA LIBRERÍA GLOBAL ---
library.add(faTrash, faPenToSquare)


// --- Creación de la aplicación ---
const app = createApp(App)

app.use(router)

// --- Registro de directivas ---
app.directive('fade-in-on-scroll', fadeInOnScroll)
app.directive('observe-visibility', ObserveVisibility)

// --- 3. REGISTRA EL COMPONENTE DE FONT AWESOME GLOBALMENTE ---
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')