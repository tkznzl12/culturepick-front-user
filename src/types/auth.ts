export type SignupRequest = {
  email: string
  password: string
  password_confirm: string
  nickname?: string
}

export type SignupResponse = {
  message: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  access: string
  refresh: string
}

export type OAuthProvider = 'google' | 'kakao' | 'naver'

export type SocialLoginRequest = {
  provider: OAuthProvider
  code: string
  redirect_uri: string
  state?: string
}

export type SocialLoginResponse = {
  access: string
  refresh: string
}

export type LogoutResponse = {
  message: string
}

export type LoginErrorResponse = {
  code?: string
  message?: string
  detail?: {
    detail?: string
  }
}

export type LogoutErrorResponse = {
  code?: string
  message?: string
  detail?: {
    detail?: string
    code?: string
  }
}

export type PasswordRuleType = 'length' | 'english' | 'number' | 'special'

export type SignupFormErrors = {
  email: string
  password: string
  password_confirm: string
  nickname: string
}
