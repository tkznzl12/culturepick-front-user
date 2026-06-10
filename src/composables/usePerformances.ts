import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { genreList, GENRE_ALL_ICON, findGenreByCode } from '@/constants/genreList'
import { localList } from '@/constants/localList'
import { performanceStatusList } from '@/constants/performanceStatus'
import { PERFORMANCE_PAGE_SIZE } from '@/constants/search'
import { getTagLabel } from '@/constants/cardTag'
import { usePerformanceStore } from '@/stores/performance'
import type { PerformanceViewMode } from '@/types/performance'
import { buildPerformanceListRoute, parsePerformanceListQuery } from '@/utils/performance-route'

export function usePerformances() {
  const route = useRoute()
  const router = useRouter()
  const performanceStore = usePerformanceStore()

  const listQuery = computed(() => parsePerformanceListQuery(route.query))

  const performances = computed(() => performanceStore.performances)
  const totalCount = computed(() => performanceStore.total)
  const pageSize = computed(() => performanceStore.pageSize)
  const isLoading = computed(() => performanceStore.loading)
  const errorMessage = computed(() => performanceStore.error)
  const favoriteIds = ref<Set<string | number>>(new Set())
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
    const { genre, region, status, keyword, page, sort } = listQuery.value

    try {
      await performanceStore.fetchPerformanceList({
        genre,
        region,
        status,
        keyword,
        page,
        pageSize: PERFORMANCE_PAGE_SIZE,
        sort,
      })

      const maxPage =
        performanceStore.total > 0
          ? Math.ceil(performanceStore.total / performanceStore.pageSize)
          : 1

      if (page > maxPage) {
        await router.replace(
          buildPerformanceListRoute(route.query, {
            page: maxPage === 1 ? undefined : maxPage,
          }),
        )
      }
    } catch {
      // 에러 메시지는 store에서 관리
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

  function toggleFavorite(id: string | number) {
    const next = new Set(favoriteIds.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    favoriteIds.value = next
  }

  function isFavorite(id: string | number) {
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
