import { fetcher } from '@/api/client'
import { ApiEndpoints } from '@/constants/api'
import { TAG_LABELS } from '@/constants/cardTag'
import { genreList } from '@/constants/genreList'
import type { GenreTagType, StatusTagType } from '@/types/tag'
import type {
  SearchPerformancesApiResponse,
  SearchPerformancesParams,
  SearchPerformancesResponse,
  SearchResultItem,
} from '@/types/search'

const SEARCH_API_PAGE_SIZE = 10
const GENRE_CODES = new Set<string>(genreList.map((genre) => genre.code))
const STATUS_CODES = new Set<StatusTagType>(['upcomming', 'performing', 'done'])

function buildQueryString(params: Record<string, string | number | undefined | null>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    searchParams.append(key, String(value))
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

function mapGenreToCode(genre: string): GenreTagType | string {
  if (GENRE_CODES.has(genre)) return genre

  const matchedByName = genreList.find((item) => item.name === genre)
  if (matchedByName) return matchedByName.code

  const matchedByLabel = Object.entries(TAG_LABELS).find(
    ([code, label]) => label === genre && GENRE_CODES.has(code),
  )
  return matchedByLabel ? matchedByLabel[0] : genre
}

function mapStatusToCode(status: string): StatusTagType | string {
  if (STATUS_CODES.has(status as StatusTagType)) return status

  const matchedByLabel = Object.entries(TAG_LABELS).find(
    ([code, label]) => label === status && STATUS_CODES.has(code as StatusTagType),
  )
  return matchedByLabel ? (matchedByLabel[0] as StatusTagType) : status
}

function mapSearchItem(item: SearchPerformancesApiResponse['searchData'][number]): SearchResultItem {
  return {
    id: item.performance_id,
    performance_id: item.performance_id,
    title: item.title,
    genre: mapGenreToCode(item.genre),
    start_date: item.start_date,
    end_date: item.end_date,
    price_info: '',
    status: mapStatusToCode(item.status),
    venue: item.venue?.name ?? '',
    img: item.poster_url,
  }
}

/**
 * 공연 검색 API
 */
export async function searchPerformances(
  params: SearchPerformancesParams,
): Promise<SearchPerformancesResponse> {
  const keyword = params.keyword.trim()
  const pageNum = params.pageNum ?? 1
  const pageSize = params.pageSize ?? SEARCH_API_PAGE_SIZE

  const query = buildQueryString({
    keyword: keyword || undefined,
    pageNum,
    pageSize,
  })

  const response = await fetcher<SearchPerformancesApiResponse>(`${ApiEndpoints.performances}${query}`)

  return {
    items: response.searchData.map(mapSearchItem),
    totalCount: response.total,
    pageNum: response.pageNum ?? response.page ?? pageNum,
    pageSize: response.pageSize ?? response.page_size ?? pageSize,
  }
}
