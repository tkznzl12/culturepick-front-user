import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPerformanceDetail } from '@/api/performanceDetail'
import type { PerformanceDetailData } from '@/types/performanceDetail'
import type { GenreTagType, StatusTagType } from '@/types/tag'

export function usePerformanceDetail() {
  const route = useRoute()

  const id = computed(() => String(route.params.id ?? ''))
  const data = ref<PerformanceDetailData | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  const genreTag = computed(() => (data.value?.genre ?? 'musical') as GenreTagType)

  const statusTag = computed<StatusTagType>(() => {
    const raw = String(data.value?.status ?? '')
    if (raw.includes('예정')) return 'upcomming'
    if (raw.includes('중')) return 'performing'
    if (raw.includes('완료') || raw.includes('종료')) return 'done'
    return 'upcomming'
  })

  const formattedDateRange = computed(() => {
    const detail = data.value
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
    () => data.value?.price_info ?? data.value?.pirce_info ?? '',
  )

  const castList = computed(() => {
    const cast = data.value?.cast ?? ''
    return cast
      .replace(/\s*등\s*$/, '')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
  })

  async function loadDetail() {
    if (!id.value) {
      data.value = null
      errorMessage.value = '공연 정보를 찾을 수 없습니다.'
      isLoading.value = false
      return
    }

    isLoading.value = true
    errorMessage.value = null

    try {
      data.value = await fetchPerformanceDetail(id.value)
    } catch {
      errorMessage.value = '공연 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
      data.value = null
    } finally {
      isLoading.value = false
    }
  }

  watch(id, loadDetail, { immediate: true })

  return {
    id,
    data,
    isLoading,
    errorMessage,
    genreTag,
    statusTag,
    formattedDateRange,
    priceInfo,
    castList,
  }
}
