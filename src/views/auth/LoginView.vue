<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
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
import {
  stashOAuthLoginRedirect,
} from '@/utils/auth-redirect'

const route = useRoute()

const signUpRoute = computed(() => {
  const redirect = route.query.redirect
  if (typeof redirect !== 'string' || !redirect) {
    return SiteRouter.signUp
  }

  return {
    path: SiteRouter.signUp,
    query: { redirect },
  }
})

const handleKakaoLogin = () => {
  stashOAuthLoginRedirect(route.query.redirect)
  window.location.href = buildKakaoOAuthUrl()
}

const handleNaverLogin = () => {
  stashOAuthLoginRedirect(route.query.redirect)
  window.location.href = buildNaverOAuthUrl()

}

const handleGoogleLogin = () => {
  stashOAuthLoginRedirect(route.query.redirect)
  window.location.href = buildGoogleOAuthUrl()
}
</script>

<template>
  <AuthLayout>
    <AuthCard title="로그인" subtitle="컬처픽에 오신 걸 환영합니다 🥳">
      <template #prepend>
        <SocialLoginButtons
          @naver="handleNaverLogin"
          @google="handleGoogleLogin"
        />
        <AuthDivider />
      </template>

      <LoginForm />

      <template #footer>
        아직 계정이 없으신가요?
        <RouterLink :to="signUpRoute">회원가입</RouterLink>
      </template>
    </AuthCard>
  </AuthLayout>
</template>
