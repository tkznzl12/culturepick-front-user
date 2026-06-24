import { createRouter, createWebHistory } from 'vue-router'
import { SiteRouter } from '@/constants/routes'
import { getAccessToken } from '@/utils/auth-cookie'
import {
  createLoginLocationWithRedirect,
  resolveRedirectPath,
} from '@/utils/auth-redirect'
import { showAuthRequiredToast } from '@/utils/auth-toast'
import {
  PAGE_TITLES,
  getPerformanceListPageTitle,
  setPageTitle,
} from '@/utils/pageTitle'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return { top: 0, left: 0 }
  },
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
          meta: { requiresAuth: true },
        },
        {
          path: 'community',
          name: 'community',
          component: () => import('../views/community/CommunityView.vue'),
        },
        {
          path: 'community/edit',
          name: 'community-create',
          component: () => import('../views/community/CommunityFormView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'community/edit/:id',
          name: 'community-edit',
          component: () => import('../views/community/CommunityFormView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'community/:id',
          name: 'community-detail',
          component: () => import('../views/community/CommunityDetailView.vue'),
        },
        {
          path: 'mypage',
          name: 'mypage',
          component: () => import('../views/mypage/MyPageView.vue'),
          meta: { requiresAuth: true },
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
      meta: { layout: 'auth', guestOnly: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/auth/SignupView.vue'),
      meta: { layout: 'auth', guestOnly: true },
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

router.beforeEach((to, from) => {
  const isAuthenticated = Boolean(getAccessToken())

  if (to.name === 'ai-chat' && !isAuthenticated) {
    showAuthRequiredToast('AI 추천은 로그인 후 이용할 수 있어요.')

    const isFromAuthPage = from.meta.layout === 'auth'
    const isInitialNavigation = !from.name

    if (isFromAuthPage || isInitialNavigation) {
      return {
        path: SiteRouter.index,
        replace: true,
      }
    }

    return false
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      ...createLoginLocationWithRedirect(to.fullPath),
      replace: true,
    }
  }

  if (to.meta.guestOnly && isAuthenticated) {
    const fallbackPath =
      from.name && from.fullPath !== to.fullPath
        ? resolveRedirectPath(from.fullPath, SiteRouter.index)
        : SiteRouter.index
    const redirectPath = resolveRedirectPath(to.query.redirect, fallbackPath)

    return {
      path: redirectPath,
      replace: true,
    }
  }

  return true
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
    case 'community':
    case 'community-create':
    case 'community-edit':
    case 'community-detail':
      setPageTitle(PAGE_TITLES.community)
      break
    case 'mypage':
      setPageTitle(PAGE_TITLES.mypage)
      break
    default:
      setPageTitle(PAGE_TITLES.default)
  }
})

export default router
