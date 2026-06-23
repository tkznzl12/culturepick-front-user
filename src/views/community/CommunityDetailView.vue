<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CommonButton from '@/components/common/CommonButton.vue'
import CommunityCommentForm from '@/components/community/CommunityCommentForm.vue'
import CommunityCommentList from '@/components/community/CommunityCommentList.vue'
import CommunityDetailCard from '@/components/community/CommunityDetailCard.vue'
import { SiteRouter } from '@/constants/routes'
import {
  communityCommentsMock,
  communityDetailPostMock,
  currentUserId,
  currentUserName,
  type Comment,
} from '@/mocks/community-detail.mock'
import { useRoute } from 'vue-router'

const route = useRoute()

const comments = ref<Comment[]>([])

const post = computed(() => {
  const postId = Number(route.params.id)
  if (!Number.isFinite(postId)) return null
  if (postId !== communityDetailPostMock.id) return null

  return {
    ...communityDetailPostMock,
    commentCount: comments.value.length,
  }
})

watch(
  () => route.params.id,
  () => {
    comments.value = [...communityCommentsMock]
  },
  { immediate: true },
)

function onDeletePost() {
  console.log('게시글 삭제')
}

function onDeleteComment(commentId: number) {
  console.log('댓글 삭제')
  comments.value = comments.value.filter((comment) => comment.id !== commentId)
}

function onSubmitComment(content: string) {
  const trimmed = content.trim()
  if (!trimmed) return

  const nextId =
    comments.value.length > 0
      ? Math.max(...comments.value.map((comment) => comment.id)) + 1
      : 1

  comments.value = [
    ...comments.value,
    {
      id: nextId,
      content: trimmed,
      author: currentUserName,
      createdAt: new Date().toISOString().slice(0, 10),
      userId: currentUserId,
    },
  ]
}
</script>

<template>
  <section class="community-detail-view w-full py-8 sm:py-14">
    <div class="mx-auto w-full max-w-[var(--max-width)] px-4 sm:px-6">
      <div class="mx-auto w-full max-w-[960px]">
        <template v-if="post">
          <CommunityDetailCard
            :post="post"
            :current-user-id="currentUserId"
            @delete-post="onDeletePost"
          />

          <section class="mt-8">
            <h2 class="mb-4 text-xl font-bold text-[var(--dark-mode-main-font-color)]">
              댓글 {{ comments.length }}
            </h2>

            <CommunityCommentList
              v-if="comments.length > 0"
              :comments="comments"
              :current-user-id="currentUserId"
              @delete-comment="onDeleteComment"
            />
            <p
              v-else
              class="rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] p-6 text-sm text-[var(--caption-text-color)]"
            >
              아직 댓글이 없습니다. 첫 댓글을 남겨보세요.
            </p>
          </section>

          <section class="mt-4">
            <CommunityCommentForm @submit="onSubmitComment" />
          </section>
        </template>

        <div
          v-else
          class="rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--card-background-color)] p-8 text-center text-[var(--caption-text-color)]"
        >
          게시글을 찾을 수 없습니다.
        </div>

        <div class="mt-8 flex justify-center">
          <CommonButton variant="line" text="목록으로 돌아가기" :href="SiteRouter.community" />
        </div>
      </div>
    </div>
  </section>
</template>
