import type { RouteLocationRaw } from 'vue-router'

export function buildSearchRoute(keyword: string, pageNum = 1): RouteLocationRaw {
  const trimmed = keyword.trim()
  return {
    path: '/search',
    query: {
      keyword: trimmed,
      pageNum: String(pageNum),
    },
  }
}
