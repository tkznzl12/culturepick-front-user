import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '@/api/auth'
import { SiteRouter } from '@/constants/routes'
import type { LoginErrorResponse } from '@/types/auth'
import { setAuthCookies } from '@/utils/auth-cookie'
import { resolveRedirectPath } from '@/utils/auth-redirect'

export function useLoginForm() {
  const router = useRouter()
  const route = useRoute()
  const showPassword = ref(false)
  const isSubmitting = ref(false)
  const errorMessage = ref('')

  const loginData = reactive({
    email: '',
    password: '',
  })

  const updateField = (field: keyof typeof loginData, value: string) => {
    loginData[field] = value
    if (errorMessage.value) {
      errorMessage.value = ''
    }
  }

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
  }

  const handleLogin = async () => {
    if (isSubmitting.value) return

    isSubmitting.value = true
    errorMessage.value = ''

    try {
      const response = await login(loginData)
      setAuthCookies(response.access, response.refresh)
      const redirectPath = resolveRedirectPath(route.query.redirect, SiteRouter.index)
      await router.replace(redirectPath)
    } catch (error: unknown) {
      console.error(error)
      const defaultMessage = '로그인이 불가합니다. 이메일이나 비밀번호를 확인해주세요.'
      const apiError = error as LoginErrorResponse
      const serverMessage = apiError?.detail?.detail || apiError?.message || ''

      if (
        serverMessage.includes('네트워크') ||
        serverMessage.includes('Network') ||
        error instanceof TypeError
      ) {
        errorMessage.value = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      } else {
        errorMessage.value = defaultMessage
      }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    loginData,
    showPassword,
    isSubmitting,
    errorMessage,
    updateField,
    togglePasswordVisibility,
    handleLogin,
  }
}
