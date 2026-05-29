import type { LocationQuery, LocationQueryRaw, RouteLocationRaw } from 'vue-router'
import type { PerformanceListQuery } from '@/types/performance'
import { PERFORMANCE_SORT_OPTIONS } from '@/constants/search'
import { performanceStatusList } from '@/constants/performanceStatus'
import { SiteRouter } from '@/constants/routes'
import type { StatusTagType } from '@/types/tag'

const SORT_VALUES = new Set(PERFORMANCE_SORT_OPTIONS.map((option) => option.value))
const STATUS_VALUES = new Set(performanceStatusList.map((item) => item.code))

export type PerformanceQueryPatch = Record<string, string | number | undefined | null>

function parsePositiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

export function parsePerformanceListQuery(query: LocationQuery): PerformanceListQuery {
  const sortRaw = String(query.sort ?? '')
  const sort = SORT_VALUES.has(sortRaw as (typeof PERFORMANCE_SORT_OPTIONS)[number]['value'])
    ? (sortRaw as PerformanceListQuery['sort'])
    : undefined

  const keyword = String(query.keyword ?? '').trim()

  const statusRaw = String(query.status ?? '')
  const status = STATUS_VALUES.has(statusRaw as StatusTagType)
    ? statusRaw
    : undefined

  return {
    genre: query.genre ? String(query.genre) : undefined,
    region: query.region ? String(query.region) : undefined,
    status,
    keyword: keyword || undefined,
    page: parsePositiveInt(query.page, 1),
    sort,
  }
}

/**
 * 기존 query를 유지한 채 patch를 병합합니다.
 * undefined / null / '' / 'all' 값은 해당 키를 query에서 제거합니다.
 */
export function mergePerformanceQuery(
  current: LocationQuery,
  patch: PerformanceQueryPatch,
): LocationQueryRaw {
  const next: LocationQueryRaw = { ...current }

  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === null || value === '' || value === 'all') {
      delete next[key]
    } else {
      next[key] = String(value)
    }
  }

  return next
}

export function buildPerformanceListRoute(
  current: LocationQuery,
  patch: PerformanceQueryPatch = {},
): RouteLocationRaw {
  return {
    path: SiteRouter.performanceList,
    query: mergePerformanceQuery(current, patch),
  }
}
