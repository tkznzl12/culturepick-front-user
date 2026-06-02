<script setup lang="ts">
import { GENRE_ALL_ICON, type GenreItem } from '@/constants/genreList'
import IconChevronDown from '@/assets/icons/chevron-down-icon.svg?component'
import IconFilterSliders from '@/assets/icons/filter-sliders-icon.svg?component'
import type { LocalItem } from '@/constants/localList'
import type { PerformanceStatusItem } from '@/constants/performanceStatus'

defineProps<{
  genreList: GenreItem[]
  localList: LocalItem[]
  statusList: PerformanceStatusItem[]
  activeGenre?: string
  activeRegion?: string
  activeStatus?: string
  showSubFilters?: boolean
}>()

const emit = defineEmits<{
  selectGenre: [code?: string]
  selectRegion: [code?: string]
  selectStatus: [code?: string]
  toggleSubFilters: []
}>()

function isGenreActive(code: string | undefined, activeGenre?: string) {
  if (!code) return !activeGenre
  return activeGenre === code
}

function isRegionActive(code: string | undefined, activeRegion?: string) {
  if (!code) return !activeRegion
  return activeRegion === code
}

function isStatusActive(code: string | undefined, activeStatus?: string) {
  if (!code) return !activeStatus
  return activeStatus === code
}
</script>

<template>
  <div class="performance-filters flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-[var(--caption-text-color)]">장르</span>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="performance-filters__pill"
          :class="{ 'performance-filters__pill--active': isGenreActive(undefined, activeGenre) }"
          @click="emit('selectGenre', undefined)"
        >
          <span class="performance-filters__pill-icon" aria-hidden="true">{{ GENRE_ALL_ICON }}</span>
          전체
        </button>
        <button
          v-for="genre in genreList"
          :key="genre.code"
          type="button"
          class="performance-filters__pill"
          :class="{ 'performance-filters__pill--active': isGenreActive(genre.code, activeGenre) }"
          @click="emit('selectGenre', genre.code)"
        >
          <span class="performance-filters__pill-icon" aria-hidden="true">{{ genre.icon }}</span>
          {{ genre.name }}
        </button>
      </div>
    </div>

    <div class="performance-filters__actions flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        class="performance-filters__toggle"
        :class="{ 'performance-filters__toggle--active': showSubFilters }"
        :aria-expanded="showSubFilters"
        aria-controls="performance-sub-filters"
        @click="emit('toggleSubFilters')"
      >
        <IconFilterSliders class="h-4 w-4 shrink-0" aria-hidden="true" />
        필터
        <IconChevronDown
          class="performance-filters__toggle-chevron h-3.5 w-3.5 shrink-0"
          :class="{ 'performance-filters__toggle-chevron--open': showSubFilters }"
          aria-hidden="true"
        />
      </button>

      <slot name="toolbar" />
    </div>

    <div
      v-if="showSubFilters"
      id="performance-sub-filters"
      class="performance-filters__panel"
    >
      <div class="performance-filters__group">
        <span class="performance-filters__label">지역</span>
        <div class="performance-filters__pills">
          <button
            type="button"
            class="performance-filters__pill"
            :class="{ 'performance-filters__pill--active': isRegionActive(undefined, activeRegion) }"
            @click="emit('selectRegion', undefined)"
          >
            전체
          </button>
          <button
            v-for="region in localList"
            :key="region.code"
            type="button"
            class="performance-filters__pill"
            :class="{
              'performance-filters__pill--active': isRegionActive(region.code, activeRegion),
            }"
            @click="emit('selectRegion', region.code)"
          >
            {{ region.name }}
          </button>
        </div>
      </div>

      <div class="performance-filters__group">
        <span class="performance-filters__label">공연 여부</span>
        <div class="performance-filters__pills">
          <button
            type="button"
            class="performance-filters__pill"
            :class="{ 'performance-filters__pill--active': isStatusActive(undefined, activeStatus) }"
            @click="emit('selectStatus', undefined)"
          >
            전체
          </button>
          <button
            v-for="status in statusList"
            :key="status.code"
            type="button"
            class="performance-filters__pill"
            :class="{
              'performance-filters__pill--active': isStatusActive(status.code, activeStatus),
            }"
            @click="emit('selectStatus', status.code)"
          >
            {{ status.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.performance-filters__toggle {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 0.5rem;
  box-sizing: border-box;
  height: 2.25rem;
  padding: 0 1rem;
  border-radius: var(--filter-toggle-radius);
  border: 1px solid var(--line-component-border-color);
  background-color: var(--line-component-background-color);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--dark-mode-content-font-color);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
  cursor: pointer;
}

.performance-filters__toggle:hover:not(.performance-filters__toggle--active) {
  border-color: var(--hover-point-text);
  color: var(--hover-point-text);
}

.performance-filters__toggle--active {
  border-color: var(--filter-toggle-active-border-color);
  background-color: var(--filter-toggle-active-background-color);
  color: var(--blue-tag-font-color);
}

.performance-filters__toggle-chevron {
  transition: transform 0.2s ease;
}

.performance-filters__toggle-chevron--open {
  transform: rotate(180deg);
}

.performance-filters__panel {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1.5rem 2.5rem;
  width: 100%;
  padding: 1.25rem 1.5rem;
  border-radius: var(--filter-panel-radius);
  border: 1px solid var(--filter-panel-border-color);
  background-color: var(--filter-panel-background-color);
}

.performance-filters__group {
  display: flex;
  flex: 1 1 16rem;
  flex-direction: column;
  gap: 0.75rem;
  min-width: min(100%, 16rem);
}

.performance-filters__label {
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-medium);
  color: var(--caption-text-color);
}

.performance-filters__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.performance-filters__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border-radius: 9999px;
  border: 1px solid var(--line-component-border-color);
  background-color: var(--line-component-background-color);
  padding: 0.375rem 0.75rem;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--dark-mode-content-font-color);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
  cursor: pointer;
}

.performance-filters__pill:hover {
  border-color: var(--hover-point-text);
  color: var(--hover-point-text);
}

.performance-filters__pill--active {
  border-color: transparent;
  background: var(--gradient-button);
  color: var(--dark-mode-main-font-color);
}

.performance-filters__pill-icon {
  line-height: 1;
}

@media (max-width: 767px) {
  .performance-filters__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .performance-filters__toggle {
    width: 100%;
    justify-content: center;
    min-height: 2.75rem;
  }

  .performance-filters__pill {
    min-height: 2.75rem;
    padding: 0.5rem 0.875rem;
  }

  .performance-filters__panel {
    flex-direction: column;
    gap: 1.25rem;
    padding: 1rem;
  }
}

@media (max-width: 479px) {
  .performance-filters__panel {
    padding: 0.875rem;
  }
}
</style>
