import type { OAuthProvider } from '@/types/auth'

const GOOGLE_OAUTH_BASE_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const NAVER_OAUTH_BASE_URL = 'https://nid.naver.com/oauth2.0/authorize'
const KAKAO_OAUTH_BASE_URL = 'https://kauth.kakao.com/oauth/authorize'
const NAVER_OAUTH_STATE_KEY = 'naver_oauth_state'

const getRedirectUri = (provider: OAuthProvider) =>
  `${window.location.origin}/auth/callback/${provider}`

const buildOAuthUrl = (baseUrl: string, params: Record<string, string>) => {
  const searchParams = new URLSearchParams(params)
  return `${baseUrl}?${searchParams.toString()}`
}

const getRequiredEnv = (value: string | undefined, key: string) => {
  if (!value) {
    throw new Error(`${key} 환경 변수가 설정되지 않았습니다.`)
  }

  return value
}

export const buildGoogleOAuthUrl = () => {
  const clientId = getRequiredEnv(import.meta.env.VITE_GOOGLE_CLIENT_ID, 'VITE_GOOGLE_CLIENT_ID')

  return buildOAuthUrl(GOOGLE_OAUTH_BASE_URL, {
    client_id: clientId,
    redirect_uri: getRedirectUri('google'),
    response_type: 'code',
    scope: 'openid email profile',
  })
}

export const buildKakaoOAuthUrl = () => {
  const clientId = getRequiredEnv(import.meta.env.VITE_KAKAO_CLIENT_ID, 'VITE_KAKAO_CLIENT_ID')

  return buildOAuthUrl(KAKAO_OAUTH_BASE_URL, {
    client_id: clientId,
    redirect_uri: getRedirectUri('kakao'),
    response_type: 'code',
  })
}

export const buildNaverOAuthUrl = () => {
  const clientId = getRequiredEnv(import.meta.env.VITE_NAVER_CLIENT_ID, 'VITE_NAVER_CLIENT_ID')
  const state = crypto.randomUUID()
  sessionStorage.setItem(NAVER_OAUTH_STATE_KEY, state)

  return buildOAuthUrl(NAVER_OAUTH_BASE_URL, {
    client_id: clientId,
    redirect_uri: getRedirectUri('naver'),
    response_type: 'code',
    state,
  })
}

export const getNaverOAuthState = () => sessionStorage.getItem(NAVER_OAUTH_STATE_KEY)

export const clearNaverOAuthState = () => {
  sessionStorage.removeItem(NAVER_OAUTH_STATE_KEY)
}
