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

export type PasswordRuleType = 'length' | 'english' | 'number' | 'special'

export type SignupFormErrors = {
  email: string
  password: string
  password_confirm: string
  nickname: string
}
