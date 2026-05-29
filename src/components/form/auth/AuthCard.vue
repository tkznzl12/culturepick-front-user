<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <section class="auth-card">
    <header class="auth-card__header">
      <h1 class="auth-card__title">{{ title }}</h1>
      <p class="auth-card__subtitle">{{ subtitle }}</p>
    </header>

    <div v-if="$slots.prepend" class="auth-card__prepend">
      <slot name="prepend" />
    </div>

    <div class="auth-card__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="auth-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.auth-card {
  width: min(100%, 28rem);
  padding: 2rem 2.06rem 2.06rem;
  color: var(--line-component-font-color);
  background-color: var(--card-background-color);
  border: 1px solid var(--input-border-color);
  border-radius: 1.25rem;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.35);
}

.auth-card__header {
  text-align: center;
}

.auth-card__title {
  margin: 0 0 0.375rem;
  font-size: 1.625rem;
  font-weight: var(--font-weight-semibold);
  color: var(--dark-mode-main-font-color);
}

.auth-card__subtitle {
  margin: 0;
  font-size: var(--font-size-body);
  line-height: 1.5;
  color: var(--caption-text-color);
}

.auth-card__prepend {
  margin-top: 1.5rem;
}

.auth-card__prepend :deep(.auth-divider) {
  margin-bottom: 0;
}

.auth-card__body {
  margin-top: 1.5rem;
}

.auth-card__prepend + .auth-card__body {
  margin-top: 0;
}

.auth-card__footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: var(--font-size-body);
  color: var(--caption-text-color);
}

.auth-card__footer :deep(a) {
  margin-left: 0.25rem;
  color: var(--color-secondary);
  font-weight: var(--font-weight-medium);
}

.auth-card__footer :deep(a:hover) {
  color: var(--hover-point-text);
}
</style>
