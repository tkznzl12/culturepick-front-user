const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
export const AUTH_CHANGED_EVENT = 'auth-changed'

const getCookieOptions = (maxAge: number) => {
  const secure = import.meta.env.PROD ? '; Secure' : ''
  return `path=/; max-age=${maxAge}; SameSite=Lax${secure}`
}

export const setAuthCookies = (accessToken: string, refreshToken: string) => {
  document.cookie = `${ACCESS_TOKEN_KEY}=${encodeURIComponent(accessToken)}; ${getCookieOptions(60 * 60)}`
  document.cookie = `${REFRESH_TOKEN_KEY}=${encodeURIComponent(refreshToken)}; ${getCookieOptions(60 * 60 * 24 * 7)}`
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export const clearAuthCookies = () => {
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; max-age=0`
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; max-age=0`
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export const getAccessToken = () => {
  const match = document.cookie.match(new RegExp(`(^| )${ACCESS_TOKEN_KEY}=([^;]+)`))
  return match?.[2] ? decodeURIComponent(match[2]) : null
}

export const getRefreshToken = () => {
  const match = document.cookie.match(new RegExp(`(^| )${REFRESH_TOKEN_KEY}=([^;]+)`))
  return match?.[2] ? decodeURIComponent(match[2]) : null
}

function parseJwtPayload(token: string): Record<string, unknown> | null {
  const tokenParts = token.split('.')
  if (tokenParts.length < 2) return null
  const payloadPart = tokenParts[1]
  if (!payloadPart) return null

  try {
    const payload = payloadPart
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(payloadPart.length / 4) * 4, '=')
    return JSON.parse(atob(payload)) as Record<string, unknown>
  } catch (error) {
    console.error('[auth-cookie] failed to parse jwt payload:', error)
    return null
  }
}

export const getCurrentUserId = (): number | null => {
  const accessToken = getAccessToken()
  if (!accessToken) return null

  const payload = parseJwtPayload(accessToken)
  if (!payload) return null

  const userId =
    payload.user_id ??
    payload.userId ??
    payload.id ??
    (typeof payload.sub === 'string' ? Number(payload.sub) : payload.sub)

  if (typeof userId === 'number' && Number.isFinite(userId)) {
    return userId
  }

  return null
}
