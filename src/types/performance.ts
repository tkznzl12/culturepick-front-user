import type { EventCardData } from '@/types/eventCard'
import type { PerformanceSortValue } from '@/constants/search'

export type PerformanceViewMode = 'grid' | 'list'

export interface PerformanceListItem extends EventCardData {
  region: string
  rating?: number
  reviewCount?: number
  isHot?: boolean
}

export interface PerformancesParams {
  genre?: string
  region?: string
  status?: string
  keyword?: string
  page?: number
  size?: number
  sort?: PerformanceSortValue | string
}

export interface PerformancesResponse {
  items: PerformanceListItem[]
  totalCount: number
  page: number
  size: number
}

export interface PerformanceListQuery {
  genre?: string
  region?: string
  status?: string
  keyword?: string
  page: number
  sort?: PerformanceSortValue
}
