/**
 * 공연(Performance) 도메인 Pinia Store
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getPerformances } from '@/api/performances'
import { PERFORMANCE_PAGE_SIZE } from '@/constants/search'
import type { PerformanceListItem, PerformancesParams } from '@/types/performance'

export const usePerformanceStore = defineStore('performance', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const performances = ref<PerformanceListItem[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(PERFORMANCE_PAGE_SIZE)

  function clearError(): void {
    error.value = null
  }

  async function fetchPerformanceList(params: PerformancesParams): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await getPerformances(params)

      performances.value = response.items
      total.value = response.totalCount
      page.value = response.page
      pageSize.value = response.pageSize
    } catch (err) {
      console.error('[performance] fetchPerformanceList failed:', err)
      error.value = '공연 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
      performances.value = []
      total.value = 0
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    performances,
    total,
    page,
    pageSize,
    clearError,
    fetchPerformanceList,
  }
})
