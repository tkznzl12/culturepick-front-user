<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
</script>

<template>
  <div class="min-h-screen bg-[var(--dark-mode-background-color)] text-[var(--dark-mode-main-font-color)]">
    <AppNavbar />
    <main>
      <RouterView />
    </main>
  </div>
</template>
