import type { EventCardData } from '@/types/eventCard'
import type { PerformanceApiItem } from '@/types/performance'

export interface SearchPerformancesParams {
  keyword: string
  pageNum?: number
  pageSize?: number
}

export interface SearchResultItem extends EventCardData {
  performance_id: string
  isHot?: boolean
}

export interface SearchPerformancesApiResponse {
  pageNum: number
  pageSize: number
  total: number
  searchData: PerformanceApiItem[]
  page: number
  page_size: number
  results: PerformanceApiItem[]
}

export interface SearchPerformancesResponse {
  items: SearchResultItem[]
  totalCount: number
  pageNum: number
  pageSize: number
}
