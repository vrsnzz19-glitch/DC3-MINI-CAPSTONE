import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Global styles (base) + the full original Spotibai design.
import './style.css'
import './assets/spotibai.css'

createApp(App)
  // Register Vue Router — enables RouterLink / RouterView / useRoute.
  .use(router)
  .mount('#app')