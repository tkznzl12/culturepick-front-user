import type { GenreTagType } from '@/types/tag'

export type MyPageTab = 'favorite' | 'planned' | 'posts'

export interface UserProfile {
  nickname: string
  joinedAt: string
}

export interface FavoritePerformance {
  id: string | number
  title: string
  image: string
  startDate: string
  endDate: string
  category: GenreTagType | string
  venue: string
}

export interface PlannedPerformance {
  id: string | number
  title: string
  venue: string
  startDate: string
  endDate: string
  status: 'scheduled' | 'ongoing' | 'ended'
}

export type MyPostCategory = 'review' | 'recommend' | 'info' | 'free'

export interface MyPost {
  id: number
  title: string
  category: MyPostCategory
  categoryLabel: string
  contentPreview: string
  viewCount: number
  commentCount: number
  createdAt: string
}

export interface MyProfileApiResponse {
  email: string
  nickname: string
  display_name: string
  phone: string
  provider: string
  created_at: string
  updated_at: string
  can_change_password: boolean
  requires_password_verification: boolean
}

export interface MyPerformanceApiItem {
  performance_id?: number | string
  id?: number | string
  title: string
  genre?: string
  poster_url?: string
  image?: string
  start_date?: string
  end_date?: string
  status?: string
  venue?: {
    name?: string
  } | string
  venues?: string
  performance?: {
    performance_id?: number | string
    id?: number | string
    title?: string
    genre?: string
    start_date?: string
    end_date?: string
    status?: string
    venue?: {
      name?: string
    } | string
    venues?: string
    poster_url?: string
    image?: string
  }
}

export interface MyInterestsApiResponse {
  type: 'interest'
  total: number
  results: MyPerformanceApiItem[]
}

export interface MyWatchlistApiResponse {
  type: 'watchlist'
  total: number
  results: MyPerformanceApiItem[]
}

export interface MyPostApiItem {
  id: number
  category: string
  category_label: string
  title: string
  content: string
  view_count: number
  comment_count: number
  created_at: string
}

export interface MyPostsApiResponse {
  total: number
  results: MyPostApiItem[]
}

