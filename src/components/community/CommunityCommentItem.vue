<script setup lang="ts">
import { computed } from 'vue'
import type { CommunityCommentItem as CommunityCommentItemType } from '@/types/community'

const props = defineProps<{
  comment: CommunityCommentItemType
  currentUserId: number
}>()

const emit = defineEmits<{
  deleteComment: [commentId: number]
}>()

const isMyComment = computed(() => props.comment.authorId === props.currentUserId)
const avatarText = computed(() => props.comment.authorDisplayName.trim().charAt(0) || '?')
</script>

<template>
  <li
    class="rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] p-4"
  >
    <div class="mb-2 flex items-start justify-between gap-3">
      <div class="flex min-w-0 items-center gap-2.5">
        <span class="community-comment-item__avatar" aria-hidden="true">{{ avatarText }}</span>
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <p class="truncate text-sm font-medium text-[var(--dark-mode-main-font-color)]">
              {{ comment.authorDisplayName }}
            </p>
            <button
              v-if="isMyComment"
              type="button"
              class="community-comment-item__delete"
              aria-label="댓글 삭제"
              @click="emit('deleteComment', comment.id)"
            >
              X
            </button>
          </div>
          <div class="mt-1 flex items-center gap-3 text-xs text-[var(--caption-text-color)]">
            <time :datetime="comment.createdAt">{{ comment.createdAt }}</time>
          </div>
        </div>
      </div>
    </div>

    <p class="whitespace-pre-wrap text-sm leading-6 text-[var(--dark-mode-content-font-color)]">
      {{ comment.content }}
    </p>
  </li>
</template>

<style scoped>
.community-comment-item__avatar {
  display: inline-flex;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid var(--line-component-border-color);
  background-color: var(--card-background-color);
  color: var(--dark-mode-main-font-color);
  font-size: 0.8125rem;
  font-weight: var(--font-weight-semibold);
}

.community-comment-item__delete {
  border: none;
  background: transparent;
  color: var(--caption-text-color);
  font-size: 0.75rem;
  line-height: 1;
  transition: color 0.2s ease;
}

.community-comment-item__delete:hover {
  color: var(--hover-point-text);
}
</style>
