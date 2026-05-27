<script setup lang="ts">
import { ref } from 'vue'
import EventCard from '@/components/card/EventCard.vue'
import type { EventCardData } from '@/types/eventCard'

const mockData: EventCardData = {
  id: 1,
  title: '레미제라블',
  genre: 'play',
  start_date: '2026-05-01',
  end_date: '2026-08-31',
  price_info: '50,000',
  status: 'upcomming',
  venue: '블루스퀘어 신한카드홀',
  img: 'https://picsum.photos/500',
}

const previewCards: (EventCardData & { isHot?: boolean })[] = [
  mockData,
  {
    id: 2,
    title: '아이유 HEREH 월드투어 서울',
    genre: 'concert',
    start_date: '2026-05-17',
    end_date: '2026-05-18',
    price_info: '99,000',
    status: 'performing',
    venue: '고척스카이돔',
    img: 'https://picsum.photos/501',
    isHot: true,
  },
]

const favoriteIds = ref<Set<number>>(new Set())

function handleToggleFavorite(id: number) {
  if (favoriteIds.value.has(id)) {
    favoriteIds.value.delete(id)
  } else {
    favoriteIds.value.add(id)
  }
}
</script>

<template>
  <section class="mx-auto w-full max-w-[var(--max-width)] px-6 py-10">
    <h1 class="mb-6 text-xl font-bold text-white">공연 카드 미리보기</h1>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <EventCard
        v-for="card in previewCards"
        :key="card.id"
        v-bind="card"
        :is-hot="card.isHot"
        :is-favorite="favoriteIds.has(card.id)"
        @toggle-favorite="handleToggleFavorite"
      />
    </div>
  </section>
</template>
