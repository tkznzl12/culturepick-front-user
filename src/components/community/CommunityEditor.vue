<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

export type CommunityEditorImageUploadHandler = (file: File) => Promise<string>

const props = withDefaults(
  defineProps<{
    modelValue?: string
    imageUploadEnabled?: boolean
    onImageUpload?: CommunityEditorImageUploadHandler
  }>(),
  {
    modelValue: '',
    imageUploadEnabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: { levels: [2, 3] },
    }),
    Placeholder.configure({
      placeholder:
        '공연 후기, 추천, 정보 등을 자유롭게 작성해주세요.\n\n최소 10자 이상 입력해주세요.',
    }),
    // 향후 이미지 업로드를 도입할 때 Image extension을 여기에 추가하면 된다.
  ],
  content: props.modelValue,
  editorProps: {
    attributes: {
      class: 'community-editor__prosemirror',
    },
  },
  onUpdate: ({ editor: currentEditor }) => {
    emit('update:modelValue', currentEditor.getHTML())
  },
})

watch(
  () => props.modelValue,
  (value) => {
    const currentEditor = editor.value
    if (!currentEditor) return

    const normalizedValue = value ?? ''
    if (normalizedValue === currentEditor.getHTML()) return
    currentEditor.commands.setContent(normalizedValue, { emitUpdate: false })
  },
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const toolbarItems = computed(() => [
  {
    key: 'bold',
    label: '굵게',
    isActive: () => Boolean(editor.value?.isActive('bold')),
    canRun: () => Boolean(editor.value?.can().chain().focus().toggleBold().run()),
    command: () => editor.value?.chain().focus().toggleBold().run(),
  },
  {
    key: 'italic',
    label: '기울임',
    isActive: () => Boolean(editor.value?.isActive('italic')),
    canRun: () => Boolean(editor.value?.can().chain().focus().toggleItalic().run()),
    command: () => editor.value?.chain().focus().toggleItalic().run(),
  },
  {
    key: 'strike',
    label: '취소선',
    isActive: () => Boolean(editor.value?.isActive('strike')),
    canRun: () => Boolean(editor.value?.can().chain().focus().toggleStrike().run()),
    command: () => editor.value?.chain().focus().toggleStrike().run(),
  },
  {
    key: 'h2',
    label: 'H2',
    isActive: () => Boolean(editor.value?.isActive('heading', { level: 2 })),
    canRun: () => Boolean(editor.value?.can().chain().focus().toggleHeading({ level: 2 }).run()),
    command: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    key: 'h3',
    label: 'H3',
    isActive: () => Boolean(editor.value?.isActive('heading', { level: 3 })),
    canRun: () => Boolean(editor.value?.can().chain().focus().toggleHeading({ level: 3 }).run()),
    command: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    key: 'bullet-list',
    label: '목록',
    isActive: () => Boolean(editor.value?.isActive('bulletList')),
    canRun: () => Boolean(editor.value?.can().chain().focus().toggleBulletList().run()),
    command: () => editor.value?.chain().focus().toggleBulletList().run(),
  },
  {
    key: 'ordered-list',
    label: '번호',
    isActive: () => Boolean(editor.value?.isActive('orderedList')),
    canRun: () => Boolean(editor.value?.can().chain().focus().toggleOrderedList().run()),
    command: () => editor.value?.chain().focus().toggleOrderedList().run(),
  },
  {
    key: 'blockquote',
    label: '인용',
    isActive: () => Boolean(editor.value?.isActive('blockquote')),
    canRun: () => Boolean(editor.value?.can().chain().focus().toggleBlockquote().run()),
    command: () => editor.value?.chain().focus().toggleBlockquote().run(),
  },
  {
    key: 'divider',
    label: '구분선',
    isActive: () => false,
    canRun: () => Boolean(editor.value?.can().chain().focus().setHorizontalRule().run()),
    command: () => editor.value?.chain().focus().setHorizontalRule().run(),
  },
])

const canUseImageUpload = computed(
  () => props.imageUploadEnabled && typeof props.onImageUpload === 'function',
)

function triggerImagePicker() {
  if (!canUseImageUpload.value) return
  fileInputRef.value?.click()
}

function insertImagePlaceholder(url: string) {
  const currentEditor = editor.value
  if (!currentEditor) return

  // TODO: Image extension 연결 시 아래 로직으로 교체 가능
  // currentEditor.chain().focus().setImage({ src: url }).run()
  currentEditor.chain().focus().insertContent(`<p>${url}</p>`).run()
}

async function onImageFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !props.onImageUpload) {
    input.value = ''
    return
  }

  try {
    const uploadedUrl = await props.onImageUpload(file)
    if (uploadedUrl) {
      insertImagePlaceholder(uploadedUrl)
    }
  } catch (error) {
    console.error('[community-editor] image upload failed:', error)
  } finally {
    input.value = ''
  }
}
</script>

<template>
  <div class="community-editor rounded-xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)]">
    <div class="community-editor__toolbar border-b border-[var(--line-component-border-color)] p-2">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in toolbarItems"
          :key="item.key"
          type="button"
          class="community-editor__tool-btn"
          :class="{ 'community-editor__tool-btn--active': item.isActive() }"
          :disabled="!item.canRun()"
          @click="item.command()"
        >
          {{ item.label }}
        </button>
        <button
          type="button"
          class="community-editor__tool-btn"
          :disabled="!canUseImageUpload"
          @click="triggerImagePicker"
        >
          이미지
        </button>
      </div>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onImageFileChange"
      />
    </div>

    <EditorContent :editor="editor" class="community-editor__content" />
  </div>
</template>

<style scoped>
.community-editor__tool-btn {
  border: 1px solid var(--line-component-border-color);
  background: transparent;
  color: var(--dark-mode-content-font-color);
  border-radius: 0.625rem;
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  font-weight: var(--font-weight-medium);
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease;
}

.community-editor__tool-btn:hover:not(:disabled) {
  border-color: var(--hover-point-text);
  color: var(--hover-point-text);
}

.community-editor__tool-btn--active {
  border-color: transparent;
  background: var(--gradient-button);
  color: var(--dark-mode-main-font-color);
}

.community-editor__tool-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.community-editor__content :deep(.community-editor__prosemirror) {
  min-height: 300px;
  padding: 1rem;
  color: var(--dark-mode-main-font-color);
  font-size: 0.875rem;
  line-height: 1.7;
}

.community-editor__content :deep(.community-editor__prosemirror:focus) {
  outline: none;
}

.community-editor__content :deep(.community-editor__prosemirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
  color: var(--line-component-font-color);
  white-space: pre-line;
}

.community-editor__content :deep(.community-editor__prosemirror h2) {
  margin: 1.25rem 0 0.75rem;
  font-size: 1.25rem;
  font-weight: var(--font-weight-bold);
}

.community-editor__content :deep(.community-editor__prosemirror h3) {
  margin: 1rem 0 0.625rem;
  font-size: 1.05rem;
  font-weight: var(--font-weight-semibold);
}

.community-editor__content :deep(.community-editor__prosemirror ul),
.community-editor__content :deep(.community-editor__prosemirror ol) {
  padding-left: 1.25rem;
}

.community-editor__content :deep(.community-editor__prosemirror blockquote) {
  margin: 0.75rem 0;
  border-left: 3px solid var(--line-component-border-color);
  padding-left: 0.75rem;
  color: var(--dark-mode-content-font-color);
}

.community-editor__content :deep(.community-editor__prosemirror hr) {
  margin: 0.875rem 0;
  border: 0;
  border-top: 1px solid var(--line-component-border-color);
}
</style>
