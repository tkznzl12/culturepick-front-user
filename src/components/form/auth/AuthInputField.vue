<script setup lang="ts">
defineProps<{
  id: string
  label: string
  modelValue: string
  icon: string
  type?: string
  placeholder?: string
  autocomplete?: string
  error?: string
  success?: boolean
  showToggle?: boolean
  visible?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  toggleVisibility: []
}>()
</script>

<template>
  <div class="auth-field">
    <label :for="id" class="auth-field__label">{{ label }}</label>

    <div
      class="auth-field__input-wrap"
      :class="{ 'auth-field__input-wrap--success': success }"
    >
      <img :src="icon" alt="" class="auth-field__icon" width="15" height="15" />

      <input
        :id="id"
        :type="type"
        class="auth-field__input"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <button
        v-if="showToggle"
        type="button"
        class="auth-field__toggle"
        :aria-label="visible ? '비밀번호 숨기기' : '비밀번호 보기'"
        @click="emit('toggleVisibility')"
      >
        <slot name="toggle-icon" />
      </button>
    </div>

    <p v-if="error" class="auth-field__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.auth-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.auth-field__label {
  font-size: var(--font-size-body);
  color: var(--line-component-font-color);
}

.auth-field__input-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--input-border-color);
  border-radius: 0.875rem;
  background-color: var(--input-background-color);
  transition: border-color 0.2s ease;
}

.auth-field__input-wrap:focus-within {
  border-color: rgba(81, 162, 255, 0.45);
}

.auth-field__input-wrap--success {
  border-color: #00d492;
}

.auth-field__icon {
  flex-shrink: 0;
  width: 0.9375rem;
  height: 0.9375rem;
}

.auth-field__input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--dark-mode-main-font-color);
  font-size: var(--font-size-body);
}

.auth-field__input::placeholder {
  color: var(--caption-text-color);
}

.auth-field__toggle {
  flex-shrink: 0;
  width: 0.9375rem;
  height: 0.9375rem;
  padding: 0;
  border: none;
  background: transparent;
}

.auth-field__toggle :deep(img) {
  display: block;
  width: 0.9375rem;
  height: 0.9375rem;
}

.auth-field__error {
  margin: 0;
  font-size: var(--font-size-caption);
  color: #fb2c36;
}
</style>
