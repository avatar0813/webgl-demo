import { createApp } from 'vue'
import App from './App.vue'
import '@/css/index.css'
import 'normalize.css'
import router from '@/router'

const app = createApp(App)
app.use(router)
app.mount('#app')
