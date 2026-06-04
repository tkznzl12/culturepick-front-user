import { nextTick, onUnmounted, ref } from 'vue'
import {
  AI_CHAT_WELCOME_MESSAGE,
  MOCK_AI_RECOMMENDATIONS,
  MOCK_AI_RESPONSE_TEXT,
} from '@/mocks/aiChat'
import type { ChatMessage } from '@/types/aiChat'

const RESPONSE_DELAY_MS = 1000

function createMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createInitialMessages(): ChatMessage[] {
  return [{ ...AI_CHAT_WELCOME_MESSAGE }]
}

export function useAiChat() {
  const messages = ref<ChatMessage[]>(createInitialMessages())
  const inputText = ref('')
  const isResponding = ref(false)

  let responseTimer: ReturnType<typeof setTimeout> | null = null

  function clearResponseTimer() {
    if (responseTimer) {
      clearTimeout(responseTimer)
      responseTimer = null
    }
  }

  function resetChat() {
    clearResponseTimer()
    isResponding.value = false
    inputText.value = ''
    messages.value = createInitialMessages()
  }

  function sendMessage(rawText: string) {
    const text = rawText.trim()
    if (!text || isResponding.value) return

    messages.value = messages.value.map((message) =>
      message.showSuggestions ? { ...message, showSuggestions: false } : message,
    )

    messages.value.push({
      id: createMessageId(),
      role: 'user',
      content: text,
    })

    inputText.value = ''
    isResponding.value = true

    responseTimer = setTimeout(() => {
      messages.value.push({
        id: createMessageId(),
        role: 'assistant',
        content: MOCK_AI_RESPONSE_TEXT,
        recommendations: MOCK_AI_RECOMMENDATIONS.map((item) => ({ ...item })),
      })
      isResponding.value = false
      responseTimer = null
    }, RESPONSE_DELAY_MS)
  }

  async function scrollToBottom(container: HTMLElement | null) {
    if (!container) return
    await nextTick()
    container.scrollTop = container.scrollHeight
  }

  onUnmounted(() => {
    clearResponseTimer()
  })

  return {
    messages,
    inputText,
    isResponding,
    sendMessage,
    resetChat,
    scrollToBottom,
  }
}
