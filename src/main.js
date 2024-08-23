import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'

// Attach axios to the global properties
const app = createApp(App)
app.config.globalProperties.$axios = axios

// Use the router
app.use(router)

// Mount the app
app.mount('#app')
