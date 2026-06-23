/**
 * API Endpoint 상수
 * TODO: 백엔드 API 스펙 확정 후 endpoint 경로 정의
 */

export const ApiEndpoints = {
  performances: '/api/v1/performances/',
  communityPosts: '/api/v1/community/posts/',
  communityImages: '/api/v1/community/images/',
  performanceDetail: (performanceId: string) =>
    `/api/v1/performances/${encodeURIComponent(performanceId)}/`,
  performanceActions: (performanceId: string) =>
    `/api/v1/performances/${encodeURIComponent(performanceId)}/actions/`,
} as const
