<script setup lang="ts">
import { computed } from 'vue'
import CardTag from '@/components/card/CardTag.vue'
import type { EventCardData } from '@/types/eventCard'
import type { GenreTagType, StatusTagType } from '@/types/tag'

const props = withDefaults(
  defineProps<
    EventCardData & {
      isHot?: boolean
      isFavorite?: boolean
    }
  >(),
  {
    isHot: false,
    isFavorite: false,
  },
)

const emit = defineEmits<{
  toggleFavorite: [id: number]
}>()

const genreTag = computed(() => props.genre as GenreTagType)
const statusTag = computed(() => props.status as StatusTagType)

const formattedDateRange = computed(() => {
  const start = props.start_date
  const end = props.end_date
  if (!start) return ''
  if (!end || start === end) return start

  const startYear = start.slice(0, 4)
  const endYear = end.slice(0, 4)

  if (startYear === endYear) {
    return `${start} ~ ${end.slice(5)}`
  }

  return `${start} ~ ${end}`
})

function onToggleFavorite() {
  emit('toggleFavorite', props.id)
}
</script>

<template>
  <article
    class="group flex w-full flex-col overflow-hidden rounded-3xl bg-[#12121b] shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
  >
    <div class="relative aspect-[4/3] w-full overflow-hidden">
      <img
        :src="img"
        :alt="title"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

      <div class="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
        <CardTag :tag="genreTag" />
        <span
          v-if="isHot"
          class="inline-flex items-center justify-center rounded-full bg-orange-600/80 px-2.5 py-1 text-[var(--font-size-caption)] font-medium text-white backdrop-blur-sm"
        >
          HOT
        </span>
      </div>

      <button
        type="button"
        class="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
        :aria-label="isFavorite ? '찜 해제' : '찜하기'"
        :aria-pressed="isFavorite"
        @click.stop="onToggleFavorite"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="h-5 w-5"
          :fill="isFavorite ? 'currentColor' : 'none'"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          />
        </svg>
      </button>

      <CardTag class="absolute bottom-3 left-3" :tag="statusTag" />
    </div>

    <div class="flex flex-col gap-2 p-4">
      <h3 class="line-clamp-2 text-base leading-snug font-bold text-white">
        {{ title }}
      </h3>

      <p class="flex items-center gap-1.5 text-sm text-[var(--dark-mode-content-font-color)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="h-4 w-4 shrink-0"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span class="truncate">{{ venue }}</span>
      </p>

      <div class="flex items-end justify-between gap-3">
        <p class="flex min-w-0 items-center gap-1.5 text-sm text-[var(--dark-mode-content-font-color)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span class="truncate">{{ formattedDateRange }}</span>
        </p>

        <p class="shrink-0 text-sm font-semibold text-[var(--color-secondary)]">
          {{ price_info }}
        </p>
      </div>
    </div>
  </article>
</template>
