/**
 * API Layer 공통 진입점
 * - Base URL 관리
 * - 향후 fetch 또는 axios 클라이언트의 통합 export 지점
 */

/** API 서버 Base URL (환경변수: VITE_API_BASE_URL) */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

// TODO: 공통 HTTP 클라이언트(fetch 또는 axios) 인스턴스 생성 및 export
// TODO: 요청/응답 인터셉터, 인증 토큰 주입, 공통 에러 핸들링 로직 추가
// TODO: 도메인별 API 모듈(auth, performances 등)을 이곳에서 re-export
