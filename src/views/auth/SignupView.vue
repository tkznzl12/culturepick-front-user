<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthCard from '@/components/form/auth/AuthCard.vue'
import SignupForm from '@/components/form/auth/SignupForm.vue'
import { SiteRouter } from '@/constants/routes'
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
        <RouterLink :to="SiteRouter.login">로그인</RouterLink>
      </template>
    </AuthCard>
  </AuthLayout>
</template>
