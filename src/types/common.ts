/**
 * API 공통 타입 정의
 * - 페이지네이션, 에러 응답 등 도메인 무관한 공통 스키마
 */

export type ApiError = {
  message: string
  statusCode?: number
}

export type PaginationParams = {
  page?: number
  size?: number
}

export type PaginatedResponse<T> = {
  items: T[]
  totalCount: number
  page: number
  size: number
}
