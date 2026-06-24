import { buildApiUrl } from '@/api/index'
import { ApiEndpoints } from '@/constants/api'
import type {
  CommunityCommentApiItem,
  CommunityCommentItem,
  CommunityCommentsApiResponse,
  CommunityImageUploadResponse,
  CreateCommunityPostRequest,
  CreateCommunityPostResponse,
  UpdateCommunityPostRequest,
} from '@/types/community'
import { getAccessToken } from '@/utils/auth-cookie'
import { getCurrentPathWithQueryAndHash } from '@/utils/auth-redirect'
import { handleUnauthorizedAccess } from '@/utils/auth-session'

type CommunityFieldErrorKey = 'title' | 'content'

export class CommunityServiceError extends Error {
  status: number
  fieldErrors?: Partial<Record<CommunityFieldErrorKey, string>>

  constructor(
    message: string,
    status: number,
    fieldErrors?: Partial<Record<CommunityFieldErrorKey, string>>,
  ) {
    super(message)
    this.name = 'CommunityServiceError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

function extractMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== 'object') return fallback

  const detail = (data as { detail?: unknown }).detail
  if (typeof detail === 'string' && detail.trim()) return detail

  const nonFieldErrors = (data as { non_field_errors?: unknown }).non_field_errors
  if (Array.isArray(nonFieldErrors) && typeof nonFieldErrors[0] === 'string') {
    return nonFieldErrors[0]
  }

  return fallback
}

function extractFieldError(data: unknown, key: CommunityFieldErrorKey): string | undefined {
  if (!data || typeof data !== 'object') return undefined
  const rawValue = (data as Record<string, unknown>)[key]

  if (Array.isArray(rawValue) && typeof rawValue[0] === 'string') {
    return rawValue[0]
  }

  if (typeof rawValue === 'string') return rawValue
  return undefined
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

function mapComment(item: CommunityCommentApiItem): CommunityCommentItem {
  return {
    id: item.id,
    postId: item.post,
    authorId: item.author,
    authorDisplayName: item.author_display_name || item.author_nickname || item.author_email,
    content: item.content,
    createdAt: formatDate(item.created_at),
  }
}

export async function createPost(
  payload: CreateCommunityPostRequest,
): Promise<CreateCommunityPostResponse> {
  const token = getAccessToken()
  const response = await fetch(buildApiUrl(ApiEndpoints.communityPosts), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorizedAccess(getCurrentPathWithQueryAndHash())
    }

    if (response.status === 400) {
      const fieldErrors = {
        title: extractFieldError(data, 'title'),
        content: extractFieldError(data, 'content'),
      }
      throw new CommunityServiceError(
        extractMessage(data, '게시글 등록에 실패했습니다. 입력값을 확인해 주세요.'),
        400,
        fieldErrors,
      )
    }

    throw new CommunityServiceError(
      extractMessage(data, '게시글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
      response.status,
    )
  }

  return data as CreateCommunityPostResponse
}

export async function uploadCommunityImage(file: File): Promise<CommunityImageUploadResponse> {
  const token = getAccessToken()
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(buildApiUrl(ApiEndpoints.communityImages), {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorizedAccess(getCurrentPathWithQueryAndHash())
    }

    throw new CommunityServiceError(
      extractMessage(data, '이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
      response.status,
    )
  }

  return data as CommunityImageUploadResponse
}

export async function updatePost(
  postId: number,
  payload: UpdateCommunityPostRequest,
): Promise<CreateCommunityPostResponse> {
  const token = getAccessToken()
  const response = await fetch(buildApiUrl(`${ApiEndpoints.communityPosts}${postId}/`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorizedAccess(getCurrentPathWithQueryAndHash())
    }

    if (response.status === 400) {
      const fieldErrors = {
        title: extractFieldError(data, 'title'),
        content: extractFieldError(data, 'content'),
      }
      throw new CommunityServiceError(
        extractMessage(data, '게시글 수정에 실패했습니다. 입력값을 확인해 주세요.'),
        400,
        fieldErrors,
      )
    }

    if (response.status === 403) {
      throw new CommunityServiceError('수정 권한이 없습니다.', 403)
    }

    if (response.status === 404) {
      throw new CommunityServiceError('게시글을 찾을 수 없습니다.', 404)
    }

    throw new CommunityServiceError(
      extractMessage(data, '게시글 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
      response.status,
    )
  }

  return data as CreateCommunityPostResponse
}

export async function getComments(postId: number): Promise<CommunityCommentItem[]> {
  const response = await fetch(buildApiUrl(`${ApiEndpoints.communityPosts}${postId}/comments/`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 404) {
      throw new CommunityServiceError('댓글을 불러올 수 없습니다.', 404)
    }

    throw new CommunityServiceError(
      extractMessage(data, '댓글을 불러올 수 없습니다.'),
      response.status,
    )
  }

  const responseData = data as CommunityCommentsApiResponse
  return (responseData.results ?? []).map(mapComment)
}

export async function createComment(
  postId: number,
  payload: { content: string },
): Promise<CommunityCommentItem> {
  const token = getAccessToken()
  const response = await fetch(buildApiUrl(`${ApiEndpoints.communityPosts}${postId}/comments/`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorizedAccess(getCurrentPathWithQueryAndHash())
    }

    if (response.status === 400) {
      throw new CommunityServiceError(
        extractMessage(data, 'Content is required.'),
        400,
        { content: extractFieldError(data, 'content') },
      )
    }

    throw new CommunityServiceError(
      extractMessage(data, '댓글 작성에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
      response.status,
    )
  }

  return mapComment(data as CommunityCommentApiItem)
}

export async function deleteComment(commentId: number): Promise<void> {
  const token = getAccessToken()
  const response = await fetch(buildApiUrl(`/api/v1/community/comments/${commentId}/`), {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (response.ok) {
    return
  }

  const data = await response.json().catch(() => null)

  if (response.status === 401) {
    handleUnauthorizedAccess(getCurrentPathWithQueryAndHash())
  }

  if (response.status === 403) {
    throw new CommunityServiceError('삭제 권한이 없습니다.', 403)
  }

  if (response.status === 404) {
    throw new CommunityServiceError('이미 삭제된 댓글입니다.', 404)
  }

  throw new CommunityServiceError(
    extractMessage(data, '댓글 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
    response.status,
  )
}

export async function deletePost(postId: number): Promise<void> {
  const token = getAccessToken()
  const response = await fetch(buildApiUrl(`${ApiEndpoints.communityPosts}${postId}/`), {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (response.ok) {
    return
  }

  const data = await response.json().catch(() => null)

  if (response.status === 401) {
    handleUnauthorizedAccess(getCurrentPathWithQueryAndHash())
  }

  if (response.status === 403) {
    throw new CommunityServiceError('삭제 권한이 없습니다.', 403)
  }

  if (response.status === 404) {
    throw new CommunityServiceError('이미 삭제되었거나 존재하지 않는 게시글입니다.', 404)
  }

  throw new CommunityServiceError(
    extractMessage(data, '게시글 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
    response.status,
  )
}
