import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ResourcesView from '../views/ResourcesView.vue'
import ConsultationView from '../views/ConsultationView.vue'
import ProfileView from '../views/ProfileView.vue'
import StatisticView from '../views/StatisticView.vue'
import ChatView from '../views/ChatView.vue'
import AppointmentView from '../views/AppointmentView.vue'
import LibraryView from '../views/LibraryView.vue'
import MapView from '../views/MapView.vue'
import ResourceDetailsView from '../views/ResourceDetailsView.vue'
import SignUpView from '../views/SignUpView.vue'
import ManagementView from '../views/ManagementView.vue'
import FeedbackView from '../views/FeedbackView.vue'
import { authState } from '@/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/resources', name: 'resources', component: ResourcesView },
    {
      path: '/resource/:title',
      name: 'ResourceDetails',
      component: ResourceDetailsView
    },
    { path: '/consultation', name: 'consultation', component: ConsultationView },
    { path: '/profile', name: 'profile', component: ProfileView },
    { path: '/statistic', name: 'statistic', component: StatisticView },
    { path: '/chat', name: 'chat', component: ChatView },
    { path: '/appointment', name: 'appointment', component: AppointmentView },
    { path: '/library', name: 'library', component: LibraryView },
    { path: '/map', name: 'map', component: MapView },
    { path: '/signup', name: 'signup', component: SignUpView },
    { path: '/management', name: 'management', component: ManagementView },
    { path: '/feedback', name: 'feedback', component: FeedbackView }
  ]
})

router.beforeEach((to, from, next) => {
  const protectedRoutes = ['profile', 'chat', 'appointment', 'map', 'consultation']
  const supportRoutes = ['management', 'feedback']
  const normalRoutes = ['consultation', 'map', 'appointment']

  if (protectedRoutes.includes(to.name) && !authState.isAuthenticated) {
    // Redirect to the login page
    next({ name: 'signup' })
  } else if (supportRoutes.includes(to.name) && authState.accountType !== 'support') {
    alert('You are not authorized to access this page')
    next({ name: 'home' })
  } else if (normalRoutes.includes(to.name) && authState.accountType === 'support') {
    alert('You are not authorized to access this page')
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
