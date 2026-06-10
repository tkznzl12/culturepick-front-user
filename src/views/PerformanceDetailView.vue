<script setup lang="ts">
import { ref, watch } from 'vue'
import CardTag from '@/components/card/CardTag.vue'
import PerformanceDetailSkeleton from '@/components/skeleton/PerformanceDetailSkeleton.vue'
import LocationIcon from '@/assets/icons/detail-location-icon.svg?component'
import CalenderIcon from '@/assets/icons/detail-calender-icon.svg?component'
import TimeIcon from '@/assets/icons/time-icon.svg?component'
import HeartIcon from '@/assets/icons/heart-active.svg?component'
import UpcommingIcon from '@/assets/icons/upcomming-icon.svg?component'
import ShareIcon from '@/assets/icons/shared-icon.svg?component'
import InfoIcon from '@/assets/icons/info-icon.svg?component'
import UsersIcon from '@/assets/icons/users-Icon.svg?component'
import { usePerformanceDetail } from '@/composables/usePerformanceDetail'

const {
  data,
  isLoading,
  errorMessage,
  genreTag,
  statusTag,
  formattedDateRange,
  priceInfo,
  castList,
} = usePerformanceDetail()

const isFavorite = ref(false)
const isPlanned = ref(false)

function onToggleFavorite() {
  isFavorite.value = !isFavorite.value
}

function onTogglePlanned() {
  isPlanned.value = !isPlanned.value
}

function onCopyLink() {
  const url = window.location.href
  navigator.clipboard?.writeText(url)
}

watch(
  () => data.value,
  (detail) => {
    isFavorite.value = Boolean(detail?.is_interested)
    isPlanned.value = Boolean(detail?.is_watchlisted)
  },
  { immediate: true },
)
</script>

<template>
  <PerformanceDetailSkeleton v-if="isLoading && !data" />

  <p
    v-else-if="errorMessage && !data"
    class="mx-auto w-full max-w-[var(--max-width)] px-4 py-12 text-left text-[var(--red-tag-font-color)] sm:px-6 sm:py-16"
    role="alert"
  >
    {{ errorMessage }}
  </p>

  <section v-else-if="data" class="performance-detail mx-auto w-full max-w-[var(--max-width)] px-4 py-8 sm:px-6 sm:py-10">
    <div class="performance-detail__layout grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr]">
      <div class="flex flex-col gap-4">
        <div class="overflow-hidden rounded-3xl bg-[#12121b] shadow-lg">
          <div class="relative aspect-[4/5] w-full">
            <img :src="data.poster_url" :alt="data.title" class="h-full w-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />

            <div class="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
              <CardTag :tag="genreTag" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-3">
          <button
            type="button"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold leading-none transition-opacity hover:opacity-90"
            :class="
              isFavorite
                ? 'border border-[#FF6467] bg-[#FF6467]/10 text-[#FF6467]'
                : 'border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] text-[var(--dark-mode-main-font-color)]'
            "
            :aria-label="isFavorite ? '관심 해제' : '관심'"
            :aria-pressed="isFavorite"
            @click="onToggleFavorite"
          >
            <HeartIcon
              class="detail-inline-icon"
              :style="{
                '--icon-stroke': 'currentColor',
                '--icon-fill': isFavorite ? 'currentColor' : 'none',
              }"
              aria-hidden="true"
            />
            관심
          </button>
          <button
            type="button"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold leading-none transition-opacity hover:opacity-90"
            :class="
              isPlanned
                ? 'border border-[#51A2FF] bg-[#51A2FF]/10 text-[#51A2FF]'
                : 'border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] text-[var(--dark-mode-main-font-color)]'
            "
            :aria-label="isPlanned ? '볼 예정 해제' : '볼 예정'"
            :aria-pressed="isPlanned"
            @click="onTogglePlanned"
          >
            <UpcommingIcon
              class="detail-inline-icon"
              :style="{
                '--icon-stroke': 'currentColor',
                '--icon-fill': isPlanned ? 'currentColor' : 'none',
              }"
              aria-hidden="true"
            />
            볼 예정
          </button>
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] text-[var(--dark-mode-main-font-color)] leading-none transition-opacity hover:opacity-90"
            @click="onCopyLink"
            aria-label="공유"
          >
            <ShareIcon
              class="detail-inline-icon"
              :style="{
                '--icon-stroke': '#D1D5DC',
              }"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-5">
        <div class="flex flex-wrap items-center gap-2">
          <CardTag :tag="statusTag" />
          <span class="text-sm text-[var(--line-component-font-color)]"> | {{ data.age_rating }}</span>
        </div>

        <h1 class="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
          {{ data.title }}
        </h1>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="detail-info-card">
            <div class="detail-info-card__label">
              <span class="detail-card-icon-wrap" aria-hidden="true">
                <LocationIcon class="detail-card-icon" />
              </span>
              공연장
            </div>
            <div class="detail-info-card__value">{{ data.venues }}</div>
          </div>

          <div class="detail-info-card">
            <div class="detail-info-card__label">
              <span class="detail-card-icon-wrap" aria-hidden="true">
                <LocationIcon class="detail-card-icon" />
              </span>
              지역
            </div>
            <div class="detail-info-card__value">{{ data.local }}</div>
          </div>

          <div class="detail-info-card">
            <div class="detail-info-card__label">
              <span class="detail-card-icon-wrap" aria-hidden="true">
                <CalenderIcon class="detail-card-icon" />
              </span>
              기간
            </div>
            <div class="detail-info-card__value">{{ formattedDateRange }}</div>
          </div>

          <div class="detail-info-card">
            <div class="detail-info-card__label">
              <span class="detail-card-icon-wrap" aria-hidden="true">
                <TimeIcon class="detail-card-icon" />
              </span>
              공연 시간
            </div>
            <div class="detail-info-card__value">{{ data.runtime }}</div>
          </div>
        </div>

        <div class="detail-price-bar">
          <div class="flex min-w-0 flex-col gap-1">
            <span class="text-xs text-[var(--line-component-font-color)]">티켓 가격</span>
            <p class="truncate text-xl font-extrabold text-[var(--hover-point-text)]">
              {{ priceInfo }}
            </p>
          </div>

          <a
            class="detail-price-bar__cta"
            :href="data.bookingLink?.[0]?.url"
            target="_blank"
            rel="noreferrer"
          >
            예매하기
          </a>
        </div>


        <div class="grid grid-cols-1 gap-6 pt-2">
          <section class="detail-section">
            <h2 class="detail-section__title">
              <span class="detail-card-icon-wrap" aria-hidden="true">
                <InfoIcon class="detail-card-icon" />
              </span>
              공연 소개
            </h2>
            <p class="detail-section__content">
              {{ data.story }}
            </p>
          </section>

          <section class="detail-section">
            <h2 class="detail-section__title">
              <span class="detail-card-icon-wrap" aria-hidden="true">
                <UsersIcon class="detail-card-icon" />
              </span>
              출연진
            </h2>
            <div class="flex flex-wrap gap-2">
              <span v-for="cast in castList" :key="cast" class="detail-chip">{{ cast }}</span>
            </div>
          </section>

          <section class="detail-section">
            <h2 class="detail-section__title">제작진</h2>
            <p class="detail-section__content">{{ data.crew }}</p>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.detail-inline-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  display: block;
  align-self: center;
}

.detail-inline-icon :deep(path) {
  stroke: var(--icon-stroke, currentColor);
}

.detail-inline-icon :deep(svg),
.detail-inline-icon :deep(g),
.detail-inline-icon :deep(path) {
  vector-effect: non-scaling-stroke;
}

.detail-inline-icon :deep(path[stroke]) {
  stroke: var(--icon-stroke, currentColor);
}

.detail-inline-icon :deep(path) {
  fill: var(--icon-fill, none);
}

.detail-card-icon {
  width: 0.9375rem; /* 15px */
  height: 0.9375rem; /* 15px */
  flex-shrink: 0;
  display: block;
  overflow: visible;
  transform-origin: center;
  transform-box: fill-box;
  color: #99a1af;
}

.detail-card-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem; /* 라벨 라인하이트 기준 */
  flex-shrink: 0;
}

.detail-card-icon :deep(path[stroke]) {
  stroke: currentColor;
}

.detail-card-icon :deep(path) {
  fill: none;
}

.detail-info-card {
  border: 1px solid var(--line-component-border-color);
  background: var(--line-component-background-color);
  border-radius: 1.25rem;
  padding: 1rem 1.1rem;
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.18);
}

.detail-info-card__label {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.75rem;
  line-height: 1.25rem;
  min-height: 1.25rem;
  color: var(--line-component-font-color);
  margin-bottom: 0.4rem;
}

.detail-info-card__value {
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem;
  color: #fff;
}

.detail-info-card__sub {
  margin-top: 0.35rem;
  font-size: 0.8125rem;
  color: var(--dark-mode-content-font-color);
  opacity: 0.9;
}

.detail-price-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-radius: 1.25rem;
  border: 1px solid rgb(81 162 255 / 0.35);
  background: linear-gradient(90deg, rgb(13 25 55 / 0.9) 0%, rgb(18 18 27 / 0.65) 100%);
  box-shadow: 0 18px 45px rgb(0 0 0 / 0.28);
}

.detail-price-bar__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.85rem;
  padding: 0.65rem 0.95rem;
  background: rgb(81 162 255 / 0.18);
  border: 1px solid rgb(81 162 255 / 0.35);
  color: var(--dark-mode-main-font-color);
  font-size: 0.875rem;
  font-weight: 700;
  transition: opacity 0.15s ease;
  white-space: nowrap;
}

.detail-price-bar__cta:hover {
  opacity: 0.92;
}

.detail-section {
  padding-top: 1.25rem;
}

.detail-section__title {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 1rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.detail-section__content {
  color: var(--dark-mode-content-font-color);
  line-height: 1.7;
  font-size: 0.95rem;
}

.detail-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  padding: 0.35rem 0.7rem;
  font-size: 0.8125rem;
  color: var(--dark-mode-main-font-color);
  border: 1px solid var(--line-component-border-color);
  background: var(--line-component-background-color);
}

@media (max-width: 767px) {
  .detail-price-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    padding: 1rem;
  }

  .detail-price-bar__cta {
    justify-content: center;
    min-height: 2.75rem;
    padding: 0.75rem 1rem;
  }

  .detail-section__content {
    font-size: 0.875rem;
  }
}

@media (max-width: 479px) {
  .performance-detail__layout {
    gap: 1.5rem;
  }
}
</style>
