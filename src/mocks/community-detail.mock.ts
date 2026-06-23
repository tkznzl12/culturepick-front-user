export interface CommunityPost {
  id: number
  title: string
  content: string
  category: 'review' | 'recommend' | 'info' | 'free'
  author: string
  createdAt: string
  commentCount: number
  viewCount: number
  userId: number
}

export interface Comment {
  id: number
  content: string
  author: string
  createdAt: string
  userId: number
}

export const currentUserId = 1
export const currentUserName = '뮤덕이에요'

export const communityDetailPostMock: CommunityPost = {
  id: 1,
  title: '레미제라블 5월 공연 후기 - 눈물 없이는 볼 수 없었어요',
  content: `2층 중앙에서 관람했는데 배우들의 감정선이 정말 잘 전달됐습니다.

특히 2막 마지막 장면에서 오케스트라와 합창이 맞물리는 순간이 인상 깊었고, 주변 관객들도 다들 몰입한 분위기였어요.

넘버 구성도 탄탄해서 뮤지컬 입문자에게도 추천할 만한 공연이었습니다.
다음 시즌 캐스팅이 나오면 다시 예매할 생각입니다.`,
  category: 'review',
  author: '뮤덕이에요',
  createdAt: '2026-06-20',
  commentCount: 4,
  viewCount: 327,
  userId: 1,
}

export const communityCommentsMock: Comment[] = [
  {
    id: 1,
    content: '저도 같은 회차 봤는데 2막 진짜 소름이었어요.',
    author: '서울뮤지컬러',
    createdAt: '2026-06-21',
    userId: 2,
  },
  {
    id: 2,
    content: '좌석 어디였는지 궁금해요. 시야 괜찮았나요?',
    author: '극장탐험가',
    createdAt: '2026-06-21',
    userId: 3,
  },
  {
    id: 3,
    content: '좋은 후기 감사합니다. 저도 다음 달에 보러 갑니다!',
    author: '뮤지컬입문',
    createdAt: '2026-06-22',
    userId: 4,
  },
  {
    id: 4,
    content: '중블 9열 기준으로 표정도 잘 보이고 음향도 안정적이었어요.',
    author: '뮤덕이에요',
    createdAt: '2026-06-22',
    userId: 1,
  },
]
