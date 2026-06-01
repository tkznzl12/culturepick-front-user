<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Tailwind rounded 클래스 (예: rounded-md, rounded-full) */
    rounded?: string
    /** 추가 Tailwind / 커스텀 클래스 */
    blockClass?: string
  }>(),
  {
    rounded: 'rounded-md',
    blockClass: '',
  },
)
</script>

<template>
  <div
    class="skeleton-block"
    :class="[rounded, blockClass]"
    aria-hidden="true"
  />
</template>

<style scoped>
.skeleton-block {
  display: block;
  background-color: var(--line-component-background-color);
  position: relative;
  overflow: hidden;
}

.skeleton-block::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgb(255 255 255 / 0.04) 40%,
    rgb(255 255 255 / 0.1) 50%,
    rgb(255 255 255 / 0.04) 60%,
    transparent 100%
  );
  animation: skeleton-shimmer 1.6s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>
