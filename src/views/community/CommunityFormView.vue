<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  CommunityServiceError,
  createPost,
  uploadCommunityImage,
} from '@/api/community.service'
import CommunityForm, {
  type CommunityFormValues,
} from '@/components/community/CommunityForm.vue'
import type { CommunityEditorImageUploadHandler } from '@/components/community/CommunityEditor.vue'
import { SiteRouter } from '@/constants/routes'
import { communityPosts } from '@/mocks/community.mock'
import type { CommunityApiCategory } from '@/types/community'
import { getAccessToken } from '@/utils/auth-cookie'

const router = useRouter()
const route = useRoute()

const currentUserId = 1

const isEditMode = computed(() => !!route.params.id)
const canAccessForm = computed(() => Boolean(getAccessToken()))
const isSubmitting = ref(false)
const submitErrorMessage = ref('')
const serverFieldErrors = ref<Partial<Record<'title' | 'content', string>>>({})
const COMMUNITY_AUTH_TOAST_KEY = 'community-auth-required-toast'

const targetPost = computed(() => {
  if (!isEditMode.value) return null

  const postId = Number(route.params.id)
  if (!Number.isFinite(postId)) return null
  return communityPosts.find((post) => post.id === postId) ?? null
})

const formInitialValues = computed<Partial<CommunityFormValues>>(() => {
  if (!targetPost.value) return {}

  return {
    category: targetPost.value.category,
    title: targetPost.value.title,
    content: targetPost.value.content,
  }
})

watchEffect(() => {
  if (!canAccessForm.value) {
    window.sessionStorage.setItem(COMMUNITY_AUTH_TOAST_KEY, '1')
    void router.replace(SiteRouter.community)
    return
  }

  if (!isEditMode.value) return

  if (!targetPost.value) {
    void router.replace(SiteRouter.community)
    return
  }

  if (targetPost.value.userId !== currentUserId) {
    void router.replace(SiteRouter.communityPost(targetPost.value.id))
  }
})

function onCancel() {
  if (isSubmitting.value) return
  router.back()
}

const categoryMap: Record<Exclude<CommunityFormValues['category'], null>, CommunityApiCategory> = {
  review: 'performance_review',
  recommend: 'performance_recommendation',
  info: 'information',
  free: 'free_discussion',
}

const onImageUpload: CommunityEditorImageUploadHandler = async (file) => {
  try {
    const response = await uploadCommunityImage(file)
    return response.image_url
  } catch (error) {
    if (error instanceof CommunityServiceError) {
      throw new Error(error.message)
    }
    throw new Error('이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.')
  }
}

async function onSubmit(values: CommunityFormValues) {
  if (!values.category) return

  isSubmitting.value = true
  submitErrorMessage.value = ''
  serverFieldErrors.value = {}

  try {
    const response = await createPost({
      category: categoryMap[values.category],
      title: values.title,
      content: values.content,
      content_format: 'html',
    })

    await router.push(SiteRouter.communityPost(response.id))
  } catch (error) {
    if (error instanceof CommunityServiceError) {
      if (error.status === 401) {
        submitErrorMessage.value = '로그인 후 이용 가능합니다.'
      } else if (error.status === 400) {
        serverFieldErrors.value = {
          title: error.fieldErrors?.title,
          content: error.fieldErrors?.content,
        }
        submitErrorMessage.value = error.message
      } else {
        submitErrorMessage.value = error.message
      }
      return
    }

    console.error('커뮤니티 게시글 등록 API 호출 실패:', error)
    submitErrorMessage.value = '게시글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="community-form-view w-full py-8 sm:py-14">
    <div class="mx-auto w-full max-w-[var(--max-width)] px-4 sm:px-6">
      <div class="mx-auto w-full">
        <header class="mb-8">
          <h1 class="text-2xl font-bold text-[var(--dark-mode-main-font-color)] sm:text-3xl">
            {{ isEditMode ? '게시글 수정' : '글쓰기' }}
          </h1>
          <p class="mt-2 text-base text-[var(--dark-mode-content-font-color)]">
            {{
              isEditMode
                ? '게시글 내용을 수정해보세요.'
                : '공연에 대한 이야기를 자유롭게 나눠보세요.'
            }}
          </p>
        </header>

        <CommunityForm
          :is-edit-mode="isEditMode"
          :initial-values="formInitialValues"
          :image-upload-enabled="true"
          :on-image-upload="onImageUpload"
          :is-submitting="isSubmitting"
          :submit-error-message="submitErrorMessage"
          :server-field-errors="serverFieldErrors"
          @cancel="onCancel"
          @submit="onSubmit"
        />
      </div>
    </div>
  </section>
</template>
