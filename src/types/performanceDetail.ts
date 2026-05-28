import type { EventGenre, EventStatus } from '@/types/eventCard'

export interface BookingLink {
  url: string
  sitename: string
}

export interface PerformanceDetailData {
  title: string
  genre: EventGenre
  start_date: string
  end_date: string

  status: EventStatus

  cast: string
  crew: string
  runtime: string
  age_rating: string

  /** 서버/기획에서 `pirce_info`로 내려오는 케이스도 방어 */
  price_info?: string
  pirce_info?: string

  poster_url: string
  bookingLink: BookingLink[]

  local: string
  venues: string
  story: string
}

