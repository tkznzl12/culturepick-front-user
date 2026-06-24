<script setup lang="ts">
import { computed, ref } from 'vue'
import { postPerformanceAction } from '@/api/performanceDetail'
import CardTag from '@/components/card/CardTag.vue'
import locationIcon from '@/assets/icons/location-icon.svg'
import calenderIcon from '@/assets/icons/calender-icon.svg'
import { getAccessToken } from '@/utils/auth-cookie'
import type { EventCardData } from '@/types/eventCard'
import type { GenreTagType, StatusTagType } from '@/types/tag'

const props = withDefaults(
  defineProps<
    EventCardData & {
      isHot?: boolean
      isFavorite?: boolean
      is_interested?: boolean
      variant?: 'grid' | 'list'
    }
  >(),
  {
    isHot: false,
    isFavorite: false,
    variant: 'grid',
  },
)

const emit = defineEmits<{
  toggleFavorite: [id: string | number]
  authRequired: []
}>()

const genreTag = computed(() => props.genre as GenreTagType)
const statusTag = computed(() => props.status as StatusTagType)
const isList = computed(() => props.variant === 'list')
const effectiveIsFavorite = computed(() => props.isFavorite || Boolean(props.is_interested))
const isFavoriteActionLoading = ref(false)

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

async function onToggleFavorite(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()

  if (!getAccessToken()) {
    emit('authRequired')
    return
  }

  if (isFavoriteActionLoading.value) return

  isFavoriteActionLoading.value = true

  try {
    await postPerformanceAction(String(props.id), {
      action_type: 'interest',
      is_active: !effectiveIsFavorite.value,
    })
    emit('toggleFavorite', props.id)
  } catch (error) {
    console.error('[event-card] favorite action failed:', error)

    if (isAuthError(error)) {
      emit('authRequired')
      return
    }

    window.alert('요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.')
  } finally {
    isFavoriteActionLoading.value = false
  }
}

function isAuthError(error: unknown) {
  if (error instanceof Error) {
    return error.message.includes('Refresh token')
  }

  if (typeof error === 'object' && error !== null && 'status' in error) {
    return Number(error.status) === 401
  }

  return false
}
</script>

<template>
  <article
    class="event-card group w-full overflow-hidden rounded-3xl bg-[var(--card-background-color)] shadow-lg transition-transform duration-200"
    :class="isList ? 'event-card--list' : 'flex flex-col hover:-translate-y-0.5'"
  >
    <div
      class="event-card__media relative shrink-0 overflow-hidden"
      :class="isList ? 'event-card__media--list' : 'aspect-[4/3] w-full'"
    >
      <img
        :src="img"
        :alt="title"
        class="h-full w-full object-cover transition-transform duration-300"
        :class="{ 'group-hover:scale-105': !isList }"
        loading="lazy"
      />

      <div
        v-if="!isList"
        class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
      />

      <div v-if="!isList" class="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
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
        class="event-card__favorite absolute flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
        :class="isList ? 'event-card__favorite--list' : 'top-3 right-3 h-9 w-9'"
        :aria-label="effectiveIsFavorite ? '찜 해제' : '찜하기'"
        :aria-pressed="effectiveIsFavorite"
        :aria-busy="isFavoriteActionLoading"
        @click="onToggleFavorite"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="event-card__favorite-icon"
          :class="isList ? 'event-card__favorite-icon--list' : 'h-5 w-5'"
          :fill="effectiveIsFavorite ? 'currentColor' : 'none'"
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

      <CardTag v-if="!isList" class="absolute bottom-3 left-3" :tag="statusTag" />
    </div>

    <template v-if="isList">
      <div class="event-card__body">
        <h3 class="event-card__title truncate text-base leading-snug font-bold text-[var(--dark-mode-main-font-color)]">
          {{ title }}
        </h3>

        <p class="event-card__meta flex items-center gap-1.5 text-sm text-[var(--dark-mode-content-font-color)]">
          <img :src="locationIcon" alt="" width="16" height="16" class="h-4 w-4 shrink-0" />
          <span class="truncate">{{ venue }}</span>
        </p>

        <p class="event-card__meta flex items-center gap-1.5 text-sm text-[var(--dark-mode-content-font-color)]">
          <img :src="calenderIcon" alt="" width="16" height="16" class="h-4 w-4 shrink-0" />
          <span class="truncate">{{ formattedDateRange }}</span>
        </p>

        <p class="event-card__price text-base font-semibold text-[var(--hover-point-text)]">
          {{ price_info }}
        </p>
      </div>

      <div class="event-card__tags">
        <CardTag :tag="genreTag" />
        <CardTag :tag="statusTag" />
        <span
          v-if="isHot"
          class="inline-flex items-center justify-center rounded-full bg-orange-600/80 px-2.5 py-1 text-[var(--font-size-caption)] font-medium text-white"
        >
          HOT
        </span>
      </div>
    </template>

    <div v-else class="flex flex-col gap-2 p-4">
      <h3 class="truncate text-base leading-snug font-bold text-white">
        {{ title }}
      </h3>

      <div class="flex flex-col gap-1">
        <p class="flex items-center gap-1.5 text-sm text-[var(--dark-mode-content-font-color)]">
          <img :src="locationIcon" alt="" width="16" height="16" class="h-4 w-4 shrink-0" />
          <span class="truncate">{{ venue }}</span>
        </p>

        <div class="flex items-center justify-between gap-3">
          <p class="flex min-w-0 items-center gap-1.5 text-sm text-[var(--dark-mode-content-font-color)]">
            <img :src="calenderIcon" alt="" width="16" height="16" class="h-4 w-4 shrink-0" />
            <span class="truncate">{{ formattedDateRange }}</span>
          </p>

          <p class="shrink-0 text-base font-semibold text-[var(--hover-point-text)]">
            {{ price_info }}
          </p>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.event-card--list {
  --event-card-list-thumb: 7.5rem;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 1rem;
  padding: 1rem;
}

.event-card--list:hover {
  transform: translateY(-0.125rem);
}

.event-card__media--list {
  width: var(--event-card-list-thumb);
  height: var(--event-card-list-thumb);
  border-radius: 0.875rem;
}

.event-card__body,
.event-card__tags {
  display: flex;
  flex-direction: column;
  height: var(--event-card-list-thumb);
  min-height: var(--event-card-list-thumb);
}

.event-card__body {
  flex: 1;
  min-width: 0;
  justify-content: space-evenly;
}

.event-card__tags {
  flex-shrink: 0;
  align-items: flex-end;
  justify-content: space-between;
  padding-right: 0.25rem;
}

.event-card__favorite--list {
  top: 0.25rem;
  right: 0.25rem;
  width: 1.75rem;
  height: 1.75rem;
}

.event-card__favorite-icon--list {
  width: 0.875rem;
  height: 0.875rem;
}

.event-card__title,
.event-card__meta,
.event-card__price {
  margin: 0;
}

@media (max-width: 767px) {
  .event-card--list {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .event-card__body {
    flex: 1 1 calc(100% - var(--event-card-list-thumb) - 1rem);
    height: auto;
    min-height: var(--event-card-list-thumb);
  }

  .event-card__tags {
    order: -1;
    flex: 1 1 100%;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;
    height: auto;
    min-height: 0;
    padding: 0;
  }
}

@media (max-width: 479px) {
  .event-card--list {
    --event-card-list-thumb: 5.5rem;
    gap: 0.75rem;
    padding: 0.75rem;
  }

  .event-card__favorite--list {
    width: 2rem;
    height: 2rem;
  }
}
</style>
