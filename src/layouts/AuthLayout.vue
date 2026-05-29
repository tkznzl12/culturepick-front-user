<script setup lang="ts">
import { useRouter } from 'vue-router'
import { SiteRouter } from '@/constants/routes'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push(SiteRouter.index)
}
</script>

<template>
  <div class="auth-layout">
    <div class="auth-layout__gradient auth-layout__gradient--bottom" aria-hidden="true" />
    <div class="auth-layout__gradient auth-layout__gradient--top" aria-hidden="true" />

    <button type="button" class="auth-layout__back" @click="goBack">
      <span aria-hidden="true">←</span>
      뒤로가기
    </button>

    <main class="auth-layout__main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  position: relative;
  display: flex;
  min-height: 100vh;
  overflow: hidden;
  background-color: var(--dark-mode-background-color);
}

.auth-layout__gradient {
  position: absolute;
  border-radius: 50rem;
  pointer-events: none;
}

.auth-layout__gradient--bottom {
  bottom: -7.63rem;
  right: -10.4rem;
  width: 37.5rem;
  height: 37.5rem;
  background: rgba(0, 166, 244, 0.08);
  filter: blur(6.25rem);
}

.auth-layout__gradient--top {
  top: -15.26rem;
  left: -10.4rem;
  width: 31.3rem;
  height: 31.3rem;
  background: rgba(21, 93, 252, 0.1);
  filter: blur(7.5rem);
}

.auth-layout__back {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0;
  border: none;
  background: transparent;
  font-size: var(--font-size-body);
  color: var(--caption-text-color);
  cursor: pointer;
}

.auth-layout__back:hover {
  color: var(--hover-point-text);
}

.auth-layout__main {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 4.5rem 1rem 2rem;
}
</style>
