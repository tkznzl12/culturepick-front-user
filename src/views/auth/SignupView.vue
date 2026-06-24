<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthCard from '@/components/form/auth/AuthCard.vue'
import SignupForm from '@/components/form/auth/SignupForm.vue'
import { SiteRouter } from '@/constants/routes'

const route = useRoute()

const loginRoute = computed(() => {
  const redirect = route.query.redirect
  if (typeof redirect !== 'string' || !redirect) {
    return SiteRouter.login
  }

  return {
    path: SiteRouter.login,
    query: { redirect },
  }
})
</script>

<template>
  <AuthLayout>
    <AuthCard
      title="회원가입"
      subtitle="컬처픽 멤버가 되어 공연을 즐겨보세요 🎭"
    >
      <SignupForm />

      <template #footer>
        이미 계정이 있으신가요?
        <RouterLink :to="loginRoute">로그인</RouterLink>
      </template>
    </AuthCard>
  </AuthLayout>
</template>
