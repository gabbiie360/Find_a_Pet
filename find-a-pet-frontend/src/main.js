import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { ObserveVisibility } from 'vue-observe-visibility'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'animate.css'

const app = createApp(App)

app.use(router)
app.directive('observe-visibility', ObserveVisibility) // ✅ Registro de la directiva

app.mount('#app')
