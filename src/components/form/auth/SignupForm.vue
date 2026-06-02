<script setup lang="ts">
import { computed } from 'vue'
import AuthInputField from '@/components/form/auth/AuthInputField.vue'
import CommonButton from '@/components/common/CommonButton.vue'
import { PASSWORD_CHECK_LIST } from '@/composables/usePasswordValidation'
import { useSignupForm } from '@/composables/useSignupForm'
import CheckActiveIcon from '@/assets/icons/check-active.svg?component'
import mailIcon from '@/assets/icons/mail.svg'
import lockIcon from '@/assets/icons/lock.svg'
import eyeIcon from '@/assets/icons/eye.svg'
import closeEyeIcon from '@/assets/icons/close-eye.svg'
import userIcon from '@/assets/icons/user-icon.svg'

const {
  signupData,
  signupError,
  showPassword,
  showPasswordConfirm,
  passedCount,
  passwordRules,
  strengthLevel,
  isSubmitting,
  updateField,
  togglePasswordVisibility,
  togglePasswordConfirmVisibility,
  handleSubmit,
} = useSignupForm()

const strengthClass = computed(() => ({
  'auth-form__strength-bar--strong': strengthLevel.value === 'strong',
  'auth-form__strength-bar--medium': strengthLevel.value === 'medium',
  'auth-form__strength-bar--weak': strengthLevel.value === 'weak',
}))

const passwordsMatch = computed(
  () =>
    signupData.password.length > 0 &&
    signupData.password_confirm.length > 0 &&
    signupData.password === signupData.password_confirm,
)
</script>

<template>
  <form class="auth-form" @submit.prevent="handleSubmit">
    <AuthInputField
      id="nickname"
      label="이름"
      :icon="userIcon"
      type="text"
      placeholder="홍길동"
      autocomplete="name"
      :model-value="signupData.nickname"
      :error="signupError.nickname"
      @update:model-value="updateField('nickname', $event)"
    />

    <AuthInputField
      id="email"
      label="이메일"
      :icon="mailIcon"
      type="email"
      placeholder="example@email.com"
      autocomplete="email"
      :model-value="signupData.email"
      :error="signupError.email"
      @update:model-value="updateField('email', $event)"
    />

    <div class="auth-form__field-group">
      <AuthInputField
        id="password"
        label="비밀번호"
        :icon="lockIcon"
        :type="showPassword ? 'text' : 'password'"
        placeholder="8자 이상 입력"
        autocomplete="new-password"
        show-toggle
        :visible="showPassword"
        :model-value="signupData.password"
        :error="signupError.password"
        @update:model-value="updateField('password', $event)"
        @toggle-visibility="togglePasswordVisibility"
      >
        <template #toggle-icon>
          <img :src="showPassword ? eyeIcon : closeEyeIcon" alt="" width="15" height="15" />
        </template>
      </AuthInputField>

      <template v-if="signupData.password.length > 0">
        <div class="auth-form__strength">
          <div
            v-for="item in 4"
            :key="item"
            class="auth-form__strength-bar"
            :class="passedCount >= item ? strengthClass : undefined"
          />
        </div>

        <ul class="auth-form__check-list">
          <li
            v-for="rule in PASSWORD_CHECK_LIST"
            :key="rule.type"
            class="auth-form__check-item"
            :class="
              passwordRules[rule.type]
                ? 'auth-form__check-item--active'
                : 'auth-form__check-item--inactive'
            "
          >
            <CheckActiveIcon class="auth-form__check-icon" aria-hidden="true" />
            {{ rule.label }}
          </li>
        </ul>
      </template>
    </div>

    <div class="auth-form__field-group">
      <AuthInputField
        id="password_confirm"
        label="비밀번호 확인"
        :icon="lockIcon"
        :type="showPasswordConfirm ? 'text' : 'password'"
        placeholder="비밀번호 재입력"
        autocomplete="new-password"
        show-toggle
        :visible="showPasswordConfirm"
        :success="passwordsMatch"
        :model-value="signupData.password_confirm"
        :error="signupError.password_confirm"
        @update:model-value="updateField('password_confirm', $event)"
        @toggle-visibility="togglePasswordConfirmVisibility"
      >
        <template #toggle-icon>
          <img
            :src="showPasswordConfirm ? eyeIcon : closeEyeIcon"
            alt=""
            width="15"
            height="15"
          />
        </template>
      </AuthInputField>

      <div
        v-if="passwordsMatch"
        class="auth-form__match auth-form__check-item auth-form__check-item--active"
      >
        <CheckActiveIcon class="auth-form__check-icon" aria-hidden="true" />
        <span>비밀번호가 일치합니다</span>
      </div>
    </div>

    <CommonButton
      variant="gradient-shadow"
      text="회원가입"
      type="submit"
      class="auth-form__submit"
      :disabled="isSubmitting"
    />
  </form>
</template>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-form__field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.auth-form__strength {
  display: flex;
  gap: 0.25rem;
  width: 100%;
}

.auth-form__strength-bar {
  flex: 1;
  height: 0.25rem;
  border-radius: 50rem;
  background-color: var(--line-component-background-color);
}

.auth-form__strength-bar--strong {
  background-color: #00d492;
}

.auth-form__strength-bar--medium {
  background-color: #ff8904;
}

.auth-form__strength-bar--weak {
  background-color: #fb2c36;
}

.auth-form__check-list {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.25rem;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.auth-form__check-item {
  display: inline-flex;
  flex: 1 1 0;
  min-width: 0;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--font-size-caption);
}

.auth-form__check-icon {
  flex-shrink: 0;
  width: 0.6875rem;
  height: 0.6875rem;
}

.auth-form__check-item--active {
  color: #00d492;
}

.auth-form__check-item--active .auth-form__check-icon {
  color: #00d492;
}

.auth-form__check-item--inactive {
  color: var(--caption-text-color);
}

.auth-form__check-item--inactive .auth-form__check-icon {
  color: var(--caption-text-color);
}

.auth-form__match {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
  font-size: var(--font-size-caption);
}

.auth-form__submit {
  width: 100%;
  margin-top: 1.5rem;
}

.auth-form__submit :deep(.common-button) {
  width: 100%;
}
</style>
