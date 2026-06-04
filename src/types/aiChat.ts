import type { EventCardData } from '@/types/eventCard'

export type ChatRole = 'user' | 'assistant'

export interface AiRecommendation extends EventCardData {
  isHot?: boolean
}

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  recommendations?: AiRecommendation[]
  showSuggestions?: boolean
}
