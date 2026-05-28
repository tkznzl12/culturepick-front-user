<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CardTag from '@/components/card/CardTag.vue'
import locationIcon from '@/assets/icons/location-icon.svg'
import calenderIcon from '@/assets/icons/calender-icon.svg'
import timeIcon from '@/assets/icons/time-icon.svg'
import ticketIcon from '@/assets/icons/ticket-icon.svg'
import infoIcon from '@/assets/icons/info-icon.svg'
import sharedIcon from '@/assets/icons/shared-icon.svg'
import { mockData } from '@/mocks/performanceDetail'
import type { GenreTagType, StatusTagType } from '@/types/tag'

const route = useRoute()
const id = computed(() => String(route.params.id ?? ''))

const genreTag = computed(() => mockData.genre as GenreTagType)
const statusTag = computed<StatusTagType>(() => {
  const raw = String(mockData.status ?? '')
  if (raw.includes('예정')) return 'upcomming'
  if (raw.includes('중')) return 'performing'
  if (raw.includes('완료') || raw.includes('종료')) return 'done'
  return 'upcomming'
})

const formattedDateRange = computed(() => {
  const start = mockData.start_date
  const end = mockData.end_date
  if (!start) return ''
  if (!end || start === end) return start

  const startYear = start.slice(0, 4)
  const endYear = end.slice(0, 4)
  if (startYear === endYear) return `${start} ~ ${end.slice(5)}`
  return `${start} ~ ${end}`
})

const priceInfo = computed(() => mockData.price_info ?? mockData.pirce_info ?? '')

const castList = computed(() => {
  const cleaned = mockData.cast
    .replace(/\s*등\s*$/, '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
  return cleaned
})

function onCopyLink() {
  const url = window.location.href
  navigator.clipboard?.writeText(url)
}
</script>

<template>
  <section class="mx-auto w-full max-w-[var(--max-width)] px-6 py-10">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr]">
      <div class="flex flex-col gap-4">
        <div class="overflow-hidden rounded-3xl bg-[#12121b] shadow-lg">
          <div class="relative aspect-[4/5] w-full">
            <img :src="mockData.poster_url" :alt="mockData.title" class="h-full w-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] px-4 py-3 text-sm font-semibold text-[var(--dark-mode-main-font-color)] transition-opacity hover:opacity-90"
          >
            관심
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] px-4 py-3 text-sm font-semibold text-[var(--dark-mode-main-font-color)] transition-opacity hover:opacity-90"
          >
            <img :src="ticketIcon" alt="" class="h-4 w-4" />
            찜 예정
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] px-4 py-3 text-sm font-semibold text-[var(--dark-mode-main-font-color)] transition-opacity hover:opacity-90"
            @click="onCopyLink"
          >
            <img :src="sharedIcon" alt="" class="h-4 w-4" />
            공유
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-5">
        <div class="flex flex-wrap items-center gap-2">
          <CardTag :tag="genreTag" />
          <CardTag :tag="statusTag" />
          <span class="text-xs text-[var(--line-component-font-color)]">ID: {{ id }}</span>
        </div>

        <h1 class="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {{ mockData.title }}
        </h1>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="detail-info-card">
            <div class="detail-info-card__label">
              <img :src="locationIcon" alt="" class="h-4 w-4" />
              장소
            </div>
            <div class="detail-info-card__value">{{ mockData.venues }}</div>
            <div class="detail-info-card__sub">{{ mockData.local }} · {{ mockData.venues }}</div>
          </div>

          <div class="detail-info-card">
            <div class="detail-info-card__label">
              <img :src="calenderIcon" alt="" class="h-4 w-4" />
              기간
            </div>
            <div class="detail-info-card__value">{{ formattedDateRange }}</div>
            <div class="detail-info-card__sub">공연 일정</div>
          </div>

          <div class="detail-info-card">
            <div class="detail-info-card__label">
              <img :src="timeIcon" alt="" class="h-4 w-4" />
              상영 시간
            </div>
            <div class="detail-info-card__value">{{ mockData.runtime }}</div>
            <div class="detail-info-card__sub">공연 러닝타임</div>
          </div>

          <div class="detail-info-card">
            <div class="detail-info-card__label">
              <img :src="infoIcon" alt="" class="h-4 w-4" />
              관람 등급
            </div>
            <div class="detail-info-card__value">{{ mockData.age_rating }}</div>
            <div class="detail-info-card__sub">연령 제한</div>
          </div>
        </div>

        <div class="detail-price-bar">
          <div class="flex min-w-0 flex-col gap-1">
            <span class="text-xs text-[var(--line-component-font-color)]">티켓 가격</span>
            <p class="truncate text-lg font-bold text-[var(--hover-point-text)]">
              {{ priceInfo }}
            </p>
          </div>

          <a
            class="detail-price-bar__cta"
            :href="mockData.bookingLink?.[0]?.url"
            target="_blank"
            rel="noreferrer"
          >
            예매하기
            <span class="text-xs opacity-80">({{ mockData.bookingLink?.[0]?.sitename }})</span>
          </a>
        </div>

        <button
          type="button"
          class="w-full rounded-2xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style="background: var(--gradient-button)"
        >
          공연 정보
        </button>

        <div class="grid grid-cols-1 gap-6 pt-2">
          <section class="detail-section">
            <h2 class="detail-section__title">공연 소개</h2>
            <p class="detail-section__content">
              {{ mockData.story }}
            </p>
          </section>

          <section class="detail-section">
            <h2 class="detail-section__title">출연진</h2>
            <div class="flex flex-wrap gap-2">
              <span v-for="cast in castList" :key="cast" class="detail-chip">{{ cast }}</span>
            </div>
          </section>

          <section class="detail-section">
            <h2 class="detail-section__title">제작진</h2>
            <p class="detail-section__content">{{ mockData.crew }}</p>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.detail-info-card {
  border: 1px solid var(--line-component-border-color);
  background: var(--line-component-background-color);
  border-radius: 1rem;
  padding: 1.1rem 1.2rem;
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.18);
}

.detail-info-card__label {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8125rem;
  color: var(--line-component-font-color);
  margin-bottom: 0.4rem;
}

.detail-info-card__value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--dark-mode-main-font-color);
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
  border-top: 1px solid rgb(255 255 255 / 0.06);
  padding-top: 1.25rem;
}

.detail-section__title {
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
  font-weight: 700;
  color: var(--dark-mode-main-font-color);
  border: 1px solid var(--line-component-border-color);
  background: var(--line-component-background-color);
}
</style>

