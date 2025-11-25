import 'vue-loading-overlay/dist/css/index.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Particles (novo pacote)
import Particles from "@tsparticles/vue3"
import { loadFull } from "tsparticles"

const app = createApp(App)

app.use(router)
app.use(createPinia())

// Inicializa os particles corretamente
app.use(Particles, {
  init: async engine => {
    await loadFull(engine)
  }
})

app.mount('#app')
