<script setup lang="ts">
import AppPagination from '@/components/common/AppPagination.vue'

defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()
</script>

<template>
  <AppPagination
    :current-page="currentPage"
    :total-pages="totalPages"
    @change="emit('change', $event)"
  />
</template>
