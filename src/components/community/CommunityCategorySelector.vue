<script setup lang="ts">
export type CommunityCategory = 'review' | 'recommend' | 'info' | 'free'

interface CategoryOption {
  value: CommunityCategory
  label: string
}

defineProps<{
  modelValue: CommunityCategory | null
  options: ReadonlyArray<CategoryOption>
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CommunityCategory]
}>()
</script>

<template>
  <div>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="community-category-selector__option"
        :class="{ 'community-category-selector__option--active': modelValue === option.value }"
        @click="emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
    <p v-if="error" class="mt-2 text-xs text-[var(--red-tag-font-color)]">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.community-category-selector__option {
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.875rem;
  border: 1px solid var(--line-component-border-color);
  background-color: var(--line-component-background-color);
  color: var(--dark-mode-content-font-color);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.community-category-selector__option:hover {
  border-color: var(--hover-point-text);
  color: var(--hover-point-text);
}

.community-category-selector__option--active {
  border-color: transparent;
  background: var(--gradient-button);
  color: var(--dark-mode-main-font-color);
}
</style>
