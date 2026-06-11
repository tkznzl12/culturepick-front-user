import { fetcher } from '@/api/client'
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '@/types/auth'

export const signup = (data: SignupRequest) => {
  return fetcher<SignupResponse>('/api/v1/auth/register/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const login = (data: LoginRequest) => {
  return fetcher<LoginResponse>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
