<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import IconAi from '@/components/icons/IconAi.vue'
import { HERO_BG_HEIGHT, HERO_BG_WEBP, HERO_BG_WIDTH } from '@/constants/hero'
import searchIcon from '@/assets/icons/search-icon.svg'
import { buildSearchRoute } from '@/utils/search-route'

const HeroFloatingButtons = defineAsyncComponent(
  () => import('@/components/layout/HeroFloatingButtons.vue'),
)

const router = useRouter()
const heroSearchQuery = ref('')

function onHeroSearchSubmit() {
  const keyword = heroSearchQuery.value.trim()
  if (!keyword) return
  router.push(buildSearchRoute(keyword))
}

function onAiRecommend() {
  // TODO: AI 추천 페이지 이동
}

function onProfile() {
  // TODO: 마이페이지 이동
}

function onSupport() {
  // TODO: 고객지원 이동
}
</script>

<template>
  <section class="home-hero relative flex min-h-[calc(100dvh-4rem)] w-full flex-col overflow-hidden">
    <img
      :src="HERO_BG_WEBP"
      alt=""
      class="home-hero__bg absolute inset-0 h-full w-full object-cover object-center"
      :width="HERO_BG_WIDTH"
      :height="HERO_BG_HEIGHT"
      fetchpriority="high"
      decoding="async"
    />
    <div class="home-hero__overlay absolute inset-0" aria-hidden="true" />

    <div
      class="home-hero__content relative z-[1] mx-auto flex w-full max-w-[var(--max-width)] flex-1 flex-col items-center justify-center px-4 py-10 text-center sm:px-6 sm:py-16"
    >
      <div
        class="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--blue-tag-border-color)] bg-[var(--blue-tag-background-color)] px-3 py-2 text-xs font-medium text-[var(--blue-tag-font-color)] sm:px-4 sm:text-sm"
      >
        <IconAi class="block shrink-0 text-[14px]" />
        <span>AI가 나에게 맞는 공연을 추천해드려요</span>
      </div>

      <h1 class="mb-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
        <span class="block text-[var(--dark-mode-main-font-color)]">오늘, 어떤 공연을</span>
        <span
          class="block bg-[linear-gradient(90deg,_#51A2FF_0%,_#74D4FF_100%)] bg-clip-text text-transparent"
        >
          경험하고 싶으신가요?
        </span>
      </h1>

      <p
        class="mb-10 max-w-2xl text-sm leading-relaxed text-[var(--dark-mode-content-font-color)] sm:text-lg"
      >
        국내 모든 공연 정보를 한 곳에서.
        <br />
        뮤지컬, 콘서트, 전시, 연극까지 내가 원하는 공연을 찾아보세요.
      </p>

      <form
        class="home-hero__search w-full max-w-3xl"
        role="search"
        @submit.prevent="onHeroSearchSubmit"
      >
        <div
          class="flex flex-col gap-3 rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] p-2 backdrop-blur-md sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:p-2 sm:pl-6"
        >
          <div class="flex min-w-0 flex-1 items-center gap-3 px-2 sm:px-0">
            <img :src="searchIcon" alt="" width="18" height="18" class="block shrink-0" />
            <input
              v-model="heroSearchQuery"
              type="search"
              name="q"
              placeholder="공연 제목, 아티스트, 장소를 검색해보세요"
              class="min-w-0 flex-1 border-none bg-transparent py-2 text-left text-sm text-[var(--dark-mode-main-font-color)] placeholder:text-[var(--line-component-font-color)] sm:text-base"
            />
          </div>
          <button
            type="submit"
            class="home-hero__search-btn shrink-0 rounded-full px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:py-2.5"
          >
            검색
          </button>
        </div>
      </form>
    </div>

    <HeroFloatingButtons
      @ai-recommend="onAiRecommend"
      @profile="onProfile"
      @support="onSupport"
    />
  </section>
</template>

<style scoped>
.home-hero__overlay {
  background: linear-gradient(
    180deg,
    rgb(10 10 15 / 0.55) 0%,
    rgb(10 10 15 / 0.72) 45%,
    rgb(10 10 15 / 0.88) 100%
  );
}

.home-hero__search input:focus {
  outline: none;
}

.home-hero__search-btn {
  background: var(--gradient-button);
}

@media (max-width: 767px) {
  .home-hero__search-btn {
    min-height: 2.75rem;
  }
}
</style>
