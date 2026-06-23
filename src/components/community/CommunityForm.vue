<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import CommonButton from '@/components/common/CommonButton.vue'
import CommunityCategorySelector, {
  type CommunityCategory,
} from '@/components/community/CommunityCategorySelector.vue'
import CommunityEditor, {
  type CommunityEditorImageUploadHandler,
} from '@/components/community/CommunityEditor.vue'

export interface CommunityFormValues {
  category: CommunityCategory | null
  title: string
  content: string
}

const props = withDefaults(
  defineProps<{
    initialValues?: Partial<CommunityFormValues>
    isEditMode: boolean
    imageUploadEnabled?: boolean
    onImageUpload?: CommunityEditorImageUploadHandler
  }>(),
  {
    initialValues: () => ({}),
    imageUploadEnabled: false,
  },
)

const emit = defineEmits<{
  submit: [values: CommunityFormValues]
  cancel: []
}>()

const categoryOptions = [
  { value: 'review', label: '공연후기' },
  { value: 'recommend', label: '공연추천' },
  { value: 'info', label: '정보공유' },
  { value: 'free', label: '자유토론' },
] as const

const form = reactive<CommunityFormValues>({
  category: null,
  title: '',
  content: '',
})

const errors = reactive({
  category: '',
  title: '',
  content: '',
})

const titleLength = computed(() => form.title.length)
const contentText = computed(() => extractPlainText(form.content))
const contentLength = computed(() => contentText.value.length)

watch(
  () => props.initialValues,
  (value) => {
    form.category = value.category ?? null
    form.title = value.title ?? ''
    form.content = value.content ?? ''
    clearErrors()
  },
  { immediate: true, deep: true },
)

function clearErrors() {
  errors.category = ''
  errors.title = ''
  errors.content = ''
}

function extractPlainText(html: string): string {
  if (!html) return ''

  const tempElement = document.createElement('div')
  tempElement.innerHTML = html
  return (tempElement.textContent || '').replace(/\u00a0/g, ' ').trim()
}

function validate() {
  clearErrors()
  let isValid = true

  if (!form.category) {
    errors.category = '카테고리를 선택해주세요.'
    isValid = false
  }

  if (!form.title.trim()) {
    errors.title = '제목을 입력해주세요.'
    isValid = false
  }

  const plainText = contentText.value

  if (!plainText) {
    errors.content = '내용을 입력해주세요.'
    isValid = false
  } else if (plainText.length < 10) {
    errors.content = '내용은 최소 10자 이상 입력해주세요.'
    isValid = false
  }

  return isValid
}

function onSubmit() {
  if (!validate()) return

  emit('submit', {
    category: form.category,
    title: form.title.trim().slice(0, 100),
    content: form.content,
  })
}
</script>

<template>
  <form
    class="rounded-3xl border border-[var(--line-component-border-color)] bg-[var(--card-background-color)] p-6"
    @submit.prevent="onSubmit"
  >
    <div class="space-y-6">
      <div>
        <label class="mb-2 block text-sm font-semibold text-[var(--dark-mode-main-font-color)]">
          카테고리
        </label>
        <CommunityCategorySelector
          v-model="form.category"
          :options="categoryOptions"
          :error="errors.category"
        />
      </div>

      <div>
        <div class="mb-2 flex items-center justify-between gap-2">
          <label
            for="community-form-title"
            class="text-sm font-semibold text-[var(--dark-mode-main-font-color)]"
          >
            제목
          </label>
          <span class="text-xs text-[var(--caption-text-color)]">{{ titleLength }} / 100</span>
        </div>
        <input
          id="community-form-title"
          v-model="form.title"
          type="text"
          maxlength="100"
          placeholder="게시글 제목을 입력해주세요."
          class="w-full rounded-xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] px-4 py-3 text-sm text-[var(--dark-mode-main-font-color)] placeholder:text-[var(--line-component-font-color)]"
        />
        <p v-if="errors.title" class="mt-2 text-xs text-[var(--red-tag-font-color)]">
          {{ errors.title }}
        </p>
      </div>

      <div>
        <div class="mb-2 flex items-center justify-between gap-2">
          <label class="text-sm font-semibold text-[var(--dark-mode-main-font-color)]">
            내용
          </label>
          <span class="text-xs text-[var(--caption-text-color)]">
            {{ contentLength }}
          </span>
        </div>
        <CommunityEditor
          v-model="form.content"
          :image-upload-enabled="imageUploadEnabled"
          :on-image-upload="onImageUpload"
        />
        <p v-if="errors.content" class="mt-2 text-xs text-[var(--red-tag-font-color)]">
          {{ errors.content }}
        </p>
      </div>
    </div>

    <div class="community-form__actions mt-8 flex justify-end gap-2">
      <CommonButton variant="line" text="취소" @click="emit('cancel')" />
      <CommonButton
        :variant="isEditMode ? 'line' : 'gradient'"
        :text="isEditMode ? '게시글 수정' : '게시글 등록'"
        type="submit"
      />
    </div>
  </form>
</template>

<style scoped>
@media (max-width: 767px) {
  .community-form__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .community-form__actions :deep(.common-button) {
    width: 100%;
    min-height: 2.75rem;
  }
}
</style>
