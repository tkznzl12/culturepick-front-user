<script setup lang="ts">
import { ref, watch } from 'vue'
import CommonButton from '@/components/common/CommonButton.vue'

const emit = defineEmits<{
  submit: [content: string]
}>()

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    disabledMessage?: string
    isSubmitting?: boolean
    resetSignal?: number
  }>(),
  {
    disabled: false,
    disabledMessage: '',
    isSubmitting: false,
    resetSignal: 0,
  },
)

const content = ref('')

watch(
  () => props.resetSignal,
  () => {
    content.value = ''
  },
)

function onSubmit() {
  if (props.disabled || props.isSubmitting) return

  const trimmed = content.value.trim()
  if (!trimmed) return

  emit('submit', trimmed)
}
</script>

<template>
  <form
    class="community-comment-form flex items-center gap-3"
    @submit.prevent="onSubmit"
  >
    <textarea
      v-model="content"
      placeholder="댓글을 작성해주세요."
      :disabled="disabled || isSubmitting"
      class="community-comment-form__input min-h-[96px] flex-1 rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] px-4 py-3 text-sm text-[var(--dark-mode-main-font-color)] placeholder:text-[var(--line-component-font-color)]"
    />
    <CommonButton
      variant="gradient"
      type="submit"
      :text="isSubmitting ? '등록 중...' : '등록'"
      :disabled="disabled || isSubmitting"
    />
  </form>
  <p
    v-if="disabledMessage"
    class="mt-2 text-sm text-[var(--caption-text-color)]"
  >
    {{ disabledMessage }}
  </p>
</template>

<style scoped>
.community-comment-form__input {
  resize: vertical;
}

@media (max-width: 767px) {
  .community-comment-form {
    flex-direction: column;
  }

  .community-comment-form :deep(.common-button) {
    width: 100%;
    min-height: 2.75rem;
  }
}
</style>
