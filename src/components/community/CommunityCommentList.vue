<script setup lang="ts">
import CommunityCommentItem from '@/components/community/CommunityCommentItem.vue'
import type { Comment } from '@/mocks/community-detail.mock'

defineProps<{
  comments: Comment[]
  currentUserId: number
}>()

const emit = defineEmits<{
  deleteComment: [commentId: number]
}>()
</script>

<template>
  <ul class="flex flex-col gap-3">
    <CommunityCommentItem
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      :current-user-id="currentUserId"
      @delete-comment="emit('deleteComment', $event)"
    />
  </ul>
</template>
