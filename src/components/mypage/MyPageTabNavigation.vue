<script setup lang="ts">
import type { MyPageTab } from '@/mocks/mypage.mock'

interface TabItem {
  key: MyPageTab
  label: string
}

defineProps<{
  activeTab: MyPageTab
  tabs: TabItem[]
}>()

const emit = defineEmits<{
  changeTab: [tab: MyPageTab]
}>()
</script>

<template>
  <nav
    class="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] p-2"
    aria-label="마이페이지 탭"
  >
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
      :class="
        activeTab === tab.key
          ? 'bg-[var(--color-primary)] text-[var(--dark-mode-main-font-color)]'
          : 'text-[var(--dark-mode-content-font-color)] hover:bg-[var(--line-component-background-color)] hover:text-[var(--dark-mode-main-font-color)]'
      "
      @click="emit('changeTab', tab.key)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>
