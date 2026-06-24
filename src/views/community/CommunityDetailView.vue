<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CommunityApiError, getCommunityPostDetail } from '@/api/community'
import {
  CommunityServiceError,
  createComment,
  deleteComment,
  deletePost,
  getComments,
} from '@/api/community.service'
import CommonButton from '@/components/common/CommonButton.vue'
import CommunityCommentForm from '@/components/community/CommunityCommentForm.vue'
import CommunityCommentList from '@/components/community/CommunityCommentList.vue'
import CommunityDetailCard from '@/components/community/CommunityDetailCard.vue'
import { SiteRouter } from '@/constants/routes'
import { useAuthStore } from '@/stores/auth'
import type { CommunityCommentItem, CommunityPostDetailItem } from '@/types/community'
import { createLoginLocationWithRedirect } from '@/utils/auth-redirect'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const comments = ref<CommunityCommentItem[]>([])
const post = ref<CommunityPostDetailItem | null>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const isCommentsLoading = ref(false)
const isCommentSubmitting = ref(false)
const commentsErrorMessage = ref<string | null>(null)
const commentResetSignal = ref(0)
const isDeleting = ref(false)
const isDeleteModalOpen = ref(false)
const isNotFound = ref(false)
const toastMessage = ref('')
const isToastVisible = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | null = null
const currentUserId = computed(() => authStore.user.id ?? 0)
const postId = computed(() => {
  const parsed = Number(route.params.id)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
})
const COMMUNITY_EDIT_FORBIDDEN_TOAST_KEY = 'community-edit-forbidden-toast'
const COMMUNITY_DELETE_SUCCESS_TOAST_KEY = 'community-delete-success-toast'

onMounted(() => {
  authStore.syncUserFromToken()
  authStore.bindAuthChangeListener()

  const forbiddenToast = window.sessionStorage.getItem(COMMUNITY_EDIT_FORBIDDEN_TOAST_KEY)
  if (forbiddenToast === '1') {
    window.sessionStorage.removeItem(COMMUNITY_EDIT_FORBIDDEN_TOAST_KEY)
    showToast('수정 권한이 없습니다.')
  }
})

onBeforeUnmount(() => {
  authStore.unbindAuthChangeListener()

  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }
})

watch(
  () => route.params.id,
  () => {
    isDeleteModalOpen.value = false
    comments.value = []
    commentsErrorMessage.value = null
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
    const detail = await getCommunityPostDetail(postId.value)
    post.value = detail
    await loadComments(detail.id)
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

async function loadComments(targetPostId: number) {
  isCommentsLoading.value = true
  commentsErrorMessage.value = null

  try {
    comments.value = await getComments(targetPostId)
  } catch (error) {
    comments.value = []
    if (error instanceof CommunityServiceError && error.status === 404) {
      commentsErrorMessage.value = '댓글을 불러올 수 없습니다.'
      return
    }
    commentsErrorMessage.value = '댓글을 불러올 수 없습니다.'
  } finally {
    isCommentsLoading.value = false
  }
}

function onDeletePost() {
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  if (isDeleting.value) return
  isDeleteModalOpen.value = false
}

async function confirmDeletePost() {
  if (!post.value || isDeleting.value) return

  isDeleting.value = true

  try {
    await deletePost(post.value.id)
    window.sessionStorage.setItem(COMMUNITY_DELETE_SUCCESS_TOAST_KEY, '1')
    await router.push(SiteRouter.community)
  } catch (error) {
    if (error instanceof CommunityServiceError) {
      if (error.status === 404) {
        showToast('이미 삭제되었거나 존재하지 않는 게시글입니다.')
        isDeleteModalOpen.value = false
        await router.push(SiteRouter.community)
        return
      }

      showToast(error.message)
      return
    }

    console.error('커뮤니티 게시글 삭제 API 호출 실패:', error)
    showToast('게시글 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.')
  } finally {
    isDeleting.value = false
  }
}

function onDeleteComment(commentId: number) {
  void handleDeleteComment(commentId)
}

async function handleDeleteComment(commentId: number) {
  if (!window.confirm('댓글을 삭제하시겠습니까?')) {
    return
  }

  try {
    await deleteComment(commentId)
    comments.value = comments.value.filter((comment) => comment.id !== commentId)
    if (post.value) {
      post.value = {
        ...post.value,
        commentCount: Math.max(0, post.value.commentCount - 1),
      }
    }
  } catch (error) {
    if (error instanceof CommunityServiceError) {
      showToast(error.message)
      return
    }

    console.error('커뮤니티 댓글 삭제 API 호출 실패:', error)
    showToast('댓글 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.')
  }
}

async function onSubmitComment(content: string) {
  const targetPostId = post.value?.id ?? postId.value
  if (!targetPostId) return
  if (!authStore.isAuthenticated) {
    await router.replace(createLoginLocationWithRedirect(route.fullPath))
    return
  }
  if (isCommentSubmitting.value) return

  const trimmed = content.trim()
  if (!trimmed) return

  isCommentSubmitting.value = true

  try {
    const createdComment = await createComment(targetPostId, {
      content: trimmed,
    })

    comments.value = [...comments.value, createdComment]
    if (post.value) {
      post.value = {
        ...post.value,
        commentCount: post.value.commentCount + 1,
      }
    }
    commentResetSignal.value += 1
  } catch (error) {
    if (error instanceof CommunityServiceError) {
      showToast(error.message)
      return
    }

    console.error('커뮤니티 댓글 등록 API 호출 실패:', error)
    showToast('댓글 작성에 실패했습니다. 잠시 후 다시 시도해 주세요.')
  } finally {
    isCommentSubmitting.value = false
  }
}

function onRequireCommentAuth() {
  if (authStore.isAuthenticated) return
  void router.replace(createLoginLocationWithRedirect(route.fullPath))
}

function showToast(message: string) {
  toastMessage.value = message
  isToastVisible.value = true

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  toastTimer = setTimeout(() => {
    isToastVisible.value = false
    toastTimer = null
  }, 2200)
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="-translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-2 opacity-0"
  >
    <div
      v-if="isToastVisible"
      class="fixed top-24 left-1/2 -translate-x-1/2 rounded-xl border border-[#51A2FF]/35 bg-[#0f1a31]/95 px-4 py-2 text-sm font-semibold text-[#cbe3ff] shadow-lg backdrop-blur md:top-20"
      style="z-index: var(--z-toast)"
      role="status"
      aria-live="polite"
    >
      {{ toastMessage }}
    </div>
  </Transition>

  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isDeleteModalOpen"
      class="community-detail-modal fixed inset-0 flex items-center justify-center bg-black/60 p-4"
      style="z-index: var(--z-modal)"
      role="dialog"
      aria-modal="true"
      aria-labelledby="community-delete-modal-title"
      aria-describedby="community-delete-modal-description"
      @click.self="closeDeleteModal"
    >
      <div class="w-full max-w-md rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--card-background-color)] p-6">
        <h2
          id="community-delete-modal-title"
          class="text-lg font-bold text-[var(--dark-mode-main-font-color)]"
        >
          게시글 삭제
        </h2>
        <p
          id="community-delete-modal-description"
          class="mt-3 whitespace-pre-line text-sm text-[var(--dark-mode-content-font-color)]"
        >
          삭제된 게시글은 복구할 수 없습니다.
          정말 삭제하시겠습니까?
        </p>
        <div class="mt-6 flex justify-end gap-2">
          <CommonButton
            variant="line"
            text="취소"
            :disabled="isDeleting"
            @click="closeDeleteModal"
          />
          <CommonButton
            variant="gradient"
            :text="isDeleting ? '삭제 중...' : '삭제'"
            :disabled="isDeleting"
            @click="confirmDeletePost"
          />
        </div>
      </div>
    </div>
  </Transition>

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
              댓글 {{ post.commentCount }}
            </h2>

            <p
              v-if="isCommentsLoading"
              class="rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] p-6 text-sm text-[var(--caption-text-color)]"
              role="status"
              aria-live="polite"
            >
              댓글을 불러오는 중입니다.
            </p>

            <p
              v-else-if="commentsErrorMessage"
              class="rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] p-6 text-sm text-[var(--red-tag-font-color)]"
              role="alert"
            >
              {{ commentsErrorMessage }}
            </p>

            <CommunityCommentList
              v-else-if="comments.length > 0"
              :comments="comments"
              :current-user-id="currentUserId"
              @delete-comment="onDeleteComment"
            />
            <p
              v-else
              class="rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] p-6 text-sm text-[var(--caption-text-color)]"
            >
              댓글이 없습니다.
              <br />
              첫 번째 댓글을 작성해보세요.
            </p>
          </section>

          <section class="mt-4" @click="onRequireCommentAuth">
            <CommunityCommentForm
              :disabled="!authStore.isAuthenticated"
              :disabled-message="
                !authStore.isAuthenticated ? '로그인 후 댓글 작성이 가능합니다.' : ''
              "
              :is-submitting="isCommentSubmitting"
              :reset-signal="commentResetSignal"
              @submit="onSubmitComment"
            />
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
