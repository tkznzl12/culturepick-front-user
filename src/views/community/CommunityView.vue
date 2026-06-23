<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CommonButton from '@/components/common/CommonButton.vue'
import CommunityFilter from '@/components/community/CommunityFilter.vue'
import CommunityPostCard from '@/components/community/CommunityPostCard.vue'
import CommunitySearch from '@/components/community/CommunitySearch.vue'
import PerformancePagination from '@/components/performances/PerformancePagination.vue'
import { SiteRouter } from '@/constants/routes'
import { communityPosts, type CommunityCategory } from '@/mocks/community.mock'

type CategoryValue = 'all' | CommunityCategory

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

const filteredPosts = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLowerCase()

  return communityPosts.filter((post) => {
    const matchesCategory =
      selectedCategory.value === 'all' || post.category === selectedCategory.value
    const matchesKeyword =
      !normalizedKeyword ||
      post.title.toLowerCase().includes(normalizedKeyword) ||
      post.content.toLowerCase().includes(normalizedKeyword)

    return matchesCategory && matchesKeyword
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / PAGE_SIZE)))

const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredPosts.value.slice(start, start + PAGE_SIZE)
})

watch([selectedCategory, keyword], () => {
  currentPage.value = 1
})

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value
  }
})

function onChangePage(page: number) {
  currentPage.value = page
}
</script>

<template>
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

          <CommonButton variant="line" text="글쓰기" :href="SiteRouter.communityCreate">
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

        <div v-if="pagedPosts.length > 0" class="flex flex-col gap-4">
          <CommunityPostCard v-for="post in pagedPosts" :key="post.id" :post="post" />
        </div>

        <div
          v-else
          class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--card-background-color)] py-16"
          role="status"
          aria-live="polite"
        >
          <span class="text-4xl leading-none select-none" aria-hidden="true">📝</span>
          <p class="text-center text-base text-[var(--caption-text-color)]">
            검색된 게시글이 없습니다.
            <br />
            다른 검색어를 입력해보세요.
          </p>
        </div>

        <PerformancePagination
          v-if="filteredPosts.length > 0 && totalPages > 1"
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
