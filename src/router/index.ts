import { createRouter, createWebHistory } from 'vue-router'
import {
  PAGE_TITLES,
  getPerformanceListPageTitle,
  setPageTitle,
} from '@/utils/pageTitle'

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
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: 'search',
          name: 'search',
          component: () => import('../views/SearchResultsView.vue'),
        },
        {
          path: 'performances',
          name: 'performances',
          component: () => import('../pages/performances/PerformanceListPage.vue'),
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
        {
          path: 'ai-chat',
          name: 'ai-chat',
          component: () => import('../views/AiChatView.vue'),
        },
        {
          path: ':pathMatch(.*)*',
          name: 'not-found',
          component: () => import('../views/NotFoundView.vue'),
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
    {
      path: '/auth/callback/google',
      name: 'oauth-callback-google',
      component: () => import('../views/auth/OAuthCallbackView.vue'),
      props: { provider: 'google' },
      meta: { layout: 'auth' },
    },
    {
      path: '/auth/callback/naver',
      name: 'oauth-callback-naver',
      component: () => import('../views/auth/OAuthCallbackView.vue'),
      props: { provider: 'naver' },
      meta: { layout: 'auth' },
    },
    {
      path: '/auth/callback/kakao',
      name: 'oauth-callback-kakao',
      component: () => import('../views/auth/OAuthCallbackView.vue'),
      props: { provider: 'kakao' },
      meta: { layout: 'auth' },
    },
  ],
})

router.afterEach((to) => {
  switch (to.name) {
    case 'home':
      setPageTitle(PAGE_TITLES.home)
      break
    case 'search':
      setPageTitle(PAGE_TITLES.search)
      break
    case 'performances':
      setPageTitle(
        getPerformanceListPageTitle(
          to.query.genre ? String(to.query.genre) : undefined,
        ),
      )
      break
    case 'performance-detail':
      break
    case 'not-found':
      setPageTitle(PAGE_TITLES.notFound)
      break
    case 'ai-chat':
      setPageTitle(PAGE_TITLES.aiChat)
      break
    default:
      setPageTitle(PAGE_TITLES.default)
  }
})

export default router
