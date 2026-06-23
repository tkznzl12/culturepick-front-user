<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCommunityPostDetail, type CommunityApiError } from '@/api/community'
import {
  CommunityServiceError,
  createPost,
  updatePost,
  uploadCommunityImage,
} from '@/api/community.service'
import CommunityForm, {
  type CommunityFormValues,
} from '@/components/community/CommunityForm.vue'
import type { CommunityEditorImageUploadHandler } from '@/components/community/CommunityEditor.vue'
import { SiteRouter } from '@/constants/routes'
import type { CommunityApiCategory } from '@/types/community'
import { getAccessToken } from '@/utils/auth-cookie'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isEditMode = computed(() => !!route.params.id)
const canAccessForm = computed(() => Boolean(getAccessToken()))
const isSubmitting = ref(false)
const isInitialLoading = ref(false)
const submitErrorMessage = ref('')
const serverFieldErrors = ref<Partial<Record<'title' | 'content', string>>>({})
const COMMUNITY_AUTH_TOAST_KEY = 'community-auth-required-toast'
const COMMUNITY_EDIT_FORBIDDEN_TOAST_KEY = 'community-edit-forbidden-toast'
const COMMUNITY_NOT_FOUND_TOAST_KEY = 'community-not-found-toast'
const loadedPostId = ref<number | null>(null)

const editPostId = computed(() => {
  if (!isEditMode.value) return null
  const parsed = Number(route.params.id)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
})

const formInitialValues = ref<Partial<CommunityFormValues>>({})

const apiCategoryToFormMap: Record<CommunityApiCategory, Exclude<CommunityFormValues['category'], null>> = {
  performance_review: 'review',
  performance_recommendation: 'recommend',
  information: 'info',
  free_discussion: 'free',
}

const categoryMap: Record<Exclude<CommunityFormValues['category'], null>, CommunityApiCategory> = {
  review: 'performance_review',
  recommend: 'performance_recommendation',
  info: 'information',
  free: 'free_discussion',
}

watch(canAccessForm, (canAccess) => {
  if (canAccess) return
  window.sessionStorage.setItem(COMMUNITY_AUTH_TOAST_KEY, '1')
  void router.replace(SiteRouter.community)
}, { immediate: true })

watch(isEditMode, (editing) => {
  if (editing) return
  formInitialValues.value = {}
  loadedPostId.value = null
}, { immediate: true })

watch([isEditMode, editPostId], () => {
  if (!canAccessForm.value) return
  if (!isEditMode.value) return
  void loadEditPost()
}, { immediate: true })

onMounted(() => {
  authStore.syncUserFromToken()
  authStore.bindAuthChangeListener()
})

onBeforeUnmount(() => {
  authStore.unbindAuthChangeListener()
})

async function loadEditPost() {
  if (!isEditMode.value) return
  if (!canAccessForm.value) {
    return
  }

  if (!editPostId.value) {
    window.sessionStorage.setItem(COMMUNITY_NOT_FOUND_TOAST_KEY, '1')
    void router.replace(SiteRouter.community)
    return
  }

  if (loadedPostId.value === editPostId.value) return

  isInitialLoading.value = true
  submitErrorMessage.value = ''

  try {
    const post = await getCommunityPostDetail(editPostId.value)
    const currentUserId = authStore.user.id

    if (!currentUserId || post.authorId !== currentUserId) {
      window.sessionStorage.setItem(COMMUNITY_EDIT_FORBIDDEN_TOAST_KEY, '1')
      await router.replace(SiteRouter.communityPost(post.id))
      return
    }

    formInitialValues.value = {
      category:
        apiCategoryToFormMap[post.category as CommunityApiCategory] ?? null,
      title: post.title,
      content: post.content,
    }
    loadedPostId.value = post.id
  } catch (error) {
    const apiError = error as CommunityApiError
    if (apiError?.status === 404) {
      window.sessionStorage.setItem(COMMUNITY_NOT_FOUND_TOAST_KEY, '1')
      await router.replace(SiteRouter.community)
      return
    }

    console.error('커뮤니티 수정 폼 초기 조회 실패:', error)
    submitErrorMessage.value = '게시글 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isInitialLoading.value = false
  }
}

function onCancel() {
  if (isSubmitting.value) return
  router.back()
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

  if (isEditMode.value && !editPostId.value) return
  if (isInitialLoading.value) return

  isSubmitting.value = true
  submitErrorMessage.value = ''
  serverFieldErrors.value = {}

  try {
    if (isEditMode.value && editPostId.value) {
      const response = await updatePost(editPostId.value, {
        category: categoryMap[values.category],
        title: values.title,
        content: values.content,
        content_format: 'html',
      })
      await router.push(SiteRouter.communityPost(response.id))
      return
    }

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
      } else if (error.status === 403 && editPostId.value) {
        window.sessionStorage.setItem(COMMUNITY_EDIT_FORBIDDEN_TOAST_KEY, '1')
        await router.push(SiteRouter.communityPost(editPostId.value))
      } else if (error.status === 404) {
        window.sessionStorage.setItem(COMMUNITY_NOT_FOUND_TOAST_KEY, '1')
        await router.push(SiteRouter.community)
      } else {
        submitErrorMessage.value = error.message
      }
      return
    }

    console.error('커뮤니티 게시글 저장 API 호출 실패:', error)
    submitErrorMessage.value = isEditMode.value
      ? '게시글 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.'
      : '게시글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.'
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
          :is-submitting="isSubmitting || isInitialLoading"
          :submit-error-message="submitErrorMessage"
          :server-field-errors="serverFieldErrors"
          @cancel="onCancel"
          @submit="onSubmit"
        />
      </div>
    </div>
  </section>
</template>
