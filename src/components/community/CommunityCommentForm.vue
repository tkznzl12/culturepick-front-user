<script setup lang="ts">
import { ref } from 'vue'
import CommonButton from '@/components/common/CommonButton.vue'

const emit = defineEmits<{
  submit: [content: string]
}>()

const content = ref('')

function onSubmit() {
  const trimmed = content.value.trim()
  if (!trimmed) return

  emit('submit', trimmed)
  content.value = ''
}
</script>

<template>
  <form
    class="community-comment-form flex items-start gap-3"
    @submit.prevent="onSubmit"
  >
    <textarea
      v-model="content"
      placeholder="댓글을 작성해주세요."
      class="community-comment-form__input min-h-[96px] flex-1 rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] px-4 py-3 text-sm text-[var(--dark-mode-main-font-color)] placeholder:text-[var(--line-component-font-color)]"
    />
    <CommonButton variant="gradient" type="submit" text="등록" />
  </form>
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
