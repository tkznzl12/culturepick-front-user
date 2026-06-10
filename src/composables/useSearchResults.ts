import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchPerformances } from '@/api/search'
import { SEARCH_PAGE_SIZE } from '@/constants/search'
import type { SearchResultItem } from '@/types/search'
import { buildSearchRoute } from '@/utils/search-route'

export function useSearchResults() {
  const route = useRoute()
  const router = useRouter()

  const keyword = computed(() => String(route.query.keyword ?? '').trim())
  const pageNum = computed(() => {
    const parsed = Number(route.query.pageNum)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
  })

  const searchResults = ref<SearchResultItem[]>([])
  const totalCount = ref(0)
  const pageSize = ref(SEARCH_PAGE_SIZE)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const favoriteIds = ref<Set<string | number>>(new Set())
  const loadedKeyword = ref('')

  const totalPages = computed(() =>
    pageSize.value > 0 ? Math.ceil(totalCount.value / pageSize.value) : 0,
  )

  const showPagination = computed(
    () =>
      Boolean(keyword.value) &&
      !errorMessage.value &&
      totalPages.value > 1 &&
      totalCount.value > 0,
  )

  async function loadResults() {
    if (!keyword.value) {
      searchResults.value = []
      totalCount.value = 0
      errorMessage.value = null
      loadedKeyword.value = ''
      isLoading.value = false
      return
    }

    const isKeywordChange = loadedKeyword.value !== keyword.value
    if (isKeywordChange) {
      isLoading.value = true
      searchResults.value = []
      totalCount.value = 0
      errorMessage.value = null
    }

    try {
      const response = await searchPerformances({
        keyword: keyword.value,
        pageNum: pageNum.value,
      })

      const maxPage =
        response.totalCount > 0
          ? Math.ceil(response.totalCount / response.pageSize)
          : 1

      if (pageNum.value > maxPage) {
        await router.replace(buildSearchRoute(keyword.value, maxPage))
        return
      }

      searchResults.value = response.items
      totalCount.value = response.totalCount
      pageSize.value = response.pageSize
      loadedKeyword.value = keyword.value
      errorMessage.value = null
    } catch (error) {
      console.error('공연 검색 API 호출 실패:', error)
      errorMessage.value = '검색 결과를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
      if (isKeywordChange) {
        searchResults.value = []
        totalCount.value = 0
      }
    } finally {
      isLoading.value = false
    }
  }

  watch([keyword, pageNum], loadResults, { immediate: true })

  function submitSearch(nextKeyword: string) {
    const trimmed = nextKeyword.trim()
    if (!trimmed) return
    router.push(buildSearchRoute(trimmed, 1))
  }

  function goToPage(page: number) {
    if (!keyword.value) return
    if (page < 1 || page > totalPages.value || page === pageNum.value) return
    router.push(buildSearchRoute(keyword.value, page))
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
    keyword,
    pageNum,
    totalPages,
    showPagination,
    results: searchResults,
    searchResults,
    totalCount,
    isLoading,
    errorMessage,
    submitSearch,
    goToPage,
    toggleFavorite,
    isFavorite,
  }
}
