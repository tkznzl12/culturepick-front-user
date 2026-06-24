<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AuthInputField from '@/components/form/auth/AuthInputField.vue'
import CommonButton from '@/components/common/CommonButton.vue'
import { useLoginForm } from '@/composables/useLoginForm'
import { SiteRouter } from '@/constants/routes'
import mailIcon from '@/assets/icons/mail.svg'
import lockIcon from '@/assets/icons/lock.svg'
import eyeIcon from '@/assets/icons/eye.svg'
import closeEyeIcon from '@/assets/icons/close-eye.svg'

const {
  loginData,
  showPassword,
  isSubmitting,
  errorMessage,
  updateField,
  togglePasswordVisibility,
  handleLogin,
} = useLoginForm()
</script>

<template>
  <form class="auth-form" @submit.prevent="handleLogin">
    <AuthInputField
      id="email"
      label="이메일"
      :icon="mailIcon"
      type="email"
      placeholder="example@email.com"
      autocomplete="email"
      :model-value="loginData.email"
      @update:model-value="updateField('email', $event)"
    />

    <AuthInputField
      id="password"
      label="비밀번호"
      :icon="lockIcon"
      :type="showPassword ? 'text' : 'password'"
      placeholder="비밀번호 입력"
      autocomplete="current-password"
      show-toggle
      :visible="showPassword"
      :model-value="loginData.password"
      @update:model-value="updateField('password', $event)"
      @toggle-visibility="togglePasswordVisibility"
    >
      <template #toggle-icon>
        <img :src="showPassword ? eyeIcon : closeEyeIcon" alt="" width="15" height="15" />
      </template>
    </AuthInputField>

    <RouterLink :to="SiteRouter.findAccount" class="auth-form__forgot-link">
      비밀번호를 잊으셨나요?
    </RouterLink>

    <CommonButton
      variant="gradient-shadow"
      text="로그인"
      type="submit"
      class="auth-form__submit"
      :disabled="isSubmitting"
    />

    <p
      v-if="errorMessage"
      class="auth-form__error-message"
      role="alert"
      aria-live="polite"
    >
      {{ errorMessage }}
    </p>
  </form>
</template>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-form__forgot-link {
  display: block;
  margin-top: -0.25rem;
  text-align: right;
  font-size: var(--font-size-caption);
  color: var(--caption-text-color);
}

.auth-form__forgot-link:hover {
  color: var(--hover-point-text);
}

.auth-form__submit {
  width: 100%;
}

.auth-form__submit :deep(.common-button) {
  width: 100%;
}

.auth-form__error-message {
  margin-top: -0.25rem;
  font-size: var(--font-size-caption);
  color: var(--red-tag-font-color);
}
</style>
