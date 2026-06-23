<script setup lang="ts">
import { computed, ref } from 'vue'
import FavoritePerformancesSection from '@/components/mypage/FavoritePerformancesSection.vue'
import MyPostsSection from '@/components/mypage/MyPostsSection.vue'
import PlannedPerformancesSection from '@/components/mypage/PlannedPerformancesSection.vue'
import UserProfileCard from '@/components/mypage/UserProfileCard.vue'
import {
  favoritePerformancesMock,
  myPageUserProfile,
  myPostsMock,
  plannedPerformancesMock,
  type MyPageTab,
} from '@/mocks/mypage.mock'

const activeTab = ref<MyPageTab>('favorite')

const tabItems = [
  { key: 'favorite', label: '좋아요 한 공연' },
  { key: 'planned', label: '볼 예정 공연' },
  { key: 'posts', label: '내가 작성한 글' },
] as const satisfies ReadonlyArray<{ key: MyPageTab; label: string }>

const profileStats = computed(() => [
  { key: 'favorite', label: '좋아요 한 공연', count: favoritePerformancesMock.length },
  { key: 'planned', label: '볼 예정 공연', count: plannedPerformancesMock.length },
  { key: 'posts', label: '내가 작성한 글', count: myPostsMock.length },
] as const)
</script>

<template>
  <section class="mypage-view w-full py-8 sm:py-14">
    <div class="mx-auto w-full max-w-[var(--max-width)] px-4 sm:px-6">
      <div class="mx-auto w-full">
        <UserProfileCard
          :profile="myPageUserProfile"
          :stats="[...profileStats]"
          :active-tab="activeTab"
          @change-tab="activeTab = $event"
        />

      

        <section class="mt-6">
          <KeepAlive>
            <FavoritePerformancesSection v-if="activeTab === 'favorite'" :items="favoritePerformancesMock" />
            <PlannedPerformancesSection v-else-if="activeTab === 'planned'" :items="plannedPerformancesMock" />
            <MyPostsSection v-else :items="myPostsMock" />
          </KeepAlive>
        </section>
      </div>
    </div>
  </section>
</template>
