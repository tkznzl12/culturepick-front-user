import { PERFORMANCE_PAGE_SIZE } from '@/constants/search'
import { mockPerformances } from '@/mocks/performances'
import type { PerformancesParams, PerformancesResponse } from '@/types/performance'

function sortPerformances<T extends { start_date: string; rating?: number; reviewCount?: number }>(
  items: T[],
  sort?: string,
): T[] {
  const list = [...items]

  switch (sort) {
    case 'rating':
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    case 'popular':
      return list.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    case 'latest':
    default:
      return list.sort((a, b) => b.start_date.localeCompare(a.start_date))
  }
}

/**
 * 공연 목록 API
 * TODO: 백엔드 연동 시 fetcher로 교체
 */
export async function fetchPerformances(
  params: PerformancesParams,
): Promise<PerformancesResponse> {
  const page = params.page ?? 1
  const size = params.size ?? PERFORMANCE_PAGE_SIZE
  const keyword = params.keyword?.trim().toLowerCase() ?? ''

  let filtered = mockPerformances.filter((item) => {
    if (params.genre && item.genre !== params.genre) return false
    if (params.region && item.region !== params.region) return false
    if (params.status && item.status !== params.status) return false
    if (
      keyword &&
      !item.title.toLowerCase().includes(keyword) &&
      !item.venue.toLowerCase().includes(keyword)
    ) {
      return false
    }
    return true
  })

  filtered = sortPerformances(filtered, params.sort)

  const start = (page - 1) * size
  const items = filtered.slice(start, start + size)

  return {
    items,
    totalCount: filtered.length,
    page,
    size,
  }
}
