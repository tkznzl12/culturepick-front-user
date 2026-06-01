import { mockData } from '@/mocks/performanceDetail'
import type { PerformanceDetailData } from '@/types/performanceDetail'

/**
 * 공연 상세 API
 * TODO: 백엔드 연동 시 fetcher로 교체
 */
export async function fetchPerformanceDetail(
  _id: string,
): Promise<PerformanceDetailData> {
  return mockData
}
