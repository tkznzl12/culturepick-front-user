<script setup lang="ts">
import { logout } from '@/api/auth'
import CommonButton from '@/components/common/CommonButton.vue'
import { SiteRouter } from '@/constants/routes'
import type { LogoutErrorResponse } from '@/types/auth'
import { clearAuthCookies } from '@/utils/auth-cookie'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = async () => {
  try {
    await logout()
    clearAuthCookies()
    await router.push(SiteRouter.index)
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error)
    const apiError = error as LogoutErrorResponse
    const isAuthError =
      apiError?.code === 'authentication_failed' || apiError?.message === '유효하지 않은 토큰입니다.'

    if (isAuthError) {
      clearAuthCookies()
      await router.push(SiteRouter.login)
    }
  }
}
</script>

<template>
  <CommonButton variant="line" text="로그아웃" @click="handleLogout" />
</template>
