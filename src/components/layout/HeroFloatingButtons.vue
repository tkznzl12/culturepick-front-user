<script setup lang="ts">
import userIcon from '@/assets/icons/user-icon.svg'
import qnaIcon from '@/assets/icons/qna-icon.svg'
import IconAi from '@/components/icons/IconAi.vue'

const emit = defineEmits<{
  aiRecommend: []
  profile: []
  support: []
}>()
</script>

<template>
  <div
    class="hero-fab pointer-events-none fixed bottom-8 right-6 z-40 flex flex-col gap-3 sm:right-8"
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

@media (max-width: 767px) {
  .hero-fab {
    bottom: 1.25rem;
    right: 1rem;
  }

  .hero-fab__btn {
    width: 2.75rem;
    height: 2.75rem;
  }
}

@media (max-width: 479px) {
  .hero-fab {
    bottom: 1rem;
    right: 0.75rem;
    gap: 0.625rem;
  }
}
</style>
