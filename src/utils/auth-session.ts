import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { clearAuthCookies } from '@/utils/auth-cookie'
import {
  buildLoginPathWithRedirect,
  getCurrentPathWithQueryAndHash,
  resolveRedirectPath,
} from '@/utils/auth-redirect'
import { clearNaverOAuthState } from '@/utils/oauth'

const OAUTH_LOGIN_REDIRECT_KEY = 'oauth-login-redirect'
const OAUTH_REDIRECT_URI_KEY_PREFIX = 'oauth_redirect_uri'
const COMMUNITY_AUTH_TOAST_KEY = 'community-auth-required-toast'
const COMMUNITY_NOT_FOUND_TOAST_KEY = 'community-not-found-toast'
const COMMUNITY_DELETE_SUCCESS_TOAST_KEY = 'community-delete-success-toast'
const COMMUNITY_EDIT_FORBIDDEN_TOAST_KEY = 'community-edit-forbidden-toast'
export const UNAUTHORIZED_REDIRECT_ERROR_MESSAGE = 'UNAUTHORIZED_REDIRECT_TRIGGERED'

function clearSessionAuthRelatedKeys(): void {
  window.sessionStorage.removeItem(OAUTH_LOGIN_REDIRECT_KEY)
  window.sessionStorage.removeItem(`${OAUTH_REDIRECT_URI_KEY_PREFIX}:google`)
  window.sessionStorage.removeItem(`${OAUTH_REDIRECT_URI_KEY_PREFIX}:naver`)
  window.sessionStorage.removeItem(`${OAUTH_REDIRECT_URI_KEY_PREFIX}:kakao`)
  window.sessionStorage.removeItem(COMMUNITY_AUTH_TOAST_KEY)
  window.sessionStorage.removeItem(COMMUNITY_NOT_FOUND_TOAST_KEY)
  window.sessionStorage.removeItem(COMMUNITY_DELETE_SUCCESS_TOAST_KEY)
  window.sessionStorage.removeItem(COMMUNITY_EDIT_FORBIDDEN_TOAST_KEY)
  clearNaverOAuthState()
}

export function clearClientAuthState(): void {
  clearAuthCookies()
  clearSessionAuthRelatedKeys()
  useAuthStore().resetAuthState()
  useUserStore().resetUserState()
}

export function redirectToLoginWithRedirect(redirectPath?: unknown): void {
  const safeRedirectPath =
    redirectPath === undefined
      ? getCurrentPathWithQueryAndHash()
      : resolveRedirectPath(redirectPath, getCurrentPathWithQueryAndHash())
  const loginPath = buildLoginPathWithRedirect(safeRedirectPath)

  if (window.location.pathname.startsWith('/login')) {
    return
  }

  window.location.replace(loginPath)
}

export function handleUnauthorizedAccess(redirectPath?: unknown): never {
  clearClientAuthState()
  redirectToLoginWithRedirect(redirectPath)
  throw new Error(UNAUTHORIZED_REDIRECT_ERROR_MESSAGE)
}

export function isUnauthorizedRedirectError(error: unknown): boolean {
  return error instanceof Error && error.message === UNAUTHORIZED_REDIRECT_ERROR_MESSAGE
}
