import type { EventCardData } from '@/types/eventCard'

export interface SearchPerformancesParams {
  keyword: string
  pageNum?: number
  pageSize?: number
}

export interface SearchResultItem extends EventCardData {
  isHot?: boolean
}

export interface SearchPerformancesResponse {
  items: SearchResultItem[]
  totalCount: number
  pageNum: number
  pageSize: number
}
