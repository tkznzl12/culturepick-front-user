import { nextTick, ref } from 'vue'
import {
  getAiRecommendation,
  type AiRecommendationPerformance,
  type AiRecommendationResult,
  RecommendationServiceError,
} from '@/api/recommendation.service'
import { TAG_LABELS } from '@/constants/cardTag'
import { AI_CHAT_WELCOME_MESSAGE } from '@/constants/aiChat'
import { genreList } from '@/constants/genreList'
import type { AiRecommendation, ChatMessage } from '@/types/aiChat'
import type { GenreTagType } from '@/types/tag'
import { isUnauthorizedRedirectError } from '@/utils/auth-session'

const FALLBACK_POSTER_IMAGE = ''
const FALLBACK_ASSISTANT_ERROR_MESSAGE =
  '추천을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'

function createMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createInitialMessages(): ChatMessage[] {
  return [{ ...AI_CHAT_WELCOME_MESSAGE }]
}

export function useAiChat() {
  const messages = ref<ChatMessage[]>(createInitialMessages())
  const inputText = ref('')
  const isResponding = ref(false)

  function resetChat() {
    isResponding.value = false
    inputText.value = ''
    messages.value = createInitialMessages()
  }

  function mapStatus(status?: string): string {
    if (!status) return 'upcomming'
    const normalized = status.toLowerCase()
    if (
      normalized === 'done' ||
      normalized === 'ended' ||
      normalized === 'finished' ||
      normalized.includes('완료')
    ) {
      return 'done'
    }
    if (
      normalized === 'performing' ||
      normalized === 'ongoing' ||
      normalized === 'live' ||
      normalized.includes('공연중')
    ) {
      return 'performing'
    }
    if (normalized.includes('예정')) return 'upcomming'
    return 'upcomming'
  }

  function mapGenre(genre?: string): GenreTagType {
    if (!genre) return 'musical'

    const normalized = genre.trim()
    const supportedGenreCodes = new Set<GenreTagType>(
      genreList.map((item) => item.code as GenreTagType),
    )
    if (supportedGenreCodes.has(normalized as GenreTagType)) {
      return normalized as GenreTagType
    }

    const normalizedWithoutSpaces = normalized.replace(/\s+/g, '')
    const matchedByName = genreList.find(
      (item) => item.name.replace(/\s+/g, '') === normalizedWithoutSpaces,
    )
    if (matchedByName && supportedGenreCodes.has(matchedByName.code as GenreTagType)) {
      return matchedByName.code as GenreTagType
    }

    const matchedByLabel = Object.entries(TAG_LABELS).find(
      ([code, label]) =>
        supportedGenreCodes.has(code as GenreTagType) &&
        label.replace(/\s+/g, '') === normalizedWithoutSpaces,
    )
    if (matchedByLabel) return matchedByLabel[0] as GenreTagType

    const aliasMap: Record<string, GenreTagType> = {
      musical: 'musical',
      play: 'play',
      classic: 'classic',
      koreanmusic: 'koreanMusic',
      korean_music: 'koreanMusic',
      concert: 'concert',
      pop: 'concert',
      dancing: 'dancing',
      dance: 'dancing',
    }
    const byAlias = aliasMap[normalized.toLowerCase().replace(/\s+/g, '')]
    return byAlias ?? 'musical'
  }

  function formatPrice(minPrice?: number | string | null): string {
    if (typeof minPrice === 'number' && Number.isFinite(minPrice)) {
      return `${minPrice.toLocaleString('ko-KR')}원`
    }

    if (typeof minPrice === 'string' && minPrice.trim()) {
      return /^\d+$/.test(minPrice.trim()) ? `${Number(minPrice).toLocaleString('ko-KR')}원` : minPrice
    }

    return ''
  }

  function mapVenueName(venue?: AiRecommendationPerformance['venue']): string {
    if (typeof venue === 'string') return venue
    if (venue && typeof venue === 'object' && typeof venue.name === 'string') {
      return venue.name
    }
    return ''
  }

  function mapRecommendationCard(performance: AiRecommendationPerformance): AiRecommendation {
    return {
      id: performance.performance_id,
      title: performance.title,
      genre: mapGenre(performance.genre),
      start_date: performance.start_date ?? '',
      end_date: performance.end_date ?? '',
      price_info: formatPrice(performance.min_price),
      status: mapStatus(performance.status),
      venue: mapVenueName(performance.venue),
      img: performance.poster || performance.poster_url || FALLBACK_POSTER_IMAGE,
    }
  }

  function buildAssistantMessage(results: AiRecommendationResult[]): string {
    if (!results.length) {
      return '조건에 맞는 추천 공연을 찾지 못했습니다. 다른 조건으로 다시 요청해 주세요.'
    }

    const lines: string[] = ['추천드릴 공연입니다.', '']

    results.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.performance.title}`)
      lines.push(item.reason || '추천 이유를 준비 중입니다.')
      if (index !== results.length - 1) lines.push('')
    })

    return lines.join('\n')
  }

  function mapErrorMessage(error: unknown): string {
    if (error instanceof RecommendationServiceError) {
      return error.message
    }

    if (error instanceof Error && error.message.trim()) {
      return error.message
    }

    return FALLBACK_ASSISTANT_ERROR_MESSAGE
  }

  async function sendMessage(rawText: string) {
    const text = rawText.trim()
    if (!text || isResponding.value) return

    messages.value = messages.value.map((message) =>
      message.showSuggestions ? { ...message, showSuggestions: false } : message,
    )

    messages.value.push({
      id: createMessageId(),
      role: 'user',
      content: text,
    })

    inputText.value = ''
    isResponding.value = true

    try {
      const response = await getAiRecommendation({
        message: text,
        limit: 5,
      })
      const recommendationItems = (response.results ?? []).map((item) =>
        mapRecommendationCard(item.performance),
      )
      const assistantContent = buildAssistantMessage(response.results ?? [])

      messages.value.push({
        id: createMessageId(),
        role: 'assistant',
        content: assistantContent,
        recommendations: recommendationItems,
      })
    } catch (error) {
      if (isUnauthorizedRedirectError(error)) {
        return
      }

      messages.value.push({
        id: createMessageId(),
        role: 'assistant',
        content: mapErrorMessage(error),
      })
    } finally {
      isResponding.value = false
    }
  }

  async function scrollToBottom(container: HTMLElement | null) {
    if (!container) return
    await nextTick()
    container.scrollTop = container.scrollHeight
  }

  return {
    messages,
    inputText,
    isResponding,
    sendMessage,
    resetChat,
    scrollToBottom,
  }
}
