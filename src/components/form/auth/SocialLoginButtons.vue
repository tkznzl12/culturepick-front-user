<script setup lang="ts">
const emit = defineEmits<{
  kakao: []
  naver: []
  google: []
}>()
</script>

<template>
  <div class="social-login">
    <button type="button" class="social-login__btn social-login__btn--kakao" @click="emit('kakao')">
      <span class="social-login__icon" aria-hidden="true">💬</span>
      카카오
    </button>
    <button type="button" class="social-login__btn social-login__btn--naver" @click="emit('naver')">
      <span class="social-login__icon social-login__icon--naver" aria-hidden="true">N</span>
      네이버
    </button>
    <button type="button" class="social-login__btn social-login__btn--google" @click="emit('google')">
      <span class="social-login__icon social-login__icon--google" aria-hidden="true">G</span>
      구글
    </button>
  </div>
</template>

<style scoped>
.social-login {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
}

.social-login__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-height: 2.75rem;
  padding: 0.625rem 0.5rem;
  border: none;
  border-radius: 0.875rem;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
}

.social-login__btn--kakao {
  background-color: #fee500;
  color: #191600;
}

.social-login__btn--naver {
  background-color: #03c75a;
  color: #ffffff;
}

.social-login__btn--google {
  background-color: #ffffff;
  color: #1f2937;
}

.social-login__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  font-size: 0.75rem;
  line-height: 1;
}

.social-login__icon--naver {
  font-weight: var(--font-weight-bold);
}

.social-login__icon--google {
  font-weight: var(--font-weight-bold);
  color: #4285f4;
}
</style>
