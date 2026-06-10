/**
 * 전시(Exhibition) 도메인 Pinia Store
 * TODO: API 연동 시 목록/상세 fetch 액션 및 상태 확장
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useExhibitionStore = defineStore('exhibition', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  function clearError(): void {
    error.value = null
  }

  return {
    loading,
    error,
    clearError,
  }
})
