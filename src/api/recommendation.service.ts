import { buildApiUrl } from '@/api/index'
import { getAccessToken } from '@/utils/auth-cookie'

const AI_RECOMMENDATION_ENDPOINT = '/api/v1/recommendations/ai/'

export interface AiRecommendationRequest {
  message: string
  limit?: number
}

export interface AiRecommendationPerformanceVenue {
  name?: string
}

export interface AiRecommendationPerformance {
  performance_id: number | string
  title: string
  poster?: string
  poster_url?: string
  genre?: string
  status?: string
  start_date?: string
  end_date?: string
  venue?: AiRecommendationPerformanceVenue | string | null
  min_price?: number | string | null
}

export interface AiRecommendationResult {
  performance: AiRecommendationPerformance
  reason: string
}

export interface AiRecommendationResponse {
  session_id: number
  message: string
  results: AiRecommendationResult[]
}

export class RecommendationServiceError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'RecommendationServiceError'
    this.status = status
  }
}

function extractMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== 'object') return fallback

  const detail = (data as { detail?: unknown }).detail
  if (typeof detail === 'string' && detail.trim()) return detail

  const message = (data as { message?: unknown }).message
  if (typeof message === 'string' && message.trim()) return message

  return fallback
}

export async function getAiRecommendation(
  payload: AiRecommendationRequest,
): Promise<AiRecommendationResponse> {
  const token = getAccessToken()
  if (!token) {
    throw new RecommendationServiceError('로그인 후 이용 가능합니다.', 401)
  }

  const response = await fetch(buildApiUrl(AI_RECOMMENDATION_ENDPOINT), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message: payload.message,
      limit: payload.limit ?? 5,
    }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 400) {
      throw new RecommendationServiceError(
        extractMessage(data, '메시지를 입력해주세요.'),
        response.status,
      )
    }

    if (response.status === 401) {
      throw new RecommendationServiceError('로그인 후 이용 가능합니다.', response.status)
    }

    if (response.status === 503) {
      throw new RecommendationServiceError(
        'AI 추천 서비스가 일시적으로 사용할 수 없습니다.',
        response.status,
      )
    }

    throw new RecommendationServiceError(
      extractMessage(data, 'AI 추천 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
      response.status,
    )
  }

  return data as AiRecommendationResponse
}
