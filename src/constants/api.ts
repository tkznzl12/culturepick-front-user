/**
 * API Endpoint 상수
 * TODO: 백엔드 API 스펙 확정 후 endpoint 경로 정의
 */

export const ApiEndpoints = {
  performances: '/api/v1/performances/',
  performanceDetail: (performanceId: string) =>
    `/api/v1/performances/${encodeURIComponent(performanceId)}/`,
} as const
