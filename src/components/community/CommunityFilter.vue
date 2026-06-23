<script setup lang="ts">
type CommunityCategoryValue = 'all' | 'review' | 'recommend' | 'info' | 'free'

interface CommunityCategoryOption {
  value: CommunityCategoryValue
  label: string
}

defineProps<{
  categories: ReadonlyArray<CommunityCategoryOption>
  selectedCategory: CommunityCategoryValue
}>()

const emit = defineEmits<{
  select: [category: CommunityCategoryValue]
}>()
</script>

<template>
  <div class="community-filter flex flex-wrap gap-2">
    <button
      v-for="category in categories"
      :key="category.value"
      type="button"
      class="community-filter__pill"
      :class="{ 'community-filter__pill--active': selectedCategory === category.value }"
      @click="emit('select', category.value)"
    >
      {{ category.label }}
    </button>
  </div>
</template>

<style scoped>
.community-filter__pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid var(--line-component-border-color);
  background-color: var(--line-component-background-color);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--dark-mode-content-font-color);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.community-filter__pill:hover {
  border-color: var(--hover-point-text);
  color: var(--hover-point-text);
}

.community-filter__pill--active {
  border-color: transparent;
  background: var(--gradient-button);
  color: #fff;
}

.community-filter__pill--active:hover {
  color: #fff;
}

@media (max-width: 767px) {
  .community-filter__pill {
    min-height: 2.75rem;
    padding: 0.5rem 0.875rem;
  }
}
</style>
