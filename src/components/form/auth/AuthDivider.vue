<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="auth-divider">
    <span class="auth-divider__line" />
    <p class="auth-divider__text">{{ text ?? '또는 이메일로 로그인' }}</p>
    <span class="auth-divider__line" />
  </div>
</template>

<style scoped>
.auth-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.25rem 0;
}

.auth-divider__line {
  flex: 1;
  display: block;
  height: 0.0625rem;
  background-color: var(--input-border-color);
}

.auth-divider__text {
  margin: 0;
  font-size: var(--font-size-caption);
  color: var(--caption-text-color);
  white-space: nowrap;
}
</style>
