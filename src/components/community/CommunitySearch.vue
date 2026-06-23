<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import searchIcon from '@/assets/icons/search-icon.svg'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const localValue = ref(props.modelValue)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.modelValue,
  (value) => {
    localValue.value = value
  },
)

watch(localValue, (value) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    emit('update:modelValue', value)
  }, 300)
})

onBeforeUnmount(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<template>
  <label
    class="community-search flex min-w-0 items-center gap-3 rounded-full border border-[var(--line-component-border-color)] bg-[#16161a] px-4 py-2.5"
    for="community-search-input"
  >
    <img :src="searchIcon" alt="" width="16" height="16" class="shrink-0 opacity-70" />
    <input
      id="community-search-input"
      v-model="localValue"
      type="search"
      name="community-search"
      placeholder="제목 또는 내용으로 검색"
      class="min-w-0 flex-1 border-none bg-transparent py-1 text-sm text-[var(--dark-mode-main-font-color)] placeholder:text-[var(--line-component-font-color)]"
    />
  </label>
</template>

<style scoped>
@media (max-width: 767px) {
  .community-search {
    min-height: 2.75rem;
  }
}
</style>
