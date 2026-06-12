import type { EventCardData } from '@/types/eventCard'
import type { PerformanceSortValue } from '@/constants/search'

export type PerformanceViewMode = 'grid' | 'list'

export interface PerformanceListItem extends EventCardData {
  region: string
  runtime?: string
  age_rating?: string
  view_count?: number
  zzim_count?: number
  rating?: number
  reviewCount?: number
  isHot?: boolean
  is_interested?: boolean
}

export interface PerformanceVenueApi {
  venue_id: string
  name: string
  sido: string
  gugun: string
  address: string
}

export interface PerformanceApiItem {
  performance_id: string
  title: string
  genre: string
  start_date: string
  end_date: string
  status: string
  poster_url: string
  runtime: string
  age_rating: string
  venue: PerformanceVenueApi
  view_count: number
  zzim_count: number
  is_interested?: boolean
  search_score?: number
}

export interface PerformancesApiResponse {
  pageNum: number
  pageSize: number
  total: number
  searchData: PerformanceApiItem[]
  page: number
  page_size: number
  results: PerformanceApiItem[]
}

export interface PerformancesParams {
  genre?: string
  region?: string
  status?: string
  keyword?: string
  page?: number
  pageSize?: number
  sort?: PerformanceSortValue | string
}

export interface PerformancesResponse {
  items: PerformanceListItem[]
  totalCount: number
  page: number
  pageSize: number
}

export interface PerformanceListQuery {
  genre?: string
  region?: string
  status?: string
  keyword?: string
  page: number
  sort?: PerformanceSortValue
}
