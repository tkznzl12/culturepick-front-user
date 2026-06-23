import { buildApiUrl } from '@/api/index'
import { ApiEndpoints } from '@/constants/api'
import type {
  CommunityImageUploadResponse,
  CreateCommunityPostRequest,
  CreateCommunityPostResponse,
} from '@/types/community'
import { getAccessToken } from '@/utils/auth-cookie'

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
      throw new CommunityServiceError('로그인 후 이용 가능합니다.', 401)
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
      throw new CommunityServiceError('로그인 후 이용 가능합니다.', 401)
    }

    throw new CommunityServiceError(
      extractMessage(data, '이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
      response.status,
    )
  }

  return data as CommunityImageUploadResponse
}
