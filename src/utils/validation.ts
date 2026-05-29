export const getPasswordRules = (password: string) => {
  return {
    length: password.length >= 8,
    english: /[A-Za-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }
}

export const getPassedPasswordCount = (rules: Record<string, boolean>) => {
  return Object.values(rules).filter(Boolean).length
}

export const validateNickname = (nickname: string) => {
  const trimmedNickname = nickname.trim()

  if (!trimmedNickname) {
    return '닉네임을 입력해주세요.'
  }

  if (trimmedNickname.length > 50) {
    return '닉네임은 50자 이내로 입력해주세요.'
  }

  return ''
}

export const validateEmail = (email: string) => {
  const trimmedEmail = email.trim()

  if (!trimmedEmail) {
    return '이메일을 입력해주세요.'
  }

  if (!trimmedEmail.includes('@')) {
    return '@를 포함한 이메일 형식으로 입력해주세요.'
  }

  const emojiRegex = /[\u{1F300}-\u{1FAFF}]/gu

  if (emojiRegex.test(trimmedEmail)) {
    return '이메일에는 이모티콘을 사용할 수 없습니다.'
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

  if (!emailRegex.test(trimmedEmail)) {
    return '올바른 이메일 형식이 아닙니다.'
  }

  return ''
}
