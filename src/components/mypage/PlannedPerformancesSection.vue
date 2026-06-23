<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'
import { SiteRouter } from '@/constants/routes'
import type { PlannedPerformance } from '@/types/mypage'

const props = defineProps<{
  items: PlannedPerformance[]
  totalCount: number
}>()

const scheduledItems = computed(() => props.items.filter((item) => item.status === 'scheduled'))
const ongoingItems = computed(() => props.items.filter((item) => item.status === 'ongoing'))
const endedItems = computed(() => props.items.filter((item) => item.status === 'ended'))
</script>

<template>
  <section>
    <header class="mb-4 flex items-center justify-between gap-3">
      <h2 class="text-xl font-bold text-[var(--dark-mode-main-font-color)]">
        볼 예정 공연 {{ totalCount }}
      </h2>

    </header>

    <div class="space-y-6">
      <section>
        <h3 class="mb-3 text-sm font-semibold text-[var(--dark-mode-main-font-color)]">
          공연예정 {{ scheduledItems.length }}
        </h3>
        <div v-if="scheduledItems.length > 0" class="space-y-3">
          <RouterLink
            v-for="item in scheduledItems"
            :key="item.id"
            :to="SiteRouter.performances(item.id)"
            class="mypage-planned-item"
          >
            <div class="min-w-0">
              <p class="truncate text-base font-semibold text-[var(--dark-mode-main-font-color)]">
                {{ item.title }}
              </p>
              <p class="mt-1 text-sm text-[var(--caption-text-color)]">
                {{ item.venue || '공연장 정보 확인' }} · {{ item.startDate }} ~ {{ item.endDate }}
              </p>
            </div>
            <span class="mypage-planned-badge mypage-planned-badge--scheduled">예정</span>
          </RouterLink>
        </div>
        <p
          v-else
          class="p-1 text-sm text-[var(--caption-text-color)]"
        >
          예정된 공연이 없습니다.
        </p>
      </section>

      <section>
        <h3 class="mb-3 text-sm font-semibold text-[var(--dark-mode-main-font-color)]">
          진행중 {{ ongoingItems.length }}
        </h3>
        <div v-if="ongoingItems.length > 0" class="space-y-3">
          <RouterLink
            v-for="item in ongoingItems"
            :key="item.id"
            :to="SiteRouter.performances(item.id)"
            class="mypage-planned-item"
          >
            <div class="min-w-0">
              <p class="truncate text-base font-semibold text-[var(--dark-mode-main-font-color)]">
                {{ item.title }}
              </p>
              <p class="mt-1 text-sm text-[var(--caption-text-color)]">
                {{ item.venue || '공연장 정보 확인' }} · {{ item.startDate }} ~ {{ item.endDate }}
              </p>
            </div>
            <span class="mypage-planned-badge mypage-planned-badge--ongoing">진행중</span>
          </RouterLink>
        </div>
        <p
          v-else
          class="p-1 text-sm text-[var(--caption-text-color)]"
        >
          진행중인 공연이 없습니다.
        </p>
      </section>

      <section>
        <h3 class="mb-3 text-sm font-semibold text-[var(--dark-mode-main-font-color)]">
          공연종료 {{ endedItems.length }}
        </h3>
        <div v-if="endedItems.length > 0" class="space-y-3">
          <RouterLink
            v-for="item in endedItems"
            :key="item.id"
            :to="SiteRouter.performances(item.id)"
            class="mypage-planned-item"
          >
            <div class="min-w-0">
              <p class="truncate text-base font-semibold text-[var(--dark-mode-main-font-color)]">
                {{ item.title }}
              </p>
              <p class="mt-1 text-sm text-[var(--caption-text-color)]">
                {{ item.venue || '공연장 정보 확인' }} · {{ item.startDate }} ~ {{ item.endDate }}
              </p>
            </div>
            <span class="mypage-planned-badge mypage-planned-badge--ended">종료</span>
          </RouterLink>
        </div>
        <p
          v-else
          class="p-1 text-sm text-[var(--caption-text-color)]"
        >
          종료된 공연이 없습니다.
        </p>
      </section>
    </div>
  </section>
</template>

<style scoped>
.mypage-planned-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid var(--line-component-border-color);
  border-radius: 0.875rem;
  padding: 0.875rem 1rem;
  background-color: var(--card-background-color);
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.mypage-planned-item:hover {
  border-color: var(--hover-point-text);
  transform: translateY(-1px);
}

.mypage-planned-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3.25rem;
  border-radius: 9999px;
  border: 1px solid transparent;
  padding: 0.25rem 0.625rem;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-medium);
}

.mypage-planned-badge--ongoing {
  color: var(--green-tag-font-color);
  border-color: var(--green-tag-border-color);
  background-color: var(--green-tag-background-color);
}

.mypage-planned-badge--scheduled {
  color: var(--blue-tag-font-color);
  border-color: var(--blue-tag-border-color);
  background-color: var(--blue-tag-background-color);
}

.mypage-planned-badge--ended {
  color: var(--gray-tag-font-color);
  border-color: var(--gray-tag-border-color);
  background-color: var(--gray-tag-background-color);
}

@media (max-width: 768px) {
  .mypage-planned-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
