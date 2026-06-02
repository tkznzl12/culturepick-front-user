<script setup lang="ts">
import { PERFORMANCE_SORT_OPTIONS } from '@/constants/search'
import type { PerformanceViewMode } from '@/types/performance'
import IconChevronDown from '@/assets/icons/chevron-down-icon.svg?component'
import IconGrid from '@/assets/icons/grid-view-icon.svg?component'
import IconList from '@/assets/icons/list-view-icon.svg?component'

const viewMode = defineModel<PerformanceViewMode>('viewMode', { required: true })
const sort = defineModel<string>('sort', { required: true })
</script>

<template>
  <div class="performance-list-toolbar flex flex-wrap items-center gap-3">
    <label class="sr-only" for="performance-sort">정렬</label>
    <div class="performance-list-toolbar__sort-wrap relative">
      <select
        id="performance-sort"
        v-model="sort"
        class="performance-list-toolbar__sort border border-[var(--line-component-border-color)] bg-[#16161a] pl-4 text-sm text-[var(--dark-mode-main-font-color)] outline-none focus:border-[var(--hover-point-text)]"
      >
        <option
          v-for="option in PERFORMANCE_SORT_OPTIONS"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <IconChevronDown
        class="pointer-events-none absolute top-1/2 right-3 h-3 w-3 -translate-y-1/2 text-[var(--caption-text-color)]"
        aria-hidden="true"
      />
    </div>

    <div
      class="performance-list-toolbar__view-group"
      role="group"
      aria-label="보기 모드"
    >
      <button
        type="button"
        class="performance-list-toolbar__view-btn performance-list-toolbar__view-btn--left"
        :class="{ 'performance-list-toolbar__view-btn--active': viewMode === 'grid' }"
        :aria-pressed="viewMode === 'grid'"
        aria-label="그리드 보기"
        @click="viewMode = 'grid'"
      >
        <IconGrid class="h-[18px] w-[18px]" />
      </button>
      <button
        type="button"
        class="performance-list-toolbar__view-btn performance-list-toolbar__view-btn--right"
        :class="{ 'performance-list-toolbar__view-btn--active': viewMode === 'list' }"
        :aria-pressed="viewMode === 'list'"
        aria-label="리스트 보기"
        @click="viewMode = 'list'"
      >
        <IconList class="h-[18px] w-[18px]" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.performance-list-toolbar {
  --toolbar-control-height: 2.25rem;
  --toolbar-control-radius: var(--filter-toggle-radius);
}

.performance-list-toolbar__sort {
  appearance: none;
  box-sizing: border-box;
  height: var(--toolbar-control-height);
  padding-right: 2.25rem;
  border-radius: var(--toolbar-control-radius);
  line-height: var(--toolbar-control-height);
}

.performance-list-toolbar__view-group {
  display: inline-flex;
  box-sizing: border-box;
  width: calc(var(--toolbar-control-height) * 2);
  height: var(--toolbar-control-height);
  overflow: hidden;
  border-radius: var(--toolbar-control-radius);
  border: 1px solid var(--line-component-border-color);
  background-color: #16161a;
}

.performance-list-toolbar__view-btn {
  display: inline-flex;
  flex: 1 1 50%;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  color: var(--caption-text-color);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  cursor: pointer;
}

.performance-list-toolbar__view-btn--left.performance-list-toolbar__view-btn--active {
  border-radius: var(--toolbar-control-radius) 0 0 var(--toolbar-control-radius);
}

.performance-list-toolbar__view-btn--right.performance-list-toolbar__view-btn--active {
  border-radius: 0 var(--toolbar-control-radius) var(--toolbar-control-radius) 0;
}

.performance-list-toolbar__view-btn--active {
  background: var(--gradient-button);
  color: var(--dark-mode-main-font-color);
}

@media (max-width: 767px) {
  .performance-list-toolbar {
    width: 100%;
    justify-content: space-between;
  }

  .performance-list-toolbar__sort-wrap {
    flex: 1 1 auto;
    min-width: 0;
  }

  .performance-list-toolbar__sort {
    width: 100%;
    min-height: 2.75rem;
  }
}
</style>
