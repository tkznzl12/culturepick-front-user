import { fetcher } from '@/api/client'
import { ApiEndpoints } from '@/constants/api'
import { TAG_LABELS } from '@/constants/cardTag'
import { genreList } from '@/constants/genreList'
import { localList } from '@/constants/localList'
import { PERFORMANCE_PAGE_SIZE } from '@/constants/search'
import type {
  PerformanceApiItem,
  PerformanceListItem,
  PerformancesApiResponse,
  PerformancesParams,
  PerformancesResponse,
} from '@/types/performance'
import type { GenreTagType, StatusTagType } from '@/types/tag'

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

function mapSidoToRegionCode(sido: string): string {
  const matched = localList.find(
    (item) => item.value === sido || item.name === sido || item.code === sido,
  )
  return matched?.code ?? sido
}

function mapPerformanceApiItem(item: PerformanceApiItem): PerformanceListItem {
  return {
    id: item.performance_id,
    title: item.title,
    genre: mapGenreToCode(item.genre),
    start_date: item.start_date,
    end_date: item.end_date,
    price_info: '',
    status: mapStatusToCode(item.status),
    venue: item.venue.name,
    img: item.poster_url,
    region: mapSidoToRegionCode(item.venue.sido),
    runtime: item.runtime,
    age_rating: item.age_rating,
    view_count: item.view_count,
    zzim_count: item.zzim_count,
    reviewCount: item.zzim_count,
    is_interested: Boolean(item.is_interested),
  }
}

/**
 * 공연 목록 조회 API
 */
export async function getPerformances(params: PerformancesParams): Promise<PerformancesResponse> {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? PERFORMANCE_PAGE_SIZE

  const query = buildQueryString({
    keyword: params.keyword?.trim() || undefined,
    genre: params.genre,
    region: params.region,
    status: params.status,
    sort: params.sort,
    page,
    page_size: pageSize,
  })

  const data = await fetcher<PerformancesApiResponse>(`${ApiEndpoints.performances}${query}`)


  return {
    items: data.searchData.map(mapPerformanceApiItem),
    totalCount: data.total,
    page: data.page ?? data.pageNum ?? page,
    pageSize: data.pageSize ?? data.page_size ?? pageSize,
  }
}

/** @deprecated getPerformances 사용 */
export const fetchPerformances = getPerformances
