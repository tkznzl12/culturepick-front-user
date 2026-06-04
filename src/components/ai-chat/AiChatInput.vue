<script setup lang="ts">
defineProps<{
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: []
}>()

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function onSubmit() {
  emit('submit')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    onSubmit()
  }
}
</script>

<template>
  <div class="ai-chat-input">
    <form class="ai-chat-input__form" @submit.prevent="onSubmit">
      <div class="ai-chat-input__field">
        <input
          :value="modelValue"
          type="text"
          class="ai-chat-input__control"
          placeholder="원하는 공연 조건을 자유롭게 입력해보세요..."
          autocomplete="off"
          :disabled="disabled"
          @input="onInput"
          @keydown="onKeydown"
        />
        <button
          type="submit"
          class="ai-chat-input__send"
          aria-label="메시지 전송"
          :disabled="disabled || !modelValue.trim()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
            aria-hidden="true"
          >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </button>
      </div>
    </form>
    <p class="ai-chat-input__disclaimer">
      AI 추천은 참고용입니다. 실제 공연 정보는 각 예매처에서 확인하세요.
    </p>
  </div>
</template>

<style scoped>
.ai-chat-input {
  flex-shrink: 0;
  padding: 1rem 1.25rem 1.125rem;
  border-top: 1px solid var(--input-border-color);
  background-color: var(--card-background-color);
}

.ai-chat-input__form {
  width: 100%;
}

.ai-chat-input__field {
  position: relative;
  display: flex;
  align-items: center;
}

.ai-chat-input__control {
  width: 100%;
  padding: 0.9375rem 3.25rem 0.9375rem 1.125rem;
  border: 1px solid var(--input-border-color);
  border-radius: 9999px;
  background-color: var(--input-background-color);
  color: var(--dark-mode-main-font-color);
  font-size: 0.9375rem;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.ai-chat-input__control::placeholder {
  color: var(--caption-text-color);
}

.ai-chat-input__control:focus {
  border-color: var(--blue-tag-border-color);
  box-shadow: 0 0 0 3px var(--filter-toggle-active-background-color);
}

.ai-chat-input__control:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-chat-input__send {
  position: absolute;
  right: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 9999px;
  background: var(--gradient-button);
  color: var(--dark-mode-main-font-color);
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.ai-chat-input__send:hover:not(:disabled) {
  opacity: 0.92;
}

.ai-chat-input__send:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.ai-chat-input__disclaimer {
  margin: 0.625rem 0 0;
  text-align: center;
  font-size: var(--font-size-caption);
  color: var(--caption-text-color);
}

@media (max-width: 639px) {
  .ai-chat-input {
    padding: 0.875rem 1rem 1rem;
  }

  .ai-chat-input__control {
    font-size: var(--font-size-body);
    padding-right: 3rem;
  }
}
</style>
