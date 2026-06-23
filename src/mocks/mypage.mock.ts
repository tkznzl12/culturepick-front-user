import type { GenreTagType } from '@/types/tag'

export type MyPageTab = 'favorite' | 'planned' | 'posts'

export interface UserProfile {
  nickname: string
  joinedAt: string
}

export interface FavoritePerformance {
  id: number
  title: string
  image: string
  startDate: string
  endDate: string
  category: GenreTagType
}

export interface PlannedPerformance {
  id: number
  title: string
  startDate: string
  endDate: string
  status: 'ongoing' | 'ended'
}

export type MyPostCategory = 'review' | 'recommend' | 'info' | 'free'

export interface MyPost {
  id: number
  title: string
  category: MyPostCategory
  viewCount: number
  commentCount: number
  createdAt: string
}

export const myPageUserProfile: UserProfile = {
  nickname: '정수진',
  joinedAt: '2026.05.12',
}

export const favoritePerformancesMock: FavoritePerformance[] = [
  {
    id: 101,
    title: '레미제라블',
    image:
      'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026.06.01',
    endDate: '2026.08.31',
    category: 'musical',
  },
  {
    id: 102,
    title: '뮤지엄 오브 컬러스: VIBE',
    image:
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026.05.20',
    endDate: '2026.09.15',
    category: 'classic',
  },
  {
    id: 103,
    title: '국립발레단 - 백조의 호수',
    image:
      'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026.06.10',
    endDate: '2026.07.25',
    category: 'dancing',
  },
]

export const plannedPerformancesMock: PlannedPerformance[] = [
  {
    id: 104,
    title: '세종문화회관 체임버 콘서트',
    startDate: '2026.06.25',
    endDate: '2026.06.25',
    status: 'ongoing',
  },
  {
    id: 105,
    title: '한여름 재즈 페스티벌',
    startDate: '2026.07.02',
    endDate: '2026.07.05',
    status: 'ongoing',
  },
  {
    id: 106,
    title: '연극 햄릿',
    startDate: '2026.03.11',
    endDate: '2026.05.18',
    status: 'ended',
  },
  {
    id: 107,
    title: '라 보엠 오페라 갈라',
    startDate: '2026.04.03',
    endDate: '2026.04.19',
    status: 'ended',
  },
]

export const myPostsMock: MyPost[] = [
  {
    id: 1,
    title: '레미제라블 5월 공연 후기 - 눈물 없이는 볼 수 없었어요',
    category: 'review',
    viewCount: 982,
    commentCount: 34,
    createdAt: '2026.06.20',
  },
  {
    id: 2,
    title: '예술의전당 주차 꿀팁 총정리',
    category: 'info',
    viewCount: 2280,
    commentCount: 25,
    createdAt: '2026.06.11',
  },
  {
    id: 3,
    title: '여름시즌 볼만한 전시 추천 리스트',
    category: 'recommend',
    viewCount: 3102,
    commentCount: 47,
    createdAt: '2026.05.30',
  },
]
