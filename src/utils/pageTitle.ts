import { findGenreByCode } from '@/constants/genreList'
import { getTagLabel } from '@/constants/cardTag'

export const PAGE_TITLES = {
  home: '컬처픽',
  search: '컬처픽 검색',
  performanceListAll: '컬처픽 | 전체 공연',
  notFound: '페이지를 찾을 수 없음 | 컬처픽',
  aiChat: 'AI 공연 추천 | 컬처픽',
  default: '컬처픽',
} as const

export function getPerformanceListPageTitle(genreCode?: string): string {
  if (!genreCode) {
    return PAGE_TITLES.performanceListAll
  }

  const matched = findGenreByCode(genreCode)
  if (matched) {
    return `컬처픽 | ${matched.name}`
  }

  const fallbackLabel =
    getTagLabel(genreCode as Parameters<typeof getTagLabel>[0]) || genreCode
  return `컬처픽 | ${fallbackLabel}`
}

export function getPerformanceDetailPageTitle(performanceTitle: string): string {
  return `${performanceTitle} | 컬처픽`
}

export function setPageTitle(title: string): void {
  document.title = title
}
