<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import AppPagination from '@/components/common/AppPagination.vue'
import EventCard from '@/components/card/EventCard.vue'
import HeroFloatingButtons from '@/components/layout/HeroFloatingButtons.vue'
import { useSearchResults } from '@/composables/useSearchResults'
import { SiteRouter } from '@/constants/routes'
import searchIcon from '@/assets/icons/search-icon.svg'

const {
  keyword,
  pageNum,
  totalPages,
  showPagination,
  results,
  totalCount,
  isLoading,
  errorMessage,
  submitSearch,
  goToPage,
  toggleFavorite,
  isFavorite,
} = useSearchResults()

const searchInput = ref('')

watch(
  keyword,
  (value) => {
    searchInput.value = value
  },
  { immediate: true },
)

function onSearchSubmit() {
  submitSearch(searchInput.value)
}

function onAiRecommend() {
  // TODO: AI 추천 페이지 이동
}

function onProfile() {
  // TODO: 마이페이지 이동
}

function onSupport() {
  // TODO: 고객지원 이동
}
</script>

<template>
  <section class="search-results relative w-full py-10 sm:py-14">
    <div class="mx-auto w-full max-w-[var(--max-width)] px-6">
      <form
        class="search-results__form mb-8 w-full max-w-3xl"
        role="search"
        @submit.prevent="onSearchSubmit"
      >
        <div
          class="flex flex-col gap-3 rounded-2xl border border-[var(--line-component-border-color)] bg-[#16161a] p-2 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:p-2 sm:pl-6"
        >
          <div class="flex min-w-0 flex-1 items-center gap-3 px-2 sm:px-0">
            <img :src="searchIcon" alt="" width="18" height="18" class="block shrink-0 opacity-70" />
            <input
              v-model="searchInput"
              type="search"
              name="keyword"
              placeholder="공연 제목, 아티스트, 장소를 검색해보세요"
              class="min-w-0 flex-1 border-none bg-transparent py-2 text-left text-sm text-[var(--dark-mode-main-font-color)] placeholder:text-[var(--line-component-font-color)] sm:text-base"
            />
          </div>
          <button
            type="submit"
            class="search-results__submit shrink-0 rounded-full px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:py-2.5"
          >
            검색
          </button>
        </div>
      </form>

      <template v-if="keyword">
        <p class="mb-8 text-left text-base text-[var(--dark-mode-main-font-color)] sm:text-lg">
          <span class="font-semibold text-[var(--hover-point-text)]">"{{ keyword }}"</span>
          검색 결과
          <span class="text-[var(--caption-text-color)]">({{ totalCount }}개)</span>
        </p>

        <p
          v-if="isLoading && results.length === 0"
          class="py-16 text-left text-[var(--dark-mode-content-font-color)]"
        >
          검색 중...
        </p>

        <p
          v-else-if="errorMessage && results.length === 0"
          class="py-16 text-left text-[var(--red-tag-font-color)]"
          role="alert"
        >
          {{ errorMessage }}
        </p>

        <template v-else-if="results.length > 0">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <RouterLink
              v-for="item in results"
              :key="item.id"
              :to="SiteRouter.performances(String(item.id))"
              class="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hover-point-text)]"
            >
              <EventCard
                v-bind="item"
                :is-hot="item.isHot ?? false"
                :is-favorite="isFavorite(item.id)"
                @toggle-favorite="toggleFavorite"
              />
            </RouterLink>
          </div>

          <AppPagination
            v-if="showPagination"
            :current-page="pageNum"
            :total-pages="totalPages"
            @change="goToPage"
          />
        </template>

        <div
          v-else-if="!isLoading"
          class="flex flex-col items-center justify-center gap-3 py-20"
          role="status"
          aria-live="polite"
        >
          <span class="text-4xl leading-none select-none" aria-hidden="true">🎭</span>
          <p class="text-center text-base text-[var(--caption-text-color)]">
            조건에 맞는 공연이 없습니다.
          </p>
        </div>
      </template>

      <p v-else class="py-16 text-left text-[var(--dark-mode-content-font-color)]">
        검색어를 입력해 공연을 찾아보세요.
      </p>
    </div>

    <HeroFloatingButtons
      @ai-recommend="onAiRecommend"
      @profile="onProfile"
      @support="onSupport"
    />
  </section>
</template>

<style scoped>
.search-results__submit {
  background: var(--gradient-button);
}
</style>
