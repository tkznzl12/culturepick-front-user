const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

const getCookieOptions = (maxAge: number) => {
  const secure = import.meta.env.PROD ? '; Secure' : ''
  return `path=/; max-age=${maxAge}; SameSite=Lax${secure}`
}

export const setAuthCookies = (accessToken: string, refreshToken: string) => {
  document.cookie = `${ACCESS_TOKEN_KEY}=${encodeURIComponent(accessToken)}; ${getCookieOptions(60 * 60)}`
  document.cookie = `${REFRESH_TOKEN_KEY}=${encodeURIComponent(refreshToken)}; ${getCookieOptions(60 * 60 * 24 * 7)}`
}

export const clearAuthCookies = () => {
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; max-age=0`
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; max-age=0`
}

export const getAccessToken = () => {
  const match = document.cookie.match(new RegExp(`(^| )${ACCESS_TOKEN_KEY}=([^;]+)`))
  return match?.[2] ? decodeURIComponent(match[2]) : null
}
