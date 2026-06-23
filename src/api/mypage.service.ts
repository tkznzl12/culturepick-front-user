import { buildApiUrl } from '@/api/index'
import { TAG_LABELS } from '@/constants/cardTag'
import { genreList } from '@/constants/genreList'
import type {
  FavoritePerformance,
  MyInterestsApiResponse,
  MyPageTab,
  MyPerformanceApiItem,
  MyPost,
  MyPostApiItem,
  MyPostsApiResponse,
  MyProfileApiResponse,
  MyWatchlistApiResponse,
  PlannedPerformance,
  UserProfile,
} from '@/types/mypage'
import type { GenreTagType } from '@/types/tag'
import { getAccessToken } from '@/utils/auth-cookie'
import { stripHtml } from '@/utils/stripHtml'

export class MyPageServiceError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'MyPageServiceError'
    this.status = status
  }
}

const GENRE_CODES = new Set<GenreTagType>(genreList.map((genre) => genre.code as GenreTagType))

function mapGenreTag(genre?: string): GenreTagType {
  if (!genre) return 'musical'

  const normalized = genre.trim()
  if (GENRE_CODES.has(normalized as GenreTagType)) {
    return normalized as GenreTagType
  }

  const lower = normalized.toLowerCase()
  const aliasMap: Record<string, GenreTagType> = {
    musical: 'musical',
    play: 'play',
    classic: 'classic',
    koreanmusic: 'koreanMusic',
    korean_music: 'koreanMusic',
    koreanmusictraditional: 'koreanMusic',
    concert: 'concert',
    dancing: 'dancing',
  }
  const mappedByAlias = aliasMap[lower.replace(/\s+/g, '')]
  if (mappedByAlias) return mappedByAlias

  const matchedByName = genreList.find((item) => item.name === normalized)
  if (matchedByName && GENRE_CODES.has(matchedByName.code as GenreTagType)) {
    return matchedByName.code as GenreTagType
  }

  const matchedByLabel = Object.entries(TAG_LABELS).find(
    ([code, label]) =>
      GENRE_CODES.has(code as GenreTagType) && label.replace(/\s+/g, '') === normalized.replace(/\s+/g, ''),
  )
  if (matchedByLabel) {
    return matchedByLabel[0] as GenreTagType
  }

  return 'musical'
}

function formatDate(dateTime: string, delimiter = '.'): string {
  if (!dateTime) return ''

  const dateOnly = /^\d{4}-\d{2}-\d{2}/.test(dateTime) ? dateTime.slice(0, 10) : dateTime
  const parsed = new Date(dateOnly)

  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear()
    const month = String(parsed.getMonth() + 1).padStart(2, '0')
    const day = String(parsed.getDate()).padStart(2, '0')
    return `${year}${delimiter}${month}${delimiter}${day}`
  }

  return dateOnly.replace(/-/g, delimiter)
}

function mapPerformanceId(item: MyPerformanceApiItem): string | number | null {
  const rawId =
    item.performance?.performance_id ??
    item.performance?.id ??
    item.performance_id ??
    item.id ??
    null

  if (rawId === null || rawId === undefined) return null
  if (typeof rawId === 'number' && Number.isFinite(rawId)) return rawId
  if (typeof rawId === 'string' && rawId.trim()) return rawId.trim()
  return null
}

function mapVenueName(item: MyPerformanceApiItem): string {
  const performance = item.performance

  if (typeof performance?.venue === 'string' && performance.venue.trim()) {
    return performance.venue.trim()
  }

  if (performance?.venue && typeof performance.venue === 'object') {
    const venueName = performance.venue.name
    if (typeof venueName === 'string' && venueName.trim()) {
      return venueName.trim()
    }
  }

  if (typeof performance?.venues === 'string' && performance.venues.trim()) {
    return performance.venues.trim()
  }

  if (typeof item.venue === 'string' && item.venue.trim()) {
    return item.venue.trim()
  }

  if (item.venue && typeof item.venue === 'object') {
    const venueName = item.venue.name
    if (typeof venueName === 'string' && venueName.trim()) {
      return venueName.trim()
    }
  }

  if (typeof item.venues === 'string' && item.venues.trim()) {
    return item.venues.trim()
  }

  return ''
}

function mapStatusToPlanned(status?: string): PlannedPerformance['status'] {
  if (!status) return 'scheduled'
  const normalized = status.toLowerCase()
  if (normalized === 'done' || normalized === 'ended' || normalized === 'finished') {
    return 'ended'
  }
  if (normalized === 'performing' || normalized === 'ongoing' || normalized === 'live') {
    return 'ongoing'
  }
  if (
    normalized === 'upcomming' ||
    normalized === 'upcoming' ||
    normalized === 'scheduled' ||
    normalized === 'planned'
  ) {
    return 'scheduled'
  }

  return 'scheduled'
}

function getPerformanceSource(item: MyPerformanceApiItem): MyPerformanceApiItem {
  if (item.performance && typeof item.performance === 'object') {
    return {
      ...item,
      ...item.performance,
    }
  }
  return item
}

function mapCategoryToMyPostCategory(category: string, categoryLabel: string): MyPost['category'] {
  const normalizedCategory = category.toLowerCase()
  if (normalizedCategory === 'performance_review' || normalizedCategory === 'review') return 'review'
  if (
    normalizedCategory === 'performance_recommendation' ||
    normalizedCategory === 'recommend'
  ) {
    return 'recommend'
  }
  if (normalizedCategory === 'information' || normalizedCategory === 'info') return 'info'
  if (normalizedCategory === 'free_discussion' || normalizedCategory === 'free') return 'free'

  const normalizedLabel = categoryLabel.replace(/\s+/g, '')
  if (normalizedLabel.includes('후기')) return 'review'
  if (normalizedLabel.includes('추천')) return 'recommend'
  if (normalizedLabel.includes('정보')) return 'info'
  return 'free'
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== 'object') return fallback
  const detail = (data as { detail?: unknown }).detail
  if (typeof detail === 'string' && detail.trim()) return detail
  return fallback
}

async function fetchMyPageEndpoint<T>(endpoint: string): Promise<T> {
  const token = getAccessToken()
  if (!token) {
    throw new MyPageServiceError('로그인이 필요합니다.', 401)
  }

  const response = await fetch(buildApiUrl(endpoint), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      throw new MyPageServiceError('로그인이 필요합니다.', 401)
    }

    throw new MyPageServiceError(
      extractErrorMessage(data, '마이페이지 정보를 불러오지 못했습니다.'),
      response.status,
    )
  }

  return data as T
}

export async function getMyProfile(): Promise<UserProfile> {
  const data = await fetchMyPageEndpoint<MyProfileApiResponse>('/api/v1/auth/me/')

  return {
    nickname: data.display_name || data.nickname,
    joinedAt: formatDate(data.created_at),
  }
}

export async function getMyInterests(): Promise<{ total: number; items: FavoritePerformance[] }> {
  const data = await fetchMyPageEndpoint<MyInterestsApiResponse>('/api/v1/auth/me/interests/')

  return {
    total: data.total ?? 0,
    items: (data.results ?? []).flatMap((rawItem) => {
      const item = getPerformanceSource(rawItem)
      const mappedId = mapPerformanceId(item)
      if (mappedId === null) return []

      return [{
        id: mappedId,
        title: item.title,
        image: item.poster_url || item.image || '',
        startDate: formatDate(item.start_date ?? ''),
        endDate: formatDate(item.end_date ?? ''),
        category: mapGenreTag(item.genre),
        venue: mapVenueName(item),
      }]
    }),
  }
}

export async function getMyWatchlist(): Promise<{ total: number; items: PlannedPerformance[] }> {
  const data = await fetchMyPageEndpoint<MyWatchlistApiResponse>('/api/v1/auth/me/watchlist/')

  return {
    total: data.total ?? 0,
    items: (data.results ?? []).flatMap((rawItem) => {
      const item = getPerformanceSource(rawItem)
      const mappedId = mapPerformanceId(item)
      if (mappedId === null) return []

      return [{
        id: mappedId,
        title: item.title,
        venue: mapVenueName(item),
        startDate: formatDate(item.start_date ?? ''),
        endDate: formatDate(item.end_date ?? ''),
        status: mapStatusToPlanned(item.status),
      }]
    }),
  }
}

function mapMyPostItem(item: MyPostApiItem): MyPost {
  return {
    id: item.id,
    title: item.title,
    category: mapCategoryToMyPostCategory(item.category, item.category_label),
    categoryLabel: item.category_label,
    contentPreview: stripHtml(item.content),
    viewCount: item.view_count,
    commentCount: item.comment_count,
    createdAt: formatDate(item.created_at),
  }
}

export async function getMyPosts(): Promise<{ total: number; items: MyPost[] }> {
  const data = await fetchMyPageEndpoint<MyPostsApiResponse>('/api/v1/auth/me/posts/')

  return {
    total: data.total ?? 0,
    items: (data.results ?? []).map(mapMyPostItem),
  }
}

export const MY_PAGE_TABS: ReadonlyArray<{ key: MyPageTab; label: string }> = [
  { key: 'favorite', label: '좋아요 한 공연' },
  { key: 'planned', label: '볼 예정 공연' },
  { key: 'posts', label: '내가 작성한 글' },
] as const

