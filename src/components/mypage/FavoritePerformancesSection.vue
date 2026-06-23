<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import EventCard from '@/components/card/EventCard.vue'
import CommonButton from '@/components/common/CommonButton.vue'
import { SiteRouter } from '@/constants/routes'
import type { FavoritePerformance } from '@/types/mypage'
import type { EventCardData } from '@/types/eventCard'

const props = defineProps<{
  items: FavoritePerformance[]
  totalCount: number
}>()

const cardItems = computed<EventCardData[]>(() =>
  props.items.map((item) => ({
    id: item.id,
    title: item.title,
    img: item.image,
    start_date: item.startDate,
    end_date: item.endDate,
    genre: item.category,
    status: 'performing',
    venue: item.venue || '공연장 정보 확인',
    price_info: '',
  })),
)
</script>

<template>
  <section>
    <header class="mb-4 flex items-center justify-between gap-3">
      <h2 class="text-xl font-bold text-[var(--dark-mode-main-font-color)]">
        좋아요 한 공연 {{ totalCount }}
      </h2>
    
    </header>

    <div v-if="cardItems.length > 0" class="mypage-favorite-grid grid grid-cols-5 gap-4">
      <RouterLink
        v-for="item in cardItems"
        :key="item.id"
        :to="SiteRouter.performances(item.id)"
        class="mypage-favorite-card block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hover-point-text)]"
      >
        <EventCard v-bind="item" :is-favorite="true" />
      </RouterLink>
    </div>

    <div
      v-else
      class="p-2 text-center text-[var(--caption-text-color)]"
    >
      아직 좋아요 한 공연이 없습니다.
    </div>
  </section>
</template>

<style scoped>
.mypage-favorite-card :deep(.event-card__favorite) {
  display: none;
}

@media (max-width: 1023px) {
  .mypage-favorite-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .mypage-favorite-grid {
    grid-template-columns: 1fr;
  }
}
</style>
