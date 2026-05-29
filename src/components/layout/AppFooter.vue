<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { genreList } from '@/constants'
import { SiteRouter } from '@/constants/routes'
import logo from '@/assets/logo.svg'

const currentYear = new Date().getFullYear()

function toGenreRoute(code: string): RouteLocationRaw {
  return { path: SiteRouter.performanceList, query: { genre: code } }
}

const legalLinks = [
  { key: 'terms', label: '이용약관', to: '#' },
  { key: 'privacy', label: '개인정보처리방침', to: '#' },
  { key: 'business', label: '사업자정보', to: '#' },
] as const
</script>

<template>
  <footer class="app-footer mt-auto border-t border-[var(--line-component-border-color)] bg-[var(--dark-mode-background-color)]">
    <div class="mx-auto w-full max-w-[var(--max-width)] px-6 py-12">
      <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div class="flex flex-col gap-4">
          <RouterLink to="/" class="inline-flex w-fit" aria-label="컬처픽 홈">
            <img :src="logo" alt="컬처픽" class="h-8 w-auto" width="120" height="32" />
          </RouterLink>
          <p class="max-w-xs text-sm leading-relaxed text-[var(--caption-text-color)]">
            국내 모든 공연 정보를 한 곳에서.
            <br />
            AI와 함께 나만의 공연을 찾아보세요.
          </p>
        </div>

        <div>
          <h2 class="mb-4 text-sm font-semibold text-[var(--dark-mode-main-font-color)]">
            공연 카테고리
          </h2>
          <ul class="flex flex-col gap-2.5">
            <li v-for="genre in genreList" :key="genre.name">
              <RouterLink
                :to="toGenreRoute(genre.code)"
                class="text-sm text-[var(--caption-text-color)] transition-colors hover:text-[var(--hover-point-text)]"
              >
                {{ genre.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="mb-4 text-sm font-semibold text-[var(--dark-mode-main-font-color)]">서비스</h2>
          <ul class="flex flex-col gap-2.5">
            <li>
              <RouterLink
                to="/"
                class="text-sm text-[var(--caption-text-color)] transition-colors hover:text-[var(--hover-point-text)]"
              >
                AI 추천
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="mb-4 text-sm font-semibold text-[var(--dark-mode-main-font-color)]">고객지원</h2>
          <ul class="flex flex-col gap-2 text-sm text-[var(--caption-text-color)]">
            <li>이메일: support@culturepick.kr</li>
            <li>운영시간: 평일 10:00~18:00</li>
          </ul>
          <a
            href="#"
            class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--hover-point-text)]"
          >
            고객지원 바로가기 →
          </a>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--line-component-border-color)] pt-6 sm:flex-row sm:items-center"
      >
        <p class="text-sm text-[var(--caption-text-color)]">
          © {{ currentYear }} 컬처픽. All rights reserved.
        </p>
        <nav class="flex flex-wrap gap-x-6 gap-y-2" aria-label="법적 고지">
          <a
            v-for="link in legalLinks"
            :key="link.key"
            :href="link.to"
            class="text-sm text-[var(--caption-text-color)] transition-colors hover:text-[var(--hover-point-text)]"
          >
            {{ link.label }}
          </a>
        </nav>
      </div>
    </div>
  </footer>
</template>
