import { SiteRouter } from '@/constants/routes'

const REDIRECT_QUERY_KEY = 'redirect'
const OAUTH_LOGIN_REDIRECT_KEY = 'oauth-login-redirect'

function isGuestRoute(path: string): boolean {
  return path.startsWith(SiteRouter.login) || path.startsWith(SiteRouter.signUp)
}

export function normalizeRedirectPath(path: unknown): string | null {
  if (typeof path !== 'string') return null
  if (!path.startsWith('/') || path.startsWith('//')) return null
  if (isGuestRoute(path)) return null
  return path
}

export function resolveRedirectPath(path: unknown, fallback: string = SiteRouter.index): string {
  return normalizeRedirectPath(path) ?? fallback
}

export function buildLoginPathWithRedirect(path: unknown): string {
  const normalizedPath = normalizeRedirectPath(path)
  if (!normalizedPath) return SiteRouter.login

  const params = new URLSearchParams({ [REDIRECT_QUERY_KEY]: normalizedPath })
  return `${SiteRouter.login}?${params.toString()}`
}

export function createLoginLocationWithRedirect(path: unknown) {
  const normalizedPath = normalizeRedirectPath(path)
  if (!normalizedPath) {
    return { path: SiteRouter.login }
  }

  return {
    path: SiteRouter.login,
    query: { [REDIRECT_QUERY_KEY]: normalizedPath },
  }
}

export function getCurrentPathWithQueryAndHash(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

export function stashOAuthLoginRedirect(path: unknown): void {
  const normalizedPath = normalizeRedirectPath(path)
  if (normalizedPath) {
    window.sessionStorage.setItem(OAUTH_LOGIN_REDIRECT_KEY, normalizedPath)
    return
  }

  window.sessionStorage.removeItem(OAUTH_LOGIN_REDIRECT_KEY)
}

export function consumeOAuthLoginRedirect(): string | null {
  const raw = window.sessionStorage.getItem(OAUTH_LOGIN_REDIRECT_KEY)
  window.sessionStorage.removeItem(OAUTH_LOGIN_REDIRECT_KEY)
  return normalizeRedirectPath(raw)
}

export { REDIRECT_QUERY_KEY }
