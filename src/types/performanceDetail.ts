import type { EventGenre, EventStatus } from '@/types/eventCard'

export interface BookingLink {
  url: string
  sitename?: string
  site_name?: string
}

export interface PerformanceDetailVenue {
  venue_id?: string
  name?: string
  sido?: string
  gugun?: string
  address?: string
  latitude?: string
  longitude?: string
}

export interface PerformanceDetailImage {
  image_url?: string
  url?: string
  [key: string]: unknown
}

export interface PerformanceDetailApiResponse {
  performance_id: string
  title: string
  genre: string
  start_date: string
  end_date: string
  status: string
  cast: string
  crew: string
  runtime: string
  age_rating: string
  synopsis: string
  price_info: string
  schedule_info: string
  poster_url: string
  view_count: number
  zzim_count: number
  venue: PerformanceDetailVenue
  image_url?: string[]
  images?: PerformanceDetailImage[]
  booking_links: BookingLink[]
  is_interested: boolean
  is_watchlisted: boolean
}

export interface PerformanceDetailData {
  performance_id?: string
  title: string
  genre: EventGenre
  start_date: string
  end_date: string

  status: EventStatus

  cast: string
  crew: string
  runtime: string
  age_rating: string
  synopsis: string
  schedule_info?: string

  /** 서버/기획에서 `pirce_info`로 내려오는 케이스도 방어 */
  price_info?: string
  pirce_info?: string

  poster_url: string
  bookingLink: BookingLink[]
  booking_links?: BookingLink[]

  local: string
  venues: string
  image_url: string[]
  venue?: PerformanceDetailVenue
  view_count?: number
  zzim_count?: number
  is_interested?: boolean
  is_watchlisted?: boolean
}

export type PerformanceActionType = 'interest' | 'watchlist'

export interface PerformanceActionRequest {
  action_type: PerformanceActionType
  is_active: boolean
}

export interface PerformanceActionResponse {
  performance_id: string
  action_type: PerformanceActionType
  is_active: boolean
  is_interested: boolean
  is_watchlisted: boolean
  zzim_count?: number
}

