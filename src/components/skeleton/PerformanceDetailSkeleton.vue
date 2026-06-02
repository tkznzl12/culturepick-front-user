<script setup lang="ts">
import SkeletonBlock from '@/components/skeleton/SkeletonBlock.vue'
</script>

<template>
  <section
    class="mx-auto w-full max-w-[var(--max-width)] px-4 py-8 sm:px-6 sm:py-10"
    aria-busy="true"
    aria-label="공연 상세 정보 로딩 중"
  >
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr]">
      <div class="flex flex-col gap-4">
        <SkeletonBlock
          block-class="aspect-[4/5] w-full"
          rounded="rounded-3xl"
        />

        <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-3">
          <SkeletonBlock block-class="h-11 w-full" rounded="rounded-2xl" />
          <SkeletonBlock block-class="h-11 w-full" rounded="rounded-2xl" />
          <SkeletonBlock block-class="h-11 w-11" rounded="rounded-2xl" />
        </div>
      </div>

      <div class="flex flex-col gap-5">
        <div class="flex flex-wrap items-center gap-2">
          <SkeletonBlock block-class="h-6 w-16" rounded="rounded-full" />
          <SkeletonBlock block-class="h-4 w-24" />
        </div>

        <SkeletonBlock block-class="h-9 w-4/5 sm:h-10" rounded="rounded-lg" />
        <SkeletonBlock block-class="h-9 w-3/5 sm:h-10" rounded="rounded-lg" />

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SkeletonBlock
            v-for="index in 4"
            :key="index"
            block-class="h-[4.5rem] w-full"
            rounded="rounded-[1.25rem]"
          />
        </div>

        <SkeletonBlock block-class="h-[4.5rem] w-full" rounded="rounded-[1.25rem]" />

        <div class="grid grid-cols-1 gap-6 pt-2">
          <div v-for="section in 3" :key="section" class="flex flex-col gap-3 pt-5">
            <SkeletonBlock block-class="h-5 w-28" rounded="rounded-md" />
            <SkeletonBlock block-class="h-4 w-full" />
            <SkeletonBlock block-class="h-4 w-full" />
            <SkeletonBlock block-class="h-4 w-5/6" />

            <div v-if="section === 2" class="flex flex-wrap gap-2 pt-1">
              <SkeletonBlock
                v-for="chip in 5"
                :key="chip"
                block-class="h-7 w-16"
                rounded="rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
