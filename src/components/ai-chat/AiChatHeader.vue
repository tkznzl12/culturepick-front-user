<script setup lang="ts">
import IconAi from '@/components/icons/IconAi.vue'

defineEmits<{
  reset: []
}>()
</script>

<template>
  <header class="ai-chat-header">
    <div class="ai-chat-header__info">
      <div class="ai-chat-header__title-row">
        <div class="ai-chat-header__icon" aria-hidden="true">
          <IconAi class="text-[18px] text-[var(--dark-mode-main-font-color)]" />
        </div>
        <div class="ai-chat-header__title-group">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="ai-chat-header__title">AI 공연 추천</h1>
            <span class="ai-chat-header__status">
              <span class="ai-chat-header__status-dot" aria-hidden="true" />
              온라인
            </span>
          </div>
          <p class="ai-chat-header__subtitle">
            나에게 맞는 공연을 AI가 추천해드려요
          </p>
        </div>
      </div>
    </div>

    <button type="button" class="ai-chat-header__reset" @click="$emit('reset')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-4 w-4 shrink-0"
        aria-hidden="true"
      >
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M3 21v-5h5" />
      </svg>
      초기화
    </button>
  </header>
</template>

<style scoped>
.ai-chat-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.ai-chat-header__title-row {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}

.ai-chat-header__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.875rem;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary) 55%,
    var(--color-secondary) 100%
  );
  flex-shrink: 0;
}

.ai-chat-header__title {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--dark-mode-main-font-color);
  line-height: 1.3;
}

.ai-chat-header__status {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: var(--font-size-caption);
  font-weight: 500;
  color: var(--green-tag-font-color);
}

.ai-chat-header__status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: var(--green-tag-font-color);
}

.ai-chat-header__subtitle {
  margin: 0.375rem 0 0;
  font-size: 0.9375rem;
  color: var(--dark-mode-content-font-color);
}

.ai-chat-header__reset {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: 1px solid var(--line-component-border-color);
  border-radius: 0.75rem;
  background-color: var(--line-component-background-color);
  color: var(--dark-mode-content-font-color);
  font-size: var(--font-size-body);
  font-weight: 500;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
  flex-shrink: 0;
}

.ai-chat-header__reset:hover {
  border-color: var(--hover-point-text);
  color: var(--dark-mode-main-font-color);
}

@media (max-width: 639px) {
  .ai-chat-header {
    flex-direction: column;
    align-items: stretch;
  }

  .ai-chat-header__reset {
    align-self: flex-end;
  }

  .ai-chat-header__title {
    font-size: 1.25rem;
  }
}
</style>
