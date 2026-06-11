<script setup lang="ts">
import kakaoAuthImage from '@/assets/oauth/kakao-auth.svg'
import naverAuthImage from '@/assets/oauth/naver-auth.svg'
import googleAuthImage from '@/assets/oauth/google-auth.svg'

const emit = defineEmits<{
  kakao: []
  naver: []
  google: []
}>()
</script>

<template>
  <div class="social-login">
    <button type="button" class="social-login__btn" @click="emit('kakao')">
      <img :src="kakaoAuthImage" alt="카카오 로그인" class="social-login__image" />
    </button>
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
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.social-login__btn {
  min-height: 3rem;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.social-login__image {
  display: block;
  width: 100%;
  height: 3rem;
  object-fit: contain;
}

@media (max-width: 767px) {
  .social-login {
    grid-template-columns: 1fr;
  }
}
</style>
