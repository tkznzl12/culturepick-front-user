import { reactive, ref, toRef } from 'vue'
import { useRouter } from 'vue-router'
import { signup } from '@/api/auth'
import { SiteRouter } from '@/constants/routes'
import type { SignupFormErrors } from '@/types/auth'
import { validateEmail } from '@/utils/validation'
import { usePasswordValidation } from '@/composables/usePasswordValidation'

const createEmptyErrors = (): SignupFormErrors => ({
  email: '',
  password: '',
  password_confirm: '',
  nickname: '',
})

const getMessageFromUnknown = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
  return ''
}

export function useSignupForm() {
  const router = useRouter()
  const showPassword = ref(false)
  const showPasswordConfirm = ref(false)
  const isSubmitting = ref(false)

  const signupData = reactive({
    email: '',
    password: '',
    password_confirm: '',
    nickname: '',
  })

  const signupError = reactive<SignupFormErrors>(createEmptyErrors())

  const { passedCount, isPasswordValid, passwordRules, strengthLevel } =
    usePasswordValidation(toRef(signupData, 'password'))

  const updateField = (field: keyof typeof signupData, value: string) => {
    signupData[field] = value

    if (field === 'password' || field === 'password_confirm') {
      signupError.password_confirm = ''
    }
  }

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
  }

  const togglePasswordConfirmVisibility = () => {
    showPasswordConfirm.value = !showPasswordConfirm.value
  }

  const resetErrors = () => {
    Object.assign(signupError, createEmptyErrors())
  }

  const handleSubmit = async () => {
    if (isSubmitting.value) return

    resetErrors()

    const emailError = validateEmail(signupData.email)
    if (emailError) {
      signupError.email = emailError
      return
    }

    const trimmedNickname = signupData.nickname.trim()
    if (trimmedNickname.length > 50) {
      signupError.nickname = '닉네임은 50자 이내로 입력해주세요.'
      return
    }

    if (!isPasswordValid.value) {
      signupError.password = '비밀번호 조건을 모두 만족해주세요.'
      return
    }

    if (signupData.password !== signupData.password_confirm) {
      signupError.password_confirm = '비밀번호가 일치하지 않습니다.'
      return
    }

    const submitData = {
      email: signupData.email.trim(),
      password: signupData.password,
      password_confirm: signupData.password_confirm,
      ...(trimmedNickname ? { nickname: trimmedNickname } : {}),
    }

    isSubmitting.value = true

    try {
      const response = await signup(submitData)
      if (typeof response.message === 'string' && response.message.length > 0) {
        // 기존 프로젝트 흐름 유지: 성공 화면으로 이동
        await router.replace(SiteRouter.signUpSuccess)
        return
      }

      signupError.email = '회원가입 응답을 확인할 수 없습니다. 다시 시도해주세요.'
    } catch (error: unknown) {
      console.error(error)

      if (error instanceof TypeError) {
        signupError.email = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        return
      }

      if (typeof error === 'object' && error !== null) {
        const errorObject = error as Record<string, unknown>

        const emailError = getMessageFromUnknown(errorObject.email)
        if (emailError) {
          signupError.email = emailError
          return
        }

        const passwordError = getMessageFromUnknown(errorObject.password)
        if (passwordError) {
          signupError.password = passwordError
          return
        }

        const passwordConfirmError = getMessageFromUnknown(errorObject.password_confirm)
        if (passwordConfirmError) {
          signupError.password_confirm = passwordConfirmError
          return
        }

        const nicknameError = getMessageFromUnknown(errorObject.nickname)
        if (nicknameError) {
          signupError.nickname = nicknameError
          return
        }

        const detailError = getMessageFromUnknown(errorObject.detail)
        if (detailError) {
          signupError.email = detailError
          return
        }

        const nonFieldError = getMessageFromUnknown(errorObject.non_field_errors)
        if (nonFieldError) {
          signupError.email = nonFieldError
          return
        }

        const fallbackMessage = getMessageFromUnknown(errorObject.message)
        if (fallbackMessage) {
          signupError.email = fallbackMessage
          return
        }
      }

      signupError.email = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    signupData,
    signupError,
    showPassword,
    showPasswordConfirm,
    passedCount,
    passwordRules,
    strengthLevel,
    isSubmitting,
    updateField,
    togglePasswordVisibility,
    togglePasswordConfirmVisibility,
    handleSubmit,
  }
}
