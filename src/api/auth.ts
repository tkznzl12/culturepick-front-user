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
  return fetcher<LoginResponse>('/api/v1/auth/login/', {
    method: 'POST',
    body: JSON.stringify(data),
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
