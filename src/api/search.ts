import { SEARCH_PAGE_SIZE } from '@/constants/search'
import { mockSearchPerformances } from '@/mocks/searchPerformances'
import type { SearchPerformancesParams, SearchPerformancesResponse } from '@/types/search'

/**
 * 공연 검색 API
 * TODO: 백엔드 연동 시 fetcher로 교체
 */
export async function searchPerformances(
  params: SearchPerformancesParams,
): Promise<SearchPerformancesResponse> {
  const keyword = params.keyword.trim().toLowerCase()
  const pageNum = params.pageNum ?? 1
  const pageSize = params.pageSize ?? SEARCH_PAGE_SIZE

  const filtered = mockSearchPerformances.filter((item) => {
    if (!keyword) return false
    return (
      item.title.toLowerCase().includes(keyword) ||
      item.venue.toLowerCase().includes(keyword)
    )
  })

  const start = (pageNum - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)

  return {
    items,
    totalCount: filtered.length,
    pageNum,
    pageSize,
  }
}
