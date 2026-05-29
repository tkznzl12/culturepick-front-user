<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <div
    class="default-layout flex min-h-screen flex-col font-sans antialiased bg-[var(--dark-mode-background-color)] text-[var(--dark-mode-main-font-color)]"
  >
    <AppNavbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
