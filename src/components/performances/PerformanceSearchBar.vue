<script setup lang="ts">
import { ref, watch } from 'vue'
import searchIcon from '@/assets/icons/search-icon.svg'

const props = defineProps<{
  keyword?: string
  syncToken?: string
}>()

const emit = defineEmits<{
  search: [keyword: string]
}>()

const searchInput = ref('')

watch(
  () => [props.keyword, props.syncToken],
  ([keyword]) => {
    searchInput.value = keyword ?? ''
  },
  { immediate: true },
)

function onSubmit() {
  emit('search', searchInput.value)
}
</script>

<template>
  <form
    class="performance-search flex w-full max-w-[min(100%,40rem)] flex-col gap-2 sm:flex-row sm:items-center"
    role="search"
    @submit.prevent="onSubmit"
  >
    <div
      class="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[var(--line-component-border-color)] bg-[#16161a] px-4 py-2"
    >
      <img :src="searchIcon" alt="" width="16" height="16" class="shrink-0 opacity-70" />
      <input
        v-model="searchInput"
        type="search"
        name="keyword"
        placeholder="공연명, 공연장 검색"
        class="min-w-0 flex-1 border-none bg-transparent py-1 text-sm text-[var(--dark-mode-main-font-color)] placeholder:text-[var(--line-component-font-color)]"
      />
    </div>
    <button
      type="submit"
      class="performance-search__submit shrink-0 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
    >
      검색
    </button>
  </form>
</template>

<style scoped>
.performance-search__submit {
  background: var(--gradient-button);
}

@media (max-width: 767px) {
  .performance-search__submit {
    min-height: 2.75rem;
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
  }
}
</style>
