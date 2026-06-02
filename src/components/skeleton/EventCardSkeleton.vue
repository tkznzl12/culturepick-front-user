<script setup lang="ts">
import SkeletonBlock from '@/components/skeleton/SkeletonBlock.vue'

withDefaults(
  defineProps<{
    variant?: 'grid' | 'list'
  }>(),
  {
    variant: 'grid',
  },
)
</script>

<template>
  <article
    class="event-card-skeleton w-full overflow-hidden rounded-3xl bg-[var(--card-background-color)] shadow-lg"
    :class="variant === 'list' ? 'event-card-skeleton--list' : 'flex flex-col'"
    aria-hidden="true"
  >
    <SkeletonBlock
      class="event-card-skeleton__media shrink-0"
      :class="
        variant === 'grid'
          ? 'aspect-[4/3] w-full rounded-none'
          : 'event-card-skeleton__media--list rounded-[0.875rem]'
      "
      rounded="rounded-none"
    />

    <template v-if="variant === 'list'">
      <div class="event-card-skeleton__body flex flex-1 flex-col justify-evenly">
        <SkeletonBlock block-class="h-4 w-3/4" />
        <SkeletonBlock block-class="h-3.5 w-1/2" />
        <SkeletonBlock block-class="h-3.5 w-2/3" />
        <SkeletonBlock block-class="h-4 w-1/3" />
      </div>

      <div class="event-card-skeleton__tags flex flex-col items-end justify-between">
        <SkeletonBlock block-class="h-6 w-14" rounded="rounded-full" />
        <SkeletonBlock block-class="h-6 w-16" rounded="rounded-full" />
      </div>
    </template>

    <div v-else class="flex flex-col gap-2 p-4">
      <SkeletonBlock block-class="h-4 w-full" />
      <SkeletonBlock block-class="h-4 w-4/5" />

      <div class="flex flex-col gap-1.5 pt-0.5">
        <SkeletonBlock block-class="h-3.5 w-2/3" />
        <div class="flex items-center justify-between gap-3">
          <SkeletonBlock block-class="h-3.5 w-1/2" />
          <SkeletonBlock block-class="h-4 w-16" />
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.event-card-skeleton--list {
  --event-card-list-thumb: 7.5rem;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 1rem;
  padding: 1rem;
}

.event-card-skeleton__media--list {
  width: var(--event-card-list-thumb);
  height: var(--event-card-list-thumb);
}

.event-card-skeleton__body,
.event-card-skeleton__tags {
  height: var(--event-card-list-thumb);
  min-height: var(--event-card-list-thumb);
}

.event-card-skeleton__tags {
  flex-shrink: 0;
  padding-right: 0.25rem;
}

@media (max-width: 767px) {
  .event-card-skeleton--list {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .event-card-skeleton__body {
    flex: 1 1 calc(100% - var(--event-card-list-thumb) - 1rem);
    height: auto;
    min-height: var(--event-card-list-thumb);
  }

  .event-card-skeleton__tags {
    order: -1;
    flex: 1 1 100%;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;
    height: auto;
    min-height: 0;
    padding: 0;
  }
}

@media (max-width: 479px) {
  .event-card-skeleton--list {
    --event-card-list-thumb: 5.5rem;
    gap: 0.75rem;
    padding: 0.75rem;
  }
}
</style>
