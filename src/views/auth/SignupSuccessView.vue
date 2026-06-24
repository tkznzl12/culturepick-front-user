<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthCard from '@/components/form/auth/AuthCard.vue'
import CommonButton from '@/components/common/CommonButton.vue'
import { buildLoginPathWithRedirect } from '@/utils/auth-redirect'

const route = useRoute()

const loginPath = computed(() => buildLoginPathWithRedirect(route.query.redirect))
</script>

<template>
  <AuthLayout>
    <AuthCard
      title="회원가입이 완료되었습니다 🎭"
      subtitle="로그인 페이지로 이동하여 로그인을 해주세요!"
    >
      <div class="signup-success__action">
        <CommonButton
          :href="loginPath"
          text="로그인 하러가기"
          variant="gradient-shadow"
        />
      </div>
    </AuthCard>
  </AuthLayout>
</template>

<style scoped>
.signup-success__action {
  width: 100%;
}

.signup-success__action :deep(.common-button) {
  width: 100%;
}
</style>
