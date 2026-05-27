<script setup lang="ts">
import { computed } from 'vue'
import { getTagLabel } from '@/constants/cardTag'
import type { TagType } from '@/types/tag'

const props = defineProps<{
  tag: TagType
}>()

const label = computed(() => getTagLabel(props.tag))
</script>

<template>
  <span class="card-tag" :class="`card-tag--${tag}`">
    {{ label }}
  </span>
</template>

<style scoped>
.card-tag {
  display: inline-flex;
  padding: 0.1875rem 0.50781rem;
  justify-content: center;
  align-items: center;
  border-radius: 50rem;
  font-size: var(--font-size-caption);
}

.card-tag--musical {
  color: var(--blue-tag-font-color);
  border: 1px solid var(--blue-tag-border-color);
  background-color: var(--blue-tag-background-color);
}

.card-tag--play {
  color: var(--mint-tag-font-color);
  border: 1px solid var(--mint-tag-border-color);
  background-color: var(--mint-tag-background-color);
}

.card-tag--classic {
  color: var(--yellow-tag-font-color);
  border: 1px solid var(--yellow-tag-border-color);
  background-color: var(--yellow-tag-background-color);
}

.card-tag--koreanMusic {
  color: var(--green-tag-font-color);
  border: 1px solid var(--green-tag-border-color);
  background-color: var(--green-tag-background-color);
}

.card-tag--concert {
  color: var(--pink-tag-font-color);
  border: 1px solid var(--pink-tag-border-color);
  background-color: var(--pink-tag-background-color);
}

.card-tag--dancing {
  color: var(--red-tag-font-color);
  border: 1px solid var(--red-tag-border-color);
  background-color: var(--red-tag-background-color);
}

.card-tag--upcomming {
  color: var(--blue-tag-font-color);
  background-color: var(--blue-tag-background-color);
}

.card-tag--performing {
  color: var(--green-tag-font-color);
  background-color: var(--green-tag-background-color);
}

.card-tag--done {
  color: var(--gray-tag-font-color);
  background-color: var(--gray-tag-background-color);
}
</style>
