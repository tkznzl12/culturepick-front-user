import { buildApiUrl } from '@/api/index'
import { fetcher } from '@/api/client'
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  SocialLoginRequest,
  SocialLoginResponse,
  SignupRequest,
  SignupResponse,
} from '@/types/auth'
import { getRefreshToken } from '@/utils/auth-cookie'

export const signup = (data: SignupRequest) => {
  return fetcher<SignupResponse>('/api/v1/auth/register/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const login = (data: LoginRequest) => {
  return fetch(buildApiUrl('/api/v1/auth/login/'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw payload
      }
      return payload as LoginResponse
    })
}

export const socialLogin = (data: SocialLoginRequest) => {
  return fetcher<SocialLoginResponse>('/api/v1/auth/social/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const logout = () => {
  const refreshToken = getRefreshToken()

  return fetcher<LogoutResponse>('/api/v1/auth/logout/', {
    method: 'POST',
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  })
}
