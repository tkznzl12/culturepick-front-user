<script setup lang="ts">
import { computed } from 'vue'
import EventCard from '@/components/card/EventCard.vue'
import IconAi from '@/components/icons/IconAi.vue'
import { AI_CHAT_SUGGESTIONS } from '@/constants/aiChat'
import { SiteRouter } from '@/constants/routes'
import { isEventCardFavoriteTarget } from '@/utils/event-card-navigation'
import type { ChatMessage } from '@/types/aiChat'

const props = defineProps<{
  message: ChatMessage
  favoriteIds?: Set<string | number>
}>()

const emit = defineEmits<{
  selectSuggestion: [text: string]
  toggleFavorite: [id: string | number]
}>()

const isUser = computed(() => props.message.role === 'user')
const isAssistant = computed(() => props.message.role === 'assistant')

const formattedContent = computed(() => props.message.content)

function openPerformanceInNewTab(
  event: MouseEvent | KeyboardEvent,
  performanceId: string | number,
) {
  if (isEventCardFavoriteTarget(event.target)) {
    event.preventDefault()
    return
  }

  const targetPath = SiteRouter.performances(String(performanceId))
  window.open(targetPath, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div
    class="ai-chat-message"
    :class="isUser ? 'ai-chat-message--user' : 'ai-chat-message--assistant'"
  >
    <div
      v-if="isAssistant"
      class="ai-chat-message__avatar ai-chat-message__avatar--ai"
      aria-hidden="true"
    >
      <IconAi class="text-[14px] text-[var(--dark-mode-main-font-color)]" />
    </div>

    <div class="ai-chat-message__content">
      <div
        class="ai-chat-message__bubble"
        :class="isUser ? 'ai-chat-message__bubble--user' : 'ai-chat-message__bubble--assistant'"
      >
        <p class="ai-chat-message__text">{{ formattedContent }}</p>
      </div>

      <div
        v-if="message.recommendations?.length"
        class="ai-chat-message__recommendations"
      >
        <p class="ai-chat-message__rec-title">✨ 추천 공연</p>
        <div class="ai-chat-message__rec-grid">
          <div
            v-for="item in message.recommendations"
            :key="item.id"
            role="link"
            tabindex="0"
            class="block cursor-pointer rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hover-point-text)]"
            @click="openPerformanceInNewTab($event, item.id)"
            @keydown.enter.prevent="openPerformanceInNewTab($event, item.id)"
          >
            <EventCard
              v-bind="item"
              :is-hot="item.isHot ?? false"
              :is-favorite="favoriteIds?.has(item.id)"
              @toggle-favorite="emit('toggleFavorite', $event)"
            />
          </div>
        </div>
      </div>

      <div v-if="message.showSuggestions" class="ai-chat-message__suggestions">
        <p class="ai-chat-message__suggestions-label">이런 거 물어보세요</p>
        <div class="ai-chat-message__suggestions-list">
          <button
            v-for="suggestion in AI_CHAT_SUGGESTIONS"
            :key="suggestion"
            type="button"
            class="ai-chat-message__suggestion-chip"
            @click="emit('selectSuggestion', suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isUser"
      class="ai-chat-message__avatar ai-chat-message__avatar--user"
      aria-hidden="true"
    >
      나
    </div>
  </div>
</template>

<style scoped>
.ai-chat-message {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
}

.ai-chat-message--user {
  flex-direction: row-reverse;
}

.ai-chat-message__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  flex-shrink: 0;
  font-size: var(--font-size-caption);
  font-weight: 600;
}

.ai-chat-message__avatar--ai {
  background: var(--gradient-button);
  color: var(--dark-mode-main-font-color);
}

.ai-chat-message__avatar--user {
  background-color: var(--gray-tag-background-color);
  border: 1px solid var(--gray-tag-border-color);
  color: var(--dark-mode-main-font-color);
}

.ai-chat-message__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
  max-width: 80%;
}

.ai-chat-message--user .ai-chat-message__content {
  align-items: flex-end;
}

.ai-chat-message__bubble {
  padding: 1rem 1.125rem;
  border-radius: 1rem;
  line-height: 1.6;
}

.ai-chat-message__bubble--assistant {
  background-color: var(--card-background-color);
  border: 1px solid var(--input-border-color);
  border-top-left-radius: 0.375rem;
}

.ai-chat-message__bubble--user {
  background: var(--gradient-button);
  border-top-right-radius: 0.375rem;
}

.ai-chat-message__text {
  margin: 0;
  white-space: pre-wrap;
  font-size: 0.9375rem;
  color: var(--dark-mode-main-font-color);
}

.ai-chat-message__recommendations {
  width: 100%;
}

.ai-chat-message__rec-title {
  margin: 0 0 0.875rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--dark-mode-main-font-color);
}

.ai-chat-message__rec-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.875rem;
}

.ai-chat-message__suggestions {
  width: 100%;
}

.ai-chat-message__suggestions-label {
  margin: 0 0 0.75rem;
  font-size: var(--font-size-caption);
  color: var(--caption-text-color);
}

.ai-chat-message__suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ai-chat-message__suggestion-chip {
  padding: 0.5rem 0.875rem;
  border: 1px solid var(--input-border-color);
  border-radius: 9999px;
  background-color: var(--card-background-color);
  color: var(--dark-mode-content-font-color);
  font-size: var(--font-size-caption);
  line-height: 1.4;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease;
}

.ai-chat-message__suggestion-chip:hover {
  border-color: var(--blue-tag-border-color);
  color: var(--hover-point-text);
  background-color: var(--blue-tag-background-color);
}

@media (max-width: 1023px) {
  .ai-chat-message__rec-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 639px) {
  .ai-chat-message__rec-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
