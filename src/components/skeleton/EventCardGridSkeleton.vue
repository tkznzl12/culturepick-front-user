<script setup lang="ts">
import { computed } from 'vue'
import EventCardSkeleton from '@/components/skeleton/EventCardSkeleton.vue'

const props = withDefaults(
  defineProps<{
    count?: number
    variant?: 'grid' | 'list'
    /** 접근성 라벨 */
    label?: string
  }>(),
  {
    count: 12,
    variant: 'grid',
    label: '콘텐츠 로딩 중',
  },
)

const gridClass = computed(() =>
  props.variant === 'grid'
    ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    : 'flex flex-col gap-4',
)
</script>

<template>
  <div :class="gridClass" aria-busy="true" :aria-label="label">
    <EventCardSkeleton v-for="index in count" :key="index" :variant="variant" />
  </div>
</template>
