import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPerformances } from '@/api/performances'
import { genreList, GENRE_ALL_ICON, findGenreByCode } from '@/constants/genreList'
import { localList } from '@/constants/localList'
import { performanceStatusList } from '@/constants/performanceStatus'
import { PERFORMANCE_PAGE_SIZE } from '@/constants/search'
import { getTagLabel } from '@/constants/cardTag'
import type { PerformanceListItem, PerformanceViewMode } from '@/types/performance'
import { buildPerformanceListRoute, parsePerformanceListQuery } from '@/utils/performance-route'

export function usePerformances() {
  const route = useRoute()
  const router = useRouter()

  const listQuery = computed(() => parsePerformanceListQuery(route.query))

  const performances = ref<PerformanceListItem[]>([])
  const totalCount = ref(0)
  const pageSize = ref(PERFORMANCE_PAGE_SIZE)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const favoriteIds = ref<Set<number>>(new Set())
  const viewMode = ref<PerformanceViewMode>('grid')

  const totalPages = computed(() =>
    pageSize.value > 0 ? Math.ceil(totalCount.value / pageSize.value) : 0,
  )

  const showPagination = computed(
    () => !errorMessage.value && totalPages.value > 1 && totalCount.value > 0,
  )

  const activeGenreHeader = computed(() => {
    const { genre } = listQuery.value
    if (!genre) {
      return { icon: GENRE_ALL_ICON, label: '전체' }
    }
    const matched = findGenreByCode(genre)
    if (matched) {
      return { icon: matched.icon, label: matched.name }
    }
    return {
      icon: GENRE_ALL_ICON,
      label: getTagLabel(genre as Parameters<typeof getTagLabel>[0]) || genre,
    }
  })

  async function loadPerformances() {
    isLoading.value = true
    errorMessage.value = null

    try {
      const { genre, region, status, keyword, page, sort } = listQuery.value

      const response = await fetchPerformances({
        genre,
        region,
        status,
        keyword,
        page,
        size: PERFORMANCE_PAGE_SIZE,
        sort,
      })

      const maxPage =
        response.totalCount > 0 ? Math.ceil(response.totalCount / response.size) : 1

      if (page > maxPage) {
        await router.replace(
          buildPerformanceListRoute(route.query, {
            page: maxPage === 1 ? undefined : maxPage,
          }),
        )
        return
      }

      performances.value = response.items
      totalCount.value = response.totalCount
      pageSize.value = response.size
    } catch {
      errorMessage.value = '공연 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
      performances.value = []
      totalCount.value = 0
    } finally {
      isLoading.value = false
    }
  }

  watch(
    () => route.query,
    () => {
      loadPerformances()
    },
    { immediate: true, deep: true },
  )

  function updateQuery(patch: Parameters<typeof buildPerformanceListRoute>[1]) {
    router.push(buildPerformanceListRoute(route.query, patch))
  }

  function setGenre(genreCode?: string) {
    updateQuery({ genre: genreCode, page: undefined })
  }

  function setRegion(regionCode?: string) {
    updateQuery({ region: regionCode, page: undefined })
  }

  function setStatus(statusCode?: string) {
    updateQuery({ status: statusCode, page: undefined })
  }

  function setSort(sort: string) {
    updateQuery({ sort: sort === 'latest' ? undefined : sort, page: undefined })
  }

  function submitKeyword(keyword: string) {
    const trimmed = keyword.trim()
    updateQuery({ keyword: trimmed || undefined, page: undefined })
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages.value || page === listQuery.value.page) return
    updateQuery({ page: page === 1 ? undefined : page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toggleFavorite(id: number) {
    const next = new Set(favoriteIds.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    favoriteIds.value = next
  }

  function isFavorite(id: number) {
    return favoriteIds.value.has(id)
  }

  return {
    listQuery,
    performances,
    totalCount,
    totalPages,
    pageSize,
    isLoading,
    errorMessage,
    showPagination,
    viewMode,
    activeGenreHeader,
    genreList,
    localList,
    performanceStatusList,
    setGenre,
    setRegion,
    setStatus,
    setSort,
    submitKeyword,
    goToPage,
    toggleFavorite,
    isFavorite,
  }
}
