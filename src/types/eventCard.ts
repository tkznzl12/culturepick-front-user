import type { GenreTagType, StatusTagType } from '@/types/tag'

export type EventGenre = GenreTagType | string
export type EventStatus = StatusTagType | string

export interface EventCardData {
  id: number
  title: string
  genre: EventGenre
  start_date: string
  end_date: string
  price_info: string
  status: EventStatus
  venue: string
  img: string
}

/** @deprecated MockDataType 대신 EventCardData 사용 */
export type MockDataType = EventCardData
