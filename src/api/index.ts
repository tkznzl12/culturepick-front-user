/**
 * API Layer 공통 진입점
 * - Base URL 관리
 * - 향후 fetch 또는 axios 클라이언트의 통합 export 지점
 */

const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim()
const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, '')

/**
 * Netlify(HTTPS) 배포에서 HTTP 절대 URL이 주입되어도 Mixed Content를 막기 위해
 * 프로덕션에서는 상대 경로(base='')를 강제합니다.
 */
const safeApiBaseUrl =
  import.meta.env.PROD && /^http:\/\//i.test(normalizedApiBaseUrl)
    ? ''
    : normalizedApiBaseUrl

/** API 서버 Base URL (환경변수: VITE_API_BASE_URL) */
export const API_BASE_URL = safeApiBaseUrl

/**
 * endpoint와 base를 조합해 최종 요청 URL을 생성합니다.
 * - endpoint가 이미 `/api/`로 시작하면 `/api` 또는 `/api/v1` base를 다시 붙이지 않습니다.
 */
export function buildApiUrl(endpoint: string): string {
  if (!API_BASE_URL) return endpoint

  const endpointStartsWithApi = endpoint.startsWith('/api/')
  const baseAlreadyContainsApiPrefix =
    API_BASE_URL === '/api' || API_BASE_URL === '/api/v1'

  if (endpointStartsWithApi && baseAlreadyContainsApiPrefix) {
    return endpoint
  }

  return `${API_BASE_URL}${endpoint}`
}

// TODO: 공통 HTTP 클라이언트(fetch 또는 axios) 인스턴스 생성 및 export
// TODO: 요청/응답 인터셉터, 인증 토큰 주입, 공통 에러 핸들링 로직 추가
// TODO: 도메인별 API 모듈(auth, performances 등)을 이곳에서 re-export
