/** 검색 결과 페이지당 노출 개수 */
export const SEARCH_PAGE_SIZE = 12

/** 공연 목록 페이지당 노출 개수 */
export const PERFORMANCE_PAGE_SIZE = 12

export const PERFORMANCE_SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '평점순', value: 'rating' },
  { label: '인기순', value: 'popular' },
] as const

export type PerformanceSortValue = (typeof PERFORMANCE_SORT_OPTIONS)[number]['value']
