import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import { SiteRouter } from '@/constants/routes'
import { setAuthCookies } from '@/utils/auth-cookie'

export function useLoginForm() {
  const router = useRouter()
  const showPassword = ref(false)
  const isSubmitting = ref(false)

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

    try {
      const response = await login(loginData)
      setAuthCookies(response.access, response.refresh)
      await router.replace(SiteRouter.index)
    } catch (error: unknown) {
      console.error(error)
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : '로그인에 실패했습니다.'
      alert(message)
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    loginData,
    showPassword,
    isSubmitting,
    updateField,
    togglePasswordVisibility,
    handleLogin,
  }
}
