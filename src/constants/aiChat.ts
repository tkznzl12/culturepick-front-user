import type { ChatMessage } from '@/types/aiChat'

export const AI_CHAT_SUGGESTIONS = [
  '로맨틱한 분위기의 뮤지컬 추천해줘',
  '이번 주말에 볼 수 있는 공연 있어?',
  '10만원 이하로 볼 수 있는 콘서트 알려줘',
  '가족과 함께 볼 수 있는 공연은?',
  '클래식 입문자에게 좋은 공연 추천해줘',
  '아이와 함께 볼 수 있는 어린이 공연',
] as const

export const AI_CHAT_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    '안녕하세요! 저는 컬처픽 AI입니다. ✨\n\n어떤 공연을 찾고 계신가요? 원하는 장르, 날짜, 예산, 분위기 등을 자유롭게 말씀해 주시면 맞춤 공연을 추천해드릴게요!',
  showSuggestions: true,
}
