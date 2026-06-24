<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AiChatHeader from '@/components/ai-chat/AiChatHeader.vue'
import AiChatInput from '@/components/ai-chat/AiChatInput.vue'
import AiChatMessageBubble from '@/components/ai-chat/AiChatMessageBubble.vue'
import HeroFloatingButtons from '@/components/layout/HeroFloatingButtons.vue'
import { useAiChat } from '@/composables/useAiChat'
import { SiteRouter } from '@/constants/routes'
import { getAccessToken } from '@/utils/auth-cookie'
import { createLoginLocationWithRedirect } from '@/utils/auth-redirect'

const router = useRouter()
const route = useRoute()
const messagesContainer = ref<HTMLElement | null>(null)
const favoriteIds = ref<Set<string | number>>(new Set())

const { messages, inputText, isResponding, sendMessage, resetChat, scrollToBottom } =
  useAiChat()

watch(
  messages,
  () => {
    scrollToBottom(messagesContainer.value)
  },
  { deep: true },
)

watch(isResponding, () => {
  scrollToBottom(messagesContainer.value)
})

function handleSend() {
  if (!getAccessToken()) {
    void router.replace(createLoginLocationWithRedirect(route.fullPath))
    return
  }
  sendMessage(inputText.value)
}

function handleSuggestion(text: string) {
  if (!getAccessToken()) {
    void router.replace(createLoginLocationWithRedirect(route.fullPath))
    return
  }
  sendMessage(text)
}

function handleReset() {
  resetChat()
  favoriteIds.value = new Set()
}

function toggleFavorite(id: string | number) {
  const next = new Set(favoriteIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  favoriteIds.value = next
}

function onAiRecommend() {
  router.push(SiteRouter.aiChat)
}

function onProfile() {
  // TODO: 마이페이지 이동
}

function onSupport() {
  // TODO: 고객지원 이동
}
</script>

<template>
  <section class="ai-chat-page relative w-full py-8 sm:py-14">
    <div class="mx-auto w-full max-w-[var(--max-width)] px-4 sm:px-6">
      <AiChatHeader @reset="handleReset" />

      <div class="ai-chat-panel">
        <div ref="messagesContainer" class="ai-chat-panel__messages">
          <div class="ai-chat-panel__messages-inner">
            <AiChatMessageBubble
              v-for="message in messages"
              :key="message.id"
              :message="message"
              :favorite-ids="favoriteIds"
              @select-suggestion="handleSuggestion"
              @toggle-favorite="toggleFavorite"
            />

            <div v-if="isResponding" class="ai-chat-typing" aria-live="polite">
              <div class="ai-chat-typing__avatar" aria-hidden="true">
                <span class="ai-chat-typing__dot" />
              </div>
              <div class="ai-chat-typing__bubble">
                <span class="ai-chat-typing__dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span class="ai-chat-typing__label">AI가 공연을 찾고 있습니다...</span>
              </div>
            </div>
          </div>
        </div>

        <AiChatInput
          v-model="inputText"
          :disabled="isResponding"
          @submit="handleSend"
        />
      </div>
    </div>

    <HeroFloatingButtons
      v-if="false"
      @ai-recommend="onAiRecommend"
      @profile="onProfile"
      @support="onSupport"
    />
  </section>
</template>

<style scoped>
.ai-chat-page {
  min-height: calc(100dvh - 4rem);
}

.ai-chat-panel {
  display: flex;
  flex-direction: column;
  height: 72dvh;
  min-height: 28rem;
  overflow: hidden;
  border: 1px solid var(--input-border-color);
  border-radius: 1.25rem;
  background-color: var(--dark-mode-background-color);
}

.ai-chat-panel__messages {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  background-color: var(--dark-mode-background-color);
}

.ai-chat-panel__messages::-webkit-scrollbar-track {
  margin: 0.75rem 0;
}

.ai-chat-panel__messages-inner {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.25rem 1.25rem 1.5rem;
}

.ai-chat-typing {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.ai-chat-typing__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: var(--gradient-button);
}

.ai-chat-typing__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: var(--dark-mode-main-font-color);
  opacity: 0.85;
}

.ai-chat-typing__bubble {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border: 1px solid var(--input-border-color);
  border-radius: 1rem;
  border-top-left-radius: 0.375rem;
  background-color: var(--card-background-color);
}

.ai-chat-typing__dots {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.ai-chat-typing__dots span {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background-color: var(--caption-text-color);
  animation: ai-chat-typing 1.2s infinite ease-in-out;
}

.ai-chat-typing__dots span:nth-child(2) {
  animation-delay: 0.15s;
}

.ai-chat-typing__dots span:nth-child(3) {
  animation-delay: 0.3s;
}

.ai-chat-typing__label {
  font-size: var(--font-size-caption);
  color: var(--caption-text-color);
}

@keyframes ai-chat-typing {
  0%,
  80%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }

  40% {
    opacity: 1;
    transform: translateY(-2px);
  }
}

@media (max-width: 639px) {
  .ai-chat-panel {
    height: min(68dvh, 40rem);
    min-height: 24rem;
    border-radius: 1rem;
  }

  .ai-chat-panel__messages-inner {
    padding: 1rem;
    gap: 1.25rem;
  }
}
</style>
