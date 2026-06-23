export type CommunityCategory = 'review' | 'recommend' | 'info' | 'free'

export interface CommunityPost {
  id: number
  title: string
  content: string
  category: CommunityCategory
  author: string
  createdAt: string
  commentCount: number
  viewCount: number
  userId: number
}

export const communityPosts: CommunityPost[] = [
  {
    id: 1,
    title: '레미제라블 부산 공연 후기 - 배우 합이 정말 좋았어요',
    content:
      '2층 중앙에서 관람했는데도 감정선이 잘 전달됐습니다. 특히 2막 넘버에서 합창 밸런스가 좋아서 몰입도가 높았고, 커튼콜까지 꽉 찬 느낌이었어요.',
    category: 'review',
    author: '뮤지컬러버',
    createdAt: '2026-06-18',
    commentCount: 14,
    viewCount: 239,
    userId: 1,
  },
  {
    id: 2,
    title: '뮤지컬 입문자에게 추천할 작품 있을까요?',
    content:
      '친구랑 처음 보러 가려는데 너무 무겁지 않고 넘버가 익숙한 작품이면 좋겠습니다. 러닝타임이 너무 길지 않은 공연으로 추천 부탁드려요.',
    category: 'recommend',
    author: '공연처음',
    createdAt: '2026-06-17',
    commentCount: 22,
    viewCount: 311,
    userId: 3,
  },
  {
    id: 3,
    title: '예술의전당 주차 꿀팁 공유합니다',
    content:
      '주말 저녁 공연은 시작 1시간 전만 돼도 만차가 잦아서 근처 공영주차장 연계가 훨씬 편합니다. 출차 대기 줄이 길 때는 우회 동선도 참고하세요.',
    category: 'info',
    author: '주차장정복',
    createdAt: '2026-06-15',
    commentCount: 8,
    viewCount: 198,
    userId: 4,
  },
  {
    id: 4,
    title: '공연 관람 에티켓 어디까지가 맞다고 보시나요?',
    content:
      '오프닝 직후 입장, 커튼콜 촬영, 인터미션 중 통화 같은 부분에서 관객마다 기준이 달라서요. 여러분이 생각하는 최소 에티켓 기준이 궁금합니다.',
    category: 'free',
    author: '매너토론',
    createdAt: '2026-06-14',
    commentCount: 31,
    viewCount: 427,
    userId: 5,
  },
  {
    id: 5,
    title: '오페라 <라 보엠> 관람 후기',
    content:
      '성악 파트가 또렷하게 들려서 좋았고 오케스트라 밸런스도 안정적이었습니다. 오페라 처음 보시는 분도 자막과 연출 덕분에 어렵지 않게 볼 수 있어요.',
    category: 'review',
    author: '아리아덕후',
    createdAt: '2026-06-12',
    commentCount: 11,
    viewCount: 176,
    userId: 6,
  },
  {
    id: 6,
    title: '클래식 공연 추천 부탁드립니다 (6월 말 기준)',
    content:
      '바이올린 협주곡 위주로 찾고 있고, 초보자도 부담 없이 들을 수 있는 프로그램이면 좋겠습니다. 서울권 위주로 추천해주시면 감사해요.',
    category: 'recommend',
    author: '클래식입문',
    createdAt: '2026-06-11',
    commentCount: 19,
    viewCount: 254,
    userId: 7,
  },
  {
    id: 7,
    title: '공연장 좌석 추천 - 시야 좋은 구역 정리',
    content:
      '블루스퀘어와 샤롯데 기준으로 1층 앞열보다 1층 중블 7~10열이 전체 동선을 보기 좋았습니다. 극장마다 단차가 달라서 좌석 후기 비교가 중요해요.',
    category: 'info',
    author: '좌석연구소',
    createdAt: '2026-06-10',
    commentCount: 27,
    viewCount: 502,
    userId: 8,
  },
  {
    id: 8,
    title: '공연 예매 팁 - 티켓 오픈 때 성공 확률 올리는 법',
    content:
      '결제수단 미리 등록, 브라우저 다중 대기, 회선 안정화 체크만 해도 체감이 큽니다. 새로고침 타이밍보다 사전 준비가 훨씬 중요하더라고요.',
    category: 'free',
    author: '티켓팅장인',
    createdAt: '2026-06-09',
    commentCount: 35,
    viewCount: 688,
    userId: 9,
  },
  {
    id: 9,
    title: '연극 <햄릿> 대학로 공연 후기',
    content:
      '무대 전환이 간결해서 집중이 잘 됐고, 배우 딕션이 좋아서 대사 전달력이 뛰어났습니다. 고전극이지만 템포가 좋아 지루하지 않았어요.',
    category: 'review',
    author: '연극산책',
    createdAt: '2026-06-08',
    commentCount: 13,
    viewCount: 221,
    userId: 1,
  },
  {
    id: 10,
    title: '여름 시즌 가족과 보기 좋은 공연 추천해주세요',
    content:
      '초등학생 아이와 함께 볼 예정이라 자극적이지 않고 스토리가 쉬운 작품이면 좋겠습니다. 주말 낮 시간대 회차 위주로 찾고 있어요.',
    category: 'recommend',
    author: '주말관람러',
    createdAt: '2026-06-07',
    commentCount: 16,
    viewCount: 267,
    userId: 10,
  },
]
