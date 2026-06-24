/**
 * 사용자(User) 도메인 Pinia Store
 * TODO: API 연동 시 프로필/인증 관련 fetch 액션 및 상태 확장
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  function clearError(): void {
    error.value = null
  }

  function resetUserState(): void {
    loading.value = false
    error.value = null
  }

  return {
    loading,
    error,
    clearError,
    resetUserState,
  }
})
