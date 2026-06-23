<script setup lang="ts">
import { computed, ref } from 'vue'
import FavoritePerformancesSection from '@/components/mypage/FavoritePerformancesSection.vue'
import MyPageTabNavigation from '@/components/mypage/MyPageTabNavigation.vue'
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

const currentSectionKey = computed(() => activeTab.value)
</script>

<template>
  <section class="mypage-view w-full py-8 sm:py-14">
    <div class="mx-auto w-full max-w-[var(--max-width)] px-4 sm:px-6">
      <div class="mx-auto w-full max-w-[960px]">
        <UserProfileCard
          :profile="myPageUserProfile"
          :stats="[...profileStats]"
          :active-tab="activeTab"
          @change-tab="activeTab = $event"
        />

      

        <section class="mt-6">
          <Transition name="mypage-content" mode="out-in">
            <FavoritePerformancesSection
              v-if="activeTab === 'favorite'"
              :key="currentSectionKey"
              :items="favoritePerformancesMock"
            />
            <PlannedPerformancesSection
              v-else-if="activeTab === 'planned'"
              :key="currentSectionKey"
              :items="plannedPerformancesMock"
            />
            <MyPostsSection v-else :key="currentSectionKey" :items="myPostsMock" />
          </Transition>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mypage-content-enter-active,
.mypage-content-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.mypage-content-enter-from,
.mypage-content-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
