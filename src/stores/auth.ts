import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { AUTH_CHANGED_EVENT, getCurrentUserId } from '@/utils/auth-cookie'

interface AuthUser {
  id: number | null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser>({
    id: getCurrentUserId(),
  })

  const isAuthenticated = computed(() => user.value.id !== null)

  function syncUserFromToken() {
    user.value = {
      id: getCurrentUserId(),
    }
  }

  function bindAuthChangeListener() {
    window.addEventListener(AUTH_CHANGED_EVENT, syncUserFromToken)
  }

  function unbindAuthChangeListener() {
    window.removeEventListener(AUTH_CHANGED_EVENT, syncUserFromToken)
  }

  function resetAuthState() {
    user.value = { id: null }
  }

  return {
    user,
    isAuthenticated,
    syncUserFromToken,
    bindAuthChangeListener,
    unbindAuthChangeListener,
    resetAuthState,
  }
})
