import { reactive, ref, toRef } from 'vue'
import { useRouter } from 'vue-router'
import { signup } from '@/api/auth'
import { SiteRouter } from '@/constants/routes'
import type { SignupFormErrors } from '@/types/auth'
import { validateEmail, validateNickname } from '@/utils/validation'
import { usePasswordValidation } from '@/composables/usePasswordValidation'

const createEmptyErrors = (): SignupFormErrors => ({
  email: '',
  password: '',
  password_confirm: '',
  nickname: '',
})

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

    const nicknameError = validateNickname(signupData.nickname)
    if (nicknameError) {
      signupError.nickname = nicknameError
      return
    }

    const emailError = validateEmail(signupData.email)
    if (emailError) {
      signupError.email = emailError
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
      ...signupData,
      nickname: signupData.nickname.trim(),
      email: signupData.email.trim(),
    }

    isSubmitting.value = true

    try {
      await signup(submitData)
      await router.replace(SiteRouter.signUpSuccess)
    } catch (error: unknown) {
      console.error(error)
      if (typeof error === 'object' && error !== null && 'detail' in error) {
        Object.assign(signupError, (error as { detail: Partial<SignupFormErrors> }).detail)
      }
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
