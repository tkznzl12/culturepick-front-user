<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  MyPageServiceError,
  getMyInterests,
  getMyPosts,
  getMyProfile,
  getMyWatchlist,
} from '@/api/mypage.service'
import FavoritePerformancesSection from '@/components/mypage/FavoritePerformancesSection.vue'
import MyPostsSection from '@/components/mypage/MyPostsSection.vue'
import PlannedPerformancesSection from '@/components/mypage/PlannedPerformancesSection.vue'
import SkeletonBlock from '@/components/skeleton/SkeletonBlock.vue'
import UserProfileCard from '@/components/mypage/UserProfileCard.vue'
import { SiteRouter } from '@/constants/routes'
import type { FavoritePerformance, MyPageTab, MyPost, PlannedPerformance, UserProfile } from '@/types/mypage'
import { AUTH_CHANGED_EVENT, getAccessToken } from '@/utils/auth-cookie'
import { createLoginLocationWithRedirect } from '@/utils/auth-redirect'
import { isUnauthorizedRedirectError } from '@/utils/auth-session'

const router = useRouter()
const activeTab = ref<MyPageTab>('favorite')
const isLoading = ref(false)
const errorMessage = ref('')

const profile = ref<UserProfile>({
  nickname: '',
  joinedAt: '',
})
const interestItems = ref<FavoritePerformance[]>([])
const watchlistItems = ref<PlannedPerformance[]>([])
const myPostItems = ref<MyPost[]>([])

const interestTotal = ref(0)
const watchlistTotal = ref(0)
const myPostsTotal = ref(0)

const profileStats = computed(() => [
  { key: 'favorite', label: '좋아요 한 공연', count: interestTotal.value },
  { key: 'planned', label: '볼 예정 공연', count: watchlistTotal.value },
  { key: 'posts', label: '내가 작성한 글', count: myPostsTotal.value },
] as const)

async function ensureAuthenticated() {
  if (!getAccessToken()) {
    await router.replace(createLoginLocationWithRedirect(SiteRouter.mypage))
  }
}

onMounted(() => {
  void ensureAuthenticated()
  window.addEventListener(AUTH_CHANGED_EVENT, ensureAuthenticated)

  if (!getAccessToken()) {
    return
  }

  void loadMyPageData()
})

onBeforeUnmount(() => {
  window.removeEventListener(AUTH_CHANGED_EVENT, ensureAuthenticated)
})

async function loadMyPageData() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const [profileResponse, interestsResponse, watchlistResponse, postsResponse] =
      await Promise.all([
        getMyProfile(),
        getMyInterests(),
        getMyWatchlist(),
        getMyPosts(),
      ])

    profile.value = profileResponse
    interestItems.value = interestsResponse.items
    watchlistItems.value = watchlistResponse.items
    myPostItems.value = postsResponse.items

    interestTotal.value = interestsResponse.total
    watchlistTotal.value = watchlistResponse.total
    myPostsTotal.value = postsResponse.total
  } catch (error) {
    if (isUnauthorizedRedirectError(error)) {
      return
    }

    if (error instanceof MyPageServiceError && error.status === 401) {
      await router.replace(createLoginLocationWithRedirect(SiteRouter.mypage))
      return
    }

    console.error('마이페이지 데이터 조회 실패:', error)
    errorMessage.value = '마이페이지 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="mypage-view w-full py-8 sm:py-14">
    <div class="mx-auto w-full max-w-[var(--max-width)] px-4 sm:px-6">
      <div class="mx-auto w-full">
        <template v-if="isLoading">
          <section
            class="rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--card-background-color)] p-5 sm:p-6"
            role="status"
            aria-live="polite"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex min-w-0 items-start gap-3">
                <SkeletonBlock rounded="rounded-full" block-class="h-9 w-9 shrink-0" />
                <div class="min-w-0">
                  <SkeletonBlock rounded="rounded-md" block-class="h-6 w-28" />
                  <SkeletonBlock rounded="rounded-md" block-class="mt-2 h-4 w-40" />
                </div>
              </div>
              <SkeletonBlock rounded="rounded-full" block-class="h-9 w-9 shrink-0" />
            </div>

            <div class="mt-5 grid grid-cols-3 gap-3 max-[768px]:grid-cols-1">
              <SkeletonBlock
                v-for="index in 3"
                :key="`mypage-stat-skeleton-${index}`"
                rounded="rounded-xl"
                block-class="h-[92px] w-full"
              />
            </div>
          </section>

          <section class="mt-6">
            <div class="space-y-3">
              <SkeletonBlock
                v-for="index in 3"
                :key="`mypage-content-skeleton-${index}`"
                rounded="rounded-xl"
                block-class="h-24 w-full"
              />
            </div>
          </section>
        </template>

        <template v-else>
          <UserProfileCard
            :profile="profile"
            :stats="[...profileStats]"
            :active-tab="activeTab"
            @change-tab="activeTab = $event"
          />

          <p v-if="errorMessage" class="mt-4 text-sm text-[var(--red-tag-font-color)]" role="alert">
            {{ errorMessage }}
          </p>

          <section class="mt-6">
            <KeepAlive>
              <FavoritePerformancesSection
                v-if="activeTab === 'favorite'"
                :items="interestItems"
                :total-count="interestTotal"
              />
              <PlannedPerformancesSection
                v-else-if="activeTab === 'planned'"
                :items="watchlistItems"
                :total-count="watchlistTotal"
              />
              <MyPostsSection
                v-else
                :items="myPostItems"
                :total-count="myPostsTotal"
              />
            </KeepAlive>
          </section>
        </template>
      </div>
    </div>
  </section>
</template>
