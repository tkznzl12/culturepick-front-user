<script setup lang="ts">
import { computed } from 'vue'
import { buildPaginationItems } from '@/utils/pagination'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

const pageItems = computed(() => buildPaginationItems(props.currentPage, props.totalPages))

const canGoPrev = computed(() => props.currentPage > 1)
const canGoNext = computed(() => props.currentPage < props.totalPages)

function goToPage(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('change', page)
}

function goPrev() {
  goToPage(props.currentPage - 1)
}

function goNext() {
  goToPage(props.currentPage + 1)
}
</script>

<template>
  <nav class="app-pagination" aria-label="페이지 네비게이션">
    <button
      type="button"
      class="app-pagination__arrow"
      :disabled="!canGoPrev"
      aria-label="이전 페이지"
      @click="goPrev"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>

    <ul class="app-pagination__list">
      <li v-for="(item, index) in pageItems" :key="`${item}-${index}`">
        <span
          v-if="item === 'ellipsis'"
          class="app-pagination__ellipsis"
          aria-hidden="true"
        >
          ...
        </span>
        <button
          v-else
          type="button"
          class="app-pagination__page"
          :class="{ 'app-pagination__page--active': item === currentPage }"
          :aria-label="`${item}페이지`"
          :aria-current="item === currentPage ? 'page' : undefined"
          @click="goToPage(item)"
        >
          {{ item }}
        </button>
      </li>
    </ul>

    <button
      type="button"
      class="app-pagination__arrow"
      :disabled="!canGoNext"
      aria-label="다음 페이지"
      @click="goNext"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  </nav>
</template>

<style scoped>
.app-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
}

.app-pagination__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.app-pagination__arrow,
.app-pagination__page {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 0.5rem;
  border: 1px solid var(--line-component-border-color);
  border-radius: 0.5rem;
  background-color: var(--line-component-background-color);
  color: var(--dark-mode-content-font-color);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease;
}

.app-pagination__arrow:hover:not(:disabled),
.app-pagination__page:hover:not(.app-pagination__page--active) {
  border-color: var(--hover-point-text);
  color: var(--hover-point-text);
}

.app-pagination__arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.app-pagination__page--active {
  border-color: transparent;
  background: var(--gradient-button);
  color: var(--dark-mode-main-font-color);
}

.app-pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 2.25rem;
  color: var(--caption-text-color);
  user-select: none;
}

@media (max-width: 767px) {
  .app-pagination {
    gap: 0.375rem;
    margin-top: 2rem;
  }

  .app-pagination__arrow,
  .app-pagination__page,
  .app-pagination__ellipsis {
    min-width: 2.75rem;
    height: 2.75rem;
  }
}

@media (max-width: 479px) {
  .app-pagination__list {
    gap: 0.25rem;
  }

  .app-pagination__arrow,
  .app-pagination__page {
    min-width: 2.5rem;
    height: 2.75rem;
    padding: 0 0.375rem;
    font-size: 0.8125rem;
  }
}
</style>
