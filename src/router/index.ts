import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'search',
          name: 'search',
          component: () => import('../views/SearchResultsView.vue'),
        },
        {
          path: 'performances/:id',
          name: 'performance-detail',
          component: () => import('../views/PerformanceDetailView.vue'),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { layout: 'auth' },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/auth/SignupView.vue'),
      meta: { layout: 'auth' },
    },
    {
      path: '/signup/success',
      name: 'signup-success',
      component: () => import('../views/auth/SignupSuccessView.vue'),
      meta: { layout: 'auth' },
    },
  ],
})

export default router
