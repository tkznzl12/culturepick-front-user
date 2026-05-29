<script setup lang="ts">
import CommonButton from '@/components/common/CommonButton.vue'
import { clearAuthCookies } from '@/utils/auth-cookie'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = async () => {
  try {
    clearAuthCookies()
    await router.push('/login')
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error)
  }
}
</script>

<template>
  <CommonButton variant="line" text="로그아웃" @click="handleLogout" />
</template>
