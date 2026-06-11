import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import { SiteRouter } from '@/constants/routes'
import type { LoginErrorResponse } from '@/types/auth'
import { setAuthCookies } from '@/utils/auth-cookie'

export function useLoginForm() {
  const router = useRouter()
  const showPassword = ref(false)
  const isSubmitting = ref(false)
  const errorMessage = ref('')

  const loginData = reactive({
    email: '',
    password: '',
  })

  const updateField = (field: keyof typeof loginData, value: string) => {
    loginData[field] = value
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
      await router.push(SiteRouter.index)
    } catch (error: unknown) {
      console.error(error)
      const apiError = error as LoginErrorResponse
      const message =
        apiError?.detail?.detail ||
        apiError?.message ||
        (error instanceof Error ? error.message : '네트워크 오류가 발생했습니다. 다시 시도해 주세요.')

      errorMessage.value = message
      alert(errorMessage.value)
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
