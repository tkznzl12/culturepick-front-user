<script setup lang="ts">
import { RouterLink } from 'vue-router'

type ButtonVariant = 'gradient' | 'line' | 'gradient-shadow' | 'gray-line'

withDefaults(
  defineProps<{
    variant: ButtonVariant
    text?: string
    href?: string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    disabled: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClassMap: Record<ButtonVariant, string> = {
  gradient: 'common-button--gradient',
  line: 'common-button--line',
  'gradient-shadow': 'common-button--gradient-shadow',
  'gray-line': 'common-button--gray-line',
}
</script>

<template>
  <RouterLink
    v-if="href"
    :to="href"
    class="common-button"
    :class="variantClassMap[variant]"
  >
    <slot name="icon" />
    {{ text }}
  </RouterLink>

  <button
    v-else
    class="common-button"
    :class="variantClassMap[variant]"
    :type="type"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <span v-if="$slots.icon" class="common-button__icon">
      <slot name="icon" />
    </span>
    {{ text }}
  </button>
</template>

<style scoped>
.common-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375em;
  height: fit-content;
  padding: 0.375em 0.75rem;
  border: none;
  border-radius: 50rem;
  font-weight: var(--font-weight-medium);
  color: var(--dark-mode-main-font-color);
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.common-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.common-button--gradient {
  background: var(--gradient-button);
}

.common-button--line {
  border: 1px solid var(--line-component-border-color);
  background-color: transparent;
}

.common-button--gradient-shadow {
  display: flex;
  width: 100%;
  max-width: 23.875rem;
  height: 2.75rem;
  padding: 0.75rem 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.875rem;
  background: linear-gradient(90deg, #155dfc 0%, #193cb8 100%);
  box-shadow:
    0 10px 15px -3px rgba(28, 57, 142, 0.4),
    0 4px 6px -4px rgba(28, 57, 142, 0.4);
}

.common-button--gray-line {
  padding: 0.5rem;
  border: 1px solid var(--line-component-border-color);
  background-color: var(--line-component-background-color);
}

.common-button__icon {
  position: relative;
  width: 0.875rem;
  height: 0.875rem;
}
</style>
