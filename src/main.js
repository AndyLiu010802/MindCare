import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'

// Attach axios to the global properties
const app = createApp(App)
app.config.globalProperties.$axios = axios

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB0VprwFOdp2GRib75LhGEAUs6hqPO6LXk',
  authDomain: 'mindcare-4e1aa.firebaseapp.com',
  projectId: 'mindcare-4e1aa',
  storageBucket: 'mindcare-4e1aa.appspot.com',
  messagingSenderId: '421526877442',
  appId: '1:421526877442:web:fbe90dbea6d44067d9be1b',
  measurementId: 'G-LS18FYWPCY'
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const analytics = getAnalytics(firebaseApp)

// Use the router
app.use(router)

// Mount the app
app.mount('#app')
