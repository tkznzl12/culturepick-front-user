import type { AiRecommendation, ChatMessage } from '@/types/aiChat'

const poster =
  'http://www.kopis.or.kr/upload/pfmPoster/PF_PF289708_260420_120342.jpg'

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

export const MOCK_AI_RESPONSE_TEXT =
  "로맨틱한 데이트에 딱 맞는 공연들을 추천해드릴게요! 💖 '오페라의 유령'은 파리를 배경으로 한 웅장한 사랑 이야기로, 라운지에서의 데이트 코스와도 잘 어울려요. '레미제라블'도 감동적인 드라마와 아름다운 음악으로 연인과 함께하기 좋은 작품이에요."

export const MOCK_AI_RECOMMENDATIONS: AiRecommendation[] = [
  {
    id: 101,
    title: '레미제라블',
    genre: 'musical',
    status: 'performing',
    venue: '블루스퀘어 신한카드홀',
    start_date: '2026-05-01',
    end_date: '2026-08-31',
    price_info: '60,000',
    img: poster,
    isHot: true,
  },
  {
    id: 102,
    title: '오페라의 유령',
    genre: 'musical',
    status: 'performing',
    venue: '블루스퀘어 신한카드홀',
    start_date: '2026-05-01',
    end_date: '2026-08-31',
    price_info: '60,000',
    img: poster,
    isHot: true,
  },
  {
    id: 103,
    title: '빌리 엘리어트',
    genre: 'play',
    status: 'upcomming',
    venue: '블루스퀘어 신한카드홀',
    start_date: '2026-05-01',
    end_date: '2026-08-31',
    price_info: '60,000',
    img: poster,
    isHot: false,
  },
]
