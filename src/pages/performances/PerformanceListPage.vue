<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import EventCard from '@/components/card/EventCard.vue'
import HeroFloatingButtons from '@/components/layout/HeroFloatingButtons.vue'
import PerformanceEmpty from '@/components/performances/PerformanceEmpty.vue'
import PerformanceFilters from '@/components/performances/PerformanceFilters.vue'
import PerformanceListToolbar from '@/components/performances/PerformanceListToolbar.vue'
import PerformancePagination from '@/components/performances/PerformancePagination.vue'
import PerformanceSearchBar from '@/components/performances/PerformanceSearchBar.vue'
import CountSkeleton from '@/components/skeleton/CountSkeleton.vue'
import EventCardGridSkeleton from '@/components/skeleton/EventCardGridSkeleton.vue'
import { PERFORMANCE_PAGE_SIZE } from '@/constants/search'
import { usePerformances } from '@/composables/usePerformances'
import { SiteRouter } from '@/constants/routes'
import { navigateUnlessFavoriteClick } from '@/utils/event-card-navigation'

const router = useRouter()
const {
  listQuery,
  performances,
  totalCount,
  totalPages,
  isLoading,
  errorMessage,
  showPagination,
  viewMode,
  activeGenreHeader,
  genreList,
  localList,
  performanceStatusList,
  setGenre,
  setRegion,
  setStatus,
  setSort,
  submitKeyword,
  goToPage,
  toggleFavorite,
  isFavorite,
} = usePerformances()

const sortValue = computed({
  get: () => listQuery.value.sort ?? 'latest',
  set: (value: string) => setSort(value),
})

const gridClass = computed(() =>
  viewMode.value === 'grid'
    ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    : 'performance-list__list flex flex-col gap-4',
)

const isFilterExpanded = ref(false)

function toggleFilterPanel() {
  isFilterExpanded.value = !isFilterExpanded.value
}

watch(
  () => [listQuery.value.region, listQuery.value.status],
  ([region, status]) => {
    if (region || status) {
      isFilterExpanded.value = true
    }
  },
  { immediate: true },
)

function onAiRecommend() {
  router.push(SiteRouter.aiChat)
}

function onProfile() {
  // TODO: 마이페이지 이동
}

function onSupport() {
  // TODO: 고객지원 이동
}
</script>

<template>
  <section class="performance-list relative w-full py-8 sm:py-14">
    <div class="mx-auto w-full max-w-[var(--max-width)] px-4 sm:px-6">
      <header class="mb-6">
        <h1
          class="flex items-center gap-2 text-2xl font-bold text-[var(--dark-mode-main-font-color)] sm:text-3xl"
        >
          <span aria-hidden="true">{{ activeGenreHeader.icon }}</span>
          {{ activeGenreHeader.label }}
        </h1>
        <p class="mt-2 text-base text-[var(--dark-mode-content-font-color)]">
          총
          <CountSkeleton v-if="isLoading && performances.length === 0" />
          <span v-else class="font-semibold text-[var(--hover-point-text)]">{{ totalCount }}</span>
          개의 공연이 있습니다
        </p>
      </header>

      <PerformanceSearchBar
        class="mb-6"
        :keyword="listQuery.keyword"
        @search="submitKeyword"
      />

      <PerformanceFilters
        class="mb-8"
        :genre-list="genreList"
        :local-list="localList"
        :status-list="performanceStatusList"
        :active-genre="listQuery.genre"
        :active-region="listQuery.region"
        :active-status="listQuery.status"
        :show-sub-filters="isFilterExpanded"
        @select-genre="setGenre"
        @select-region="setRegion"
        @select-status="setStatus"
        @toggle-sub-filters="toggleFilterPanel"
      >
        <template #toolbar>
          <PerformanceListToolbar v-model:view-mode="viewMode" v-model:sort="sortValue" />
        </template>
      </PerformanceFilters>

      <EventCardGridSkeleton
        v-if="isLoading && performances.length === 0"
        :count="PERFORMANCE_PAGE_SIZE"
        :variant="viewMode"
        label="공연 목록 로딩 중"
      />

      <p
        v-else-if="errorMessage && performances.length === 0"
        class="py-16 text-left text-[var(--red-tag-font-color)]"
        role="alert"
      >
        {{ errorMessage }}
      </p>

      <template v-else-if="performances.length > 0">
        <div :class="gridClass">
          <RouterLink
            v-for="item in performances"
            :key="item.id"
            v-slot="{ navigate }"
            :to="SiteRouter.performances(String(item.id))"
            custom
          >
            <div
              role="link"
              tabindex="0"
              class="block cursor-pointer rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hover-point-text)]"
              @click="navigateUnlessFavoriteClick($event, navigate)"
              @keydown.enter.prevent="navigateUnlessFavoriteClick($event, navigate)"
            >
              <EventCard
                v-bind="item"
                :variant="viewMode"
                :is-hot="item.isHot ?? false"
                :is-favorite="isFavorite(item.id)"
                @toggle-favorite="toggleFavorite"
              />
            </div>
          </RouterLink>
        </div>

        <PerformancePagination
          v-if="showPagination"
          :current-page="listQuery.page"
          :total-pages="totalPages"
          @change="goToPage"
        />
      </template>

      <PerformanceEmpty v-else-if="!isLoading" />
    </div>

    <HeroFloatingButtons
      @ai-recommend="onAiRecommend"
      @profile="onProfile"
      @support="onSupport"
    />
  </section>
</template>
