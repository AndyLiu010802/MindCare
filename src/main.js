import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(faQuestionCircle)

// Attach axios to the global properties
const app = createApp(App)
app.config.globalProperties.$axios = axios
app.component('font-awesome-icon', FontAwesomeIcon)

// Use the router
app.use(router)

// Mount the app
app.mount('#app')
