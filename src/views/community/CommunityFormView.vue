<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommunityForm, {
  type CommunityFormValues,
} from '@/components/community/CommunityForm.vue'
import { SiteRouter } from '@/constants/routes'
import { communityPosts } from '@/mocks/community.mock'
import { getAccessToken } from '@/utils/auth-cookie'

const router = useRouter()
const route = useRoute()

const currentUserId = 1
const allowMockPreview = import.meta.env.DEV

const isEditMode = computed(() => !!route.params.id)
const canAccessForm = computed(() => Boolean(getAccessToken()) || allowMockPreview)

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
    void router.replace(SiteRouter.community)
    return
  }

  if (!isEditMode.value) return

  if (!targetPost.value) {
    void router.replace(SiteRouter.community)
    return
  }

  if (!allowMockPreview && targetPost.value.userId !== currentUserId) {
    void router.replace(SiteRouter.communityPost(targetPost.value.id))
  }
})

function onCancel() {
  router.back()
}

function onSubmit(values: CommunityFormValues) {
  if (isEditMode.value) {
    console.log('게시글 수정', values)
  } else {
    console.log('게시글 등록', values)
  }

  void router.push(SiteRouter.community)
}
</script>

<template>
  <section class="community-form-view w-full py-8 sm:py-14">
    <div class="mx-auto w-full max-w-[var(--max-width)] px-4 sm:px-6">
      <div class="mx-auto w-full max-w-[960px]">
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
          @cancel="onCancel"
          @submit="onSubmit"
        />
      </div>
    </div>
  </section>
</template>
