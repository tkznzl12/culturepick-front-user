import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

function loadFonts() {
  void import('./assets/fonts/wanted-sans.css')
}

if ('requestIdleCallback' in globalThis) {
  requestIdleCallback(() => loadFonts())
} else {
  setTimeout(loadFonts, 1)
}
