<script setup lang="ts">
import userIcon from '@/assets/icons/user-icon.svg'
import IconAi from '@/components/icons/IconAi.vue'

const emit = defineEmits<{
  aiRecommend: []
  profile: []
  support: []
}>()
</script>

<template>
  <div
    class="hero-fab pointer-events-none absolute bottom-8 right-6 z-10 flex flex-col gap-3 sm:right-8"
    aria-label="빠른 메뉴"
  >
    <button
      type="button"
      class="hero-fab__btn hero-fab__btn--primary pointer-events-auto"
      aria-label="AI 추천"
      @click="emit('aiRecommend')"
    >
      <IconAi class="block text-[20px] text-white" />
    </button>

    <button
      type="button"
      class="hero-fab__btn pointer-events-auto"
      aria-label="마이페이지"
      @click="emit('profile')"
    >
      <img :src="userIcon" alt="" width="20" height="20" class="block" />
    </button>

    <button
      type="button"
      class="hero-fab__btn pointer-events-auto"
      aria-label="고객지원"
      @click="emit('support')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 11v2a8 8 0 0 0 8 8h1v-3H11a5 5 0 0 1-5-5v-2H3z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M21 11v2a8 8 0 0 1-8 8h-1v-3h1a5 5 0 0 0 5-5v-2h3z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M7 11a5 5 0 0 1 10 0v5a5 5 0 0 1-10 0v-5z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.hero-fab__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  padding: 0;
  border: 1px solid var(--line-component-border-color);
  border-radius: 9999px;
  background-color: var(--line-component-background-color);
  color: var(--dark-mode-content-font-color);
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.hero-fab__btn:hover {
  border-color: var(--hover-point-text);
  transform: translateY(-1px);
}

.hero-fab__btn--primary {
  border: none;
  background: var(--gradient-button);
  color: #fff;
}

.hero-fab__btn--primary:hover {
  opacity: 0.92;
}
</style>
