<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { CommunityApiError, getCommunityPostDetail } from '@/api/community'
import CommonButton from '@/components/common/CommonButton.vue'
import CommunityCommentForm from '@/components/community/CommunityCommentForm.vue'
import CommunityCommentList from '@/components/community/CommunityCommentList.vue'
import CommunityDetailCard from '@/components/community/CommunityDetailCard.vue'
import { SiteRouter } from '@/constants/routes'
import {
  communityCommentsMock,
  currentUserId,
  currentUserName,
  type Comment,
} from '@/mocks/community-detail.mock'
import type { CommunityPostDetailItem } from '@/types/community'

const route = useRoute()

const comments = ref<Comment[]>([])
const post = ref<CommunityPostDetailItem | null>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const isNotFound = ref(false)
const postId = computed(() => {
  const parsed = Number(route.params.id)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
})

watch(
  () => route.params.id,
  () => {
    comments.value = [...communityCommentsMock]
    void loadPostDetail()
  },
  { immediate: true },
)

async function loadPostDetail() {
  if (!postId.value) {
    post.value = null
    errorMessage.value = null
    isNotFound.value = true
    isLoading.value = false
    return
  }

  isLoading.value = true
  errorMessage.value = null
  isNotFound.value = false

  try {
    post.value = await getCommunityPostDetail(postId.value)
  } catch (error) {
    post.value = null
    if (error instanceof CommunityApiError && error.status === 404) {
      isNotFound.value = true
      return
    }

    console.error('커뮤니티 게시글 상세 API 호출 실패:', error)
    errorMessage.value = '게시글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isLoading.value = false
  }
}

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
      <div class="mx-auto w-full">
        <template v-if="isLoading">
          <div
            class="rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--card-background-color)] p-8 text-center text-[var(--caption-text-color)]"
            role="status"
            aria-live="polite"
          >
            게시글을 불러오는 중입니다.
          </div>
        </template>

        <template v-else-if="post">
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
          v-else-if="isNotFound"
          class="rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--card-background-color)] p-8 text-center text-[var(--caption-text-color)]"
        >
          게시글을 찾을 수 없습니다.
        </div>

        <div
          v-else
          class="rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--card-background-color)] p-8 text-center text-[var(--caption-text-color)]"
        >
          {{ errorMessage ?? '게시글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.' }}
        </div>

        <div class="mt-8 flex justify-center">
          <CommonButton
            variant="line"
            :text="isNotFound ? '커뮤니티 목록으로 이동' : '목록으로 돌아가기'"
            :href="SiteRouter.community"
          />
        </div>
      </div>
    </div>
  </section>
</template>
