import { computed, type Ref } from 'vue'
import type { PasswordRuleType } from '@/types/auth'
import { getPassedPasswordCount, getPasswordRules } from '@/utils/validation'

export const PASSWORD_CHECK_LIST: { type: PasswordRuleType; label: string }[] = [
  { type: 'length', label: '8자 이상' },
  { type: 'english', label: '영문 포함' },
  { type: 'number', label: '숫자 포함' },
  { type: 'special', label: '특수문자 포함' },
]

export function usePasswordValidation(password: Ref<string>) {
  const passwordRules = computed(() => getPasswordRules(password.value))
  const passedCount = computed(() => getPassedPasswordCount(passwordRules.value))

  const strengthLevel = computed<'weak' | 'medium' | 'strong'>(() => {
    if (passedCount.value === 4) return 'strong'
    if (passedCount.value >= 2) return 'medium'
    return 'weak'
  })

  const isPasswordValid = computed(() => passedCount.value === 4)

  return {
    passwordRules,
    passedCount,
    strengthLevel,
    isPasswordValid,
  }
}
