<script setup lang="ts">
import naverAuthImage from '@/assets/oauth/naver-auth.svg'
import googleAuthImage from '@/assets/oauth/google-auth.svg'

const emit = defineEmits<{
  naver: []
  google: []
}>()
</script>

<template>
  <div class="social-login">
    <button type="button" class="social-login__btn" @click="emit('naver')">
      <img :src="naverAuthImage" alt="네이버 로그인" class="social-login__image" />
    </button>
    <button type="button" class="social-login__btn" @click="emit('google')">
      <img :src="googleAuthImage" alt="구글 로그인" class="social-login__image" />
    </button>
  </div>
</template>

<style scoped>
.social-login {
  display: flex;
      justify-content: center;
  gap: 0.75rem;
}

.social-login__btn {
  min-height: 2.5rem;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.social-login__image {
  display: block;
  width: 100%;
  height: 2.5rem;
  object-fit: contain;
}

@media (max-width: 767px) {
  .social-login {
    grid-template-columns: 1fr;
  }
}
</style>
