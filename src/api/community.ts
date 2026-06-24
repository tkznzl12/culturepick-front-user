import { buildApiUrl } from '@/api/index'
import { fetcher } from '@/api/client'
import { ApiEndpoints } from '@/constants/api'
import type {
  CommunityPostApiItem,
  CommunityPostDetailItem,
  CommunityPostDetailResponse,
  CommunityPostListItem,
  CommunityPostsApiResponse,
  CommunityPostsParams,
  CommunityPostsResponse,
} from '@/types/community'
import { getAccessToken } from '@/utils/auth-cookie'
import { getCurrentPathWithQueryAndHash } from '@/utils/auth-redirect'
import { handleUnauthorizedAccess } from '@/utils/auth-session'
import { stripHtml } from '@/utils/stripHtml'

export class CommunityApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'CommunityApiError'
    this.status = status
  }
}

function buildQueryString(params: Record<string, string | number | undefined | null>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    searchParams.append(key, String(value))
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

function formatDate(dateTime: string): string {
  if (/^\d{4}-\d{2}-\d{2}/.test(dateTime)) {
    return dateTime.slice(0, 10)
  }

  const parsed = new Date(dateTime)
  if (Number.isNaN(parsed.getTime())) {
    return dateTime
  }

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function mapCommunityPost(item: CommunityPostApiItem): CommunityPostListItem {
  return {
    id: item.id,
    category: item.category,
    categoryLabel: item.category_label,
    title: item.title,
    contentPreview: stripHtml(item.content),
    authorDisplayName: item.author_display_name || item.author_nickname || item.author_email,
    commentCount: item.comment_count,
    createdAt: formatDate(item.created_at),
  }
}

function mapCommunityPostDetail(item: CommunityPostDetailResponse): CommunityPostDetailItem {
  return {
    id: item.id,
    authorId: item.author,
    category: item.category,
    categoryLabel: item.category_label,
    title: item.title,
    content: item.content,
    contentFormat: item.content_format,
    authorDisplayName: item.author_display_name || item.author_nickname || item.author_email,
    commentCount: item.comment_count,
    viewCount: item.view_count,
    createdAt: formatDate(item.created_at),
  }
}

function normalizeCommunityPostsResponse(
  response: CommunityPostsApiResponse | CommunityPostApiItem[],
  fallbackPage: number,
  fallbackPageSize: number,
): CommunityPostsResponse {
  const items = Array.isArray(response) ? response : response.results ?? []
  const page = Array.isArray(response)
    ? fallbackPage
    : response.page ?? response.pageNum ?? response.page_num ?? fallbackPage
  const pageSize = Array.isArray(response)
    ? fallbackPageSize
    : response.page_size ?? response.pageSize ?? fallbackPageSize

  let totalCount = Array.isArray(response)
    ? response.length
    : response.count ?? response.total ?? response.total_count ?? response.totalCount ?? items.length

  if (!Array.isArray(response) && totalCount <= items.length) {
    const hasNext = Boolean(response.next)
    const hasPrevious = Boolean(response.previous)
    if ((hasNext || hasPrevious) && pageSize > 0) {
      const minimumCountByCursor = (Math.max(page, 1) - 1) * pageSize + items.length + (hasNext ? 1 : 0)
      totalCount = Math.max(totalCount, minimumCountByCursor)
    }
  }

  return {
    items: items.map(mapCommunityPost),
    totalCount,
    page,
    pageSize,
  }
}

export async function getCommunityPosts(
  params: CommunityPostsParams,
  options?: { signal?: AbortSignal },
): Promise<CommunityPostsResponse> {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5

  const query = buildQueryString({
    category: params.category,
    keyword: params.keyword?.trim() || undefined,
    page,
    page_size: pageSize,
  })

  const response = await fetcher<CommunityPostsApiResponse | CommunityPostApiItem[]>(
    `${ApiEndpoints.communityPosts}${query}`,
    { signal: options?.signal },
  )

  return normalizeCommunityPostsResponse(response, page, pageSize)
}

export async function getCommunityPostDetail(id: number): Promise<CommunityPostDetailItem> {
  const token = getAccessToken()
  const response = await fetch(buildApiUrl(`${ApiEndpoints.communityPosts}${id}/`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorizedAccess(getCurrentPathWithQueryAndHash())
    }

    const message =
      (data && typeof data === 'object' && 'detail' in data && String(data.detail)) ||
      '게시글 상세를 불러오지 못했습니다.'
    throw new CommunityApiError(message, response.status)
  }

  return mapCommunityPostDetail(data as CommunityPostDetailResponse)
}
