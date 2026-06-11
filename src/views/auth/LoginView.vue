<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthCard from '@/components/form/auth/AuthCard.vue'
import AuthDivider from '@/components/form/auth/AuthDivider.vue'
import LoginForm from '@/components/form/auth/LoginForm.vue'
import SocialLoginButtons from '@/components/form/auth/SocialLoginButtons.vue'
import { SiteRouter } from '@/constants/routes'
import {
  buildGoogleOAuthUrl,
  buildKakaoOAuthUrl,
  buildNaverOAuthUrl,
} from '@/utils/oauth'

const handleKakaoLogin = () => {
  window.location.href = buildKakaoOAuthUrl()
}

const handleNaverLogin = () => {
  window.location.href = buildNaverOAuthUrl()
}

const handleGoogleLogin = () => {
  window.location.href = buildGoogleOAuthUrl()
}
</script>

<template>
  <AuthLayout>
    <AuthCard title="로그인" subtitle="컬처픽에 오신 걸 환영합니다 🥳">
      <template #prepend>
        <SocialLoginButtons
          @kakao="handleKakaoLogin"
          @naver="handleNaverLogin"
          @google="handleGoogleLogin"
        />
        <AuthDivider />
      </template>

      <LoginForm />

      <template #footer>
        아직 계정이 없으신가요?
        <RouterLink :to="SiteRouter.signUp">회원가입</RouterLink>
      </template>
    </AuthCard>
  </AuthLayout>
</template>
