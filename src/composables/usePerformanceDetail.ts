import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPerformanceDetail } from '@/api/performanceDetail'
import type { PerformanceDetailData } from '@/types/performanceDetail'
import type { GenreTagType, StatusTagType } from '@/types/tag'
import {
  PAGE_TITLES,
  getPerformanceDetailPageTitle,
  setPageTitle,
} from '@/utils/pageTitle'

export function usePerformanceDetail() {
  const route = useRoute()

  const id = computed(() => String(route.params.id ?? ''))
  const performanceDetail = ref<PerformanceDetailData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const genreTag = computed(
    () => (performanceDetail.value?.genre ?? 'musical') as GenreTagType,
  )

  const statusTag = computed<StatusTagType>(() => {
    const raw = String(performanceDetail.value?.status ?? '')
    if (raw.includes('예정')) return 'upcomming'
    if (raw.includes('중')) return 'performing'
    if (raw.includes('완료') || raw.includes('종료')) return 'done'
    return 'upcomming'
  })

  const formattedDateRange = computed(() => {
    const detail = performanceDetail.value
    if (!detail) return ''
    const start = detail.start_date
    const end = detail.end_date
    if (!start) return ''
    if (!end || start === end) return start

    const startYear = start.slice(0, 4)
    const endYear = end.slice(0, 4)
    if (startYear === endYear) return `${start} ~ ${end.slice(5)}`
    return `${start} ~ ${end}`
  })

  const priceInfo = computed(
    () => performanceDetail.value?.price_info ?? performanceDetail.value?.pirce_info ?? '',
  )

  const castList = computed(() => {
    const cast = performanceDetail.value?.cast ?? ''
    return cast
      .replace(/\s*등\s*$/, '')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
  })

  async function loadDetail() {
    if (!id.value) {
      performanceDetail.value = null
      error.value = '공연 정보를 찾을 수 없습니다.'
      loading.value = false
      return
    }

    loading.value = true
    error.value = null

    try {
      const detail = await fetchPerformanceDetail(id.value)
      if (!detail) {
        throw new Error('empty performance detail')
      }
      performanceDetail.value = detail
    } catch (err) {
      console.error('[performance-detail] loadDetail failed:', err)
      error.value = '공연 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
      performanceDetail.value = null
    } finally {
      loading.value = false
    }
  }

  watch(id, loadDetail, { immediate: true })

  watch(
    [() => performanceDetail.value?.title, loading],
    ([title, loading]) => {
      if (route.name !== 'performance-detail') return
      if (title) {
        setPageTitle(getPerformanceDetailPageTitle(title))
      } else if (!loading) {
        setPageTitle(PAGE_TITLES.default)
      }
    },
  )

  return {
    id,
    performanceDetail,
    loading,
    error,
    data: performanceDetail,
    isLoading: loading,
    errorMessage: error,
    genreTag,
    statusTag,
    formattedDateRange,
    priceInfo,
    castList,
  }
}
