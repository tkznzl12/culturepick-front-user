<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { SiteRouter } from '@/constants/routes'
import { AUTH_TOAST_EVENT, showAuthRequiredToast } from '@/utils/auth-toast'
import { AUTH_CHANGED_EVENT, getAccessToken } from '@/utils/auth-cookie'
import { createLoginLocationWithRedirect } from '@/utils/auth-redirect'

const router = useRouter()
const route = useRoute()
const isAuthToastVisible = ref(false)
const authToastMessage = ref('')
let authToastTimer: ReturnType<typeof setTimeout> | null = null

function hideAuthToast() {
  isAuthToastVisible.value = false
  if (authToastTimer) {
    clearTimeout(authToastTimer)
    authToastTimer = null
  }
}

function onAuthRequiredToast(event: Event) {
  const customEvent = event as CustomEvent<{ message?: string }>
  authToastMessage.value =
    customEvent.detail?.message?.trim() || '로그인이 필요한 서비스 입니다'
  isAuthToastVisible.value = true

  if (authToastTimer) {
    clearTimeout(authToastTimer)
  }

  authToastTimer = setTimeout(() => {
    isAuthToastVisible.value = false
    authToastTimer = null
  }, 1800)
}

async function guardCurrentProtectedRoute() {
  if (!route.meta.requiresAuth) return
  if (getAccessToken()) return

  if (route.name === 'ai-chat') {
    showAuthRequiredToast('AI 추천은 로그인 후 이용할 수 있어요.')
    await router.replace(SiteRouter.index)
    return
  }

  await router.replace(createLoginLocationWithRedirect(route.fullPath))
}

function onPageShow(event: PageTransitionEvent) {
  if (!event.persisted) return
  void guardCurrentProtectedRoute()
}

function onAuthChanged() {
  void guardCurrentProtectedRoute()
}

onMounted(() => {
  window.addEventListener(AUTH_TOAST_EVENT, onAuthRequiredToast)
  window.addEventListener('pageshow', onPageShow)
  window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged)
  void guardCurrentProtectedRoute()
})

onBeforeUnmount(() => {
  window.removeEventListener(AUTH_TOAST_EVENT, onAuthRequiredToast)
  window.removeEventListener('pageshow', onPageShow)
  window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged)
  hideAuthToast()
})
</script>

<template>
  <RouterView />

  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="-translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-2 opacity-0"
  >
    <div
      v-if="isAuthToastVisible"
      class="fixed top-24 left-1/2 -translate-x-1/2 rounded-xl border border-[#51A2FF]/35 bg-[#0f1a31]/95 px-4 py-2 text-sm font-semibold text-[#cbe3ff] shadow-lg backdrop-blur md:top-20"
      style="z-index: var(--z-toast)"
      role="status"
      aria-live="polite"
    >
      {{ authToastMessage }}
    </div>
  </Transition>
</template>
