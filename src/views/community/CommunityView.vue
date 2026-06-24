<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getCommunityPosts } from '@/api/community'
import CommonButton from '@/components/common/CommonButton.vue'
import CommunityFilter from '@/components/community/CommunityFilter.vue'
import CommunityPostCard from '@/components/community/CommunityPostCard.vue'
import CommunitySearch from '@/components/community/CommunitySearch.vue'
import PerformancePagination from '@/components/performances/PerformancePagination.vue'
import SkeletonBlock from '@/components/skeleton/SkeletonBlock.vue'
import { SiteRouter } from '@/constants/routes'
import type { CommunityPostListItem } from '@/types/community'
import { getAccessToken } from '@/utils/auth-cookie'

type CategoryValue = 'all' | 'review' | 'recommend' | 'info' | 'free'

const categories: ReadonlyArray<{ value: CategoryValue; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'review', label: '공연후기' },
  { value: 'recommend', label: '공연추천' },
  { value: 'info', label: '정보공유' },
  { value: 'free', label: '자유토론' },
]

const PAGE_SIZE = 5

const selectedCategory = ref<CategoryValue>('all')
const keyword = ref('')
const currentPage = ref(1)
const posts = ref<CommunityPostListItem[]>([])
const totalCount = ref(0)
const pageSize = ref(PAGE_SIZE)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
let currentAbortController: AbortController | null = null
const router = useRouter()
const isAuthToastVisible = ref(false)
const toastMessage = ref('로그인한 유저만 작성 가능합니다.')
let authToastTimer: ReturnType<typeof setTimeout> | null = null

const COMMUNITY_AUTH_TOAST_KEY = 'community-auth-required-toast'
const COMMUNITY_NOT_FOUND_TOAST_KEY = 'community-not-found-toast'
const COMMUNITY_DELETE_SUCCESS_TOAST_KEY = 'community-delete-success-toast'

onBeforeUnmount(() => {
  currentAbortController?.abort()
  if (authToastTimer) {
    clearTimeout(authToastTimer)
    authToastTimer = null
  }
})

onMounted(() => {
  if (window.sessionStorage.getItem(COMMUNITY_AUTH_TOAST_KEY) === '1') {
    window.sessionStorage.removeItem(COMMUNITY_AUTH_TOAST_KEY)
    showAuthToast('로그인한 유저만 작성 가능합니다.')
  }

  if (window.sessionStorage.getItem(COMMUNITY_NOT_FOUND_TOAST_KEY) === '1') {
    window.sessionStorage.removeItem(COMMUNITY_NOT_FOUND_TOAST_KEY)
    showAuthToast('게시글을 찾을 수 없습니다.')
  }

  if (window.sessionStorage.getItem(COMMUNITY_DELETE_SUCCESS_TOAST_KEY) === '1') {
    window.sessionStorage.removeItem(COMMUNITY_DELETE_SUCCESS_TOAST_KEY)
    showAuthToast('게시글이 삭제되었습니다.')
  }
})

const totalPages = computed(() =>
  pageSize.value > 0 ? Math.max(1, Math.ceil(totalCount.value / pageSize.value)) : 1,
)
const shouldShowInitialSkeleton = computed(
  () => isLoading.value && !errorMessage.value && posts.value.length === 0,
)

watch(
  [selectedCategory, keyword, currentPage],
  ([nextCategory, nextKeyword, nextPage], [prevCategory, prevKeyword]) => {
    const filterChanged = nextCategory !== prevCategory || nextKeyword !== prevKeyword

    if (filterChanged && nextPage !== 1) {
      currentPage.value = 1
      return
    }

    void loadPosts()
  },
  { immediate: true },
)

async function loadPosts() {
  currentAbortController?.abort()
  const abortController = new AbortController()
  currentAbortController = abortController

  isLoading.value = true
  errorMessage.value = null

  try {
    const response = await getCommunityPosts({
      category: selectedCategory.value === 'all' ? undefined : selectedCategory.value,
      keyword: keyword.value,
      page: currentPage.value,
      pageSize: PAGE_SIZE,
    }, { signal: abortController.signal })

    if (currentAbortController !== abortController) return

    const maxPage = response.totalCount > 0 ? Math.ceil(response.totalCount / response.pageSize) : 1

    if (currentPage.value > maxPage) {
      currentPage.value = maxPage
      return
    }

    posts.value = response.items
    totalCount.value = response.totalCount
    pageSize.value = response.pageSize
  } catch (error) {
    if (abortController.signal.aborted) return
    console.error('커뮤니티 게시글 목록 API 호출 실패:', error)
    posts.value = []
    totalCount.value = 0
    errorMessage.value = '게시글 목록을 불러오지 못했습니다.'
  } finally {
    if (currentAbortController === abortController) {
      isLoading.value = false
    }
  }
}

function onChangePage(page: number) {
  currentPage.value = page
}

function showAuthToast(message: string) {
  toastMessage.value = message
  isAuthToastVisible.value = true

  if (authToastTimer) {
    clearTimeout(authToastTimer)
  }

  authToastTimer = setTimeout(() => {
    isAuthToastVisible.value = false
    authToastTimer = null
  }, 2200)
}

function onClickCreatePost() {
  if (getAccessToken()) {
    void router.push(SiteRouter.communityCreate)
    return
  }

  showAuthToast('로그인한 유저만 작성 가능합니다.')
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
      v-if="isAuthToastVisible"
      class="fixed top-4 left-1/2 -translate-x-1/2 rounded-xl border border-[#51A2FF]/35 bg-[#0f1a31]/95 px-4 py-2 text-sm font-semibold text-[#cbe3ff] shadow-lg backdrop-blur"
      style="z-index: var(--z-toast)"
      role="status"
      aria-live="polite"
    >
      {{ toastMessage }}
    </div>
  </Transition>

  <section class="community-view w-full py-8 sm:py-14">
    <div class="mx-auto w-full max-w-[var(--max-width)] px-4 sm:px-6">
      <header class="mb-8">
        <h1 class="text-2xl font-bold text-[var(--dark-mode-main-font-color)] sm:text-3xl">
          자유게시판
        </h1>
        <p class="mt-2 text-base text-[var(--dark-mode-content-font-color)]">
          공연에 대한 다양한 이야기와 정보를 자유롭게 나누어보세요.
        </p>
      </header>

      <div class="mx-auto w-full">
        <div class="community-view__toolbar mb-4">
          <CommunityFilter
            :categories="categories"
            :selected-category="selectedCategory"
            @select="selectedCategory = $event"
          />

          <CommonButton variant="line" text="글쓰기" @click="onClickCreatePost">
            <template #icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </template>
          </CommonButton>
        </div>

        <CommunitySearch v-model="keyword" class="mb-6" />

        <div v-if="shouldShowInitialSkeleton" class="flex flex-col gap-4">
          <article
            v-for="index in PAGE_SIZE"
            :key="`community-skeleton-${index}`"
            class="rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--card-background-color)] p-5"
            aria-hidden="true"
          >
            <SkeletonBlock rounded="rounded-full" block-class="h-7 w-20" />
            <SkeletonBlock rounded="rounded-md" block-class="mt-4 h-7 w-3/4" />
            <SkeletonBlock rounded="rounded-md" block-class="mt-3 h-4 w-full" />
            <SkeletonBlock rounded="rounded-md" block-class="mt-2 h-4 w-11/12" />
            <div class="mt-5 flex items-center gap-2">
              <SkeletonBlock rounded="rounded-md" block-class="h-4 w-20" />
              <SkeletonBlock rounded="rounded-md" block-class="h-4 w-2" />
              <SkeletonBlock rounded="rounded-md" block-class="h-4 w-24" />
              <SkeletonBlock rounded="rounded-md" block-class="h-4 w-2" />
              <SkeletonBlock rounded="rounded-md" block-class="h-4 w-16" />
            </div>
          </article>
        </div>

        <div v-else-if="!errorMessage && posts.length > 0" class="flex flex-col gap-4">
          <CommunityPostCard v-for="post in posts" :key="post.id" :post="post" />
        </div>

        <div
          v-else-if="errorMessage || posts.length === 0"
          class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--card-background-color)] py-16"
          role="status"
          aria-live="polite"
        >
          <span class="text-4xl leading-none select-none" aria-hidden="true">📝</span>
          <p class="text-center text-base text-[var(--caption-text-color)]">
            <template v-if="isLoading">게시글을 불러오는 중입니다.</template>
            <template v-else-if="errorMessage">
              {{ errorMessage }}
              <br />
              잠시 후 다시 시도해 주세요.
            </template>
            <template v-else>
              검색된 게시글이 없습니다.
              <br />
              다른 검색어를 입력해보세요.
            </template>
          </p>
        </div>

        <PerformancePagination
          v-if="!errorMessage && !shouldShowInitialSkeleton && totalCount > 0"
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="onChangePage"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.community-view__toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem 1rem;
}

@media (max-width: 1200px) {
  .community-view {
    padding-left: 0;
    padding-right: 0;
  }
}

@media (max-width: 767px) {
  .community-view__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .community-view__toolbar :deep(.common-button) {
    align-self: flex-end;
    min-height: 2.75rem;
  }
}
</style>
