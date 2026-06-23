<script setup lang="ts">
import type { MyPageTab, UserProfile } from '@/mocks/mypage.mock'

interface StatItem {
  key: MyPageTab
  label: string
  count: number
}

defineProps<{
  profile: UserProfile
  stats: StatItem[]
  activeTab: MyPageTab
}>()

const emit = defineEmits<{
  changeTab: [tab: MyPageTab]
}>()
</script>

<template>
  <section
    class="rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--card-background-color)] p-5 sm:p-6"
  >
    <header class="flex items-start justify-between gap-4">
      <div class="flex min-w-0 items-start gap-3">
        <div
          class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--blue-tag-background-color)] text-sm font-semibold text-[var(--blue-tag-font-color)]"
          aria-hidden="true"
        >
          정
        </div>
        <div class="min-w-0">
          <h1 class="truncate text-xl font-bold text-[var(--dark-mode-main-font-color)]">
            {{ profile.nickname }}
          </h1>
          <p class="mt-1 text-sm text-[var(--caption-text-color)]">가입일 {{ profile.joinedAt }}</p>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] text-[var(--line-component-font-color)] transition-colors hover:border-[var(--hover-point-text)] hover:text-[var(--hover-point-text)]"
        aria-label="설정"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 .99-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51.99H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
          />
        </svg>
      </button>
    </header>

    <div class="mt-5 grid grid-cols-3 gap-3 max-[768px]:grid-cols-1">
      <button
        v-for="item in stats"
        :key="item.key"
        type="button"
        class="rounded-xl border px-3 py-3 text-left transition-colors"
        :class="
          activeTab === item.key
            ? 'border-[var(--color-primary)] bg-[var(--filter-toggle-active-background-color)]'
            : 'border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] hover:border-[var(--hover-point-text)]'
        "
        @click="emit('changeTab', item.key)"
      >
        <p class="text-center text-2xl font-bold text-[var(--dark-mode-main-font-color)]">
          {{ item.count }}
        </p>
        <p class="mt-1 text-center text-sm text-[var(--dark-mode-content-font-color)]">
          {{ item.label }}
        </p>
      </button>
    </div>
  </section>
</template>
