<script setup lang="ts">
import { computed } from 'vue'
import CommonButton from '@/components/common/CommonButton.vue'
import { SiteRouter } from '@/constants/routes'
import type { CommunityPost } from '@/mocks/community-detail.mock'

const props = defineProps<{
  post: CommunityPost
  currentUserId: number
}>()

const emit = defineEmits<{
  deletePost: []
}>()

const categoryLabelMap: Record<CommunityPost['category'], string> = {
  review: '공연후기',
  recommend: '공연추천',
  info: '정보공유',
  free: '자유토론',
}

const categoryClassMap: Record<CommunityPost['category'], string> = {
  review: 'community-detail-card__badge--blue',
  recommend: 'community-detail-card__badge--mint',
  info: 'community-detail-card__badge--yellow',
  free: 'community-detail-card__badge--pink',
}

const isAuthor = computed(() => props.post.userId === props.currentUserId)
const authorAvatar = computed(() => props.post.author.trim().charAt(0) || '?')
</script>

<template>
  <article
    class="community-detail-card rounded-3xl border border-[var(--line-component-border-color)] bg-[var(--card-background-color)] p-6"
  >
    <header class="mb-5 flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <span class="community-detail-card__badge" :class="categoryClassMap[post.category]">
          {{ categoryLabelMap[post.category] }}
        </span>
      </div>

      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div class="min-w-0">
          <h1 class="text-2xl leading-tight font-bold text-[var(--dark-mode-main-font-color)] sm:text-3xl">
            {{ post.title }}
          </h1>

          <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--caption-text-color)]">
            <span class="community-detail-card__avatar" aria-hidden="true">{{ authorAvatar }}</span>
            <span>{{ post.author }}</span>
            <span aria-hidden="true">·</span>
            <time :datetime="post.createdAt">{{ post.createdAt }}</time>
            <span aria-hidden="true">·</span>
            <span>댓글 {{ post.commentCount }}</span>
          </div>
        </div>

        <div v-if="isAuthor" class="community-detail-card__actions">
          <CommonButton
            variant="line"
            text="수정하기"
            :href="SiteRouter.communityEdit(post.id)"
          />
          <CommonButton variant="line" text="삭제하기" @click="emit('deletePost')" />
        </div>
      </div>
    </header>

    <hr class="mb-5 border-0 border-t border-[var(--line-component-border-color)]" />

    <p class="whitespace-pre-wrap text-base leading-7 text-[var(--dark-mode-content-font-color)]">
      {{ post.content }}
    </p>
  </article>
</template>

<style scoped>
.community-detail-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid transparent;
  padding: 0.25rem 0.625rem;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-medium);
}

.community-detail-card__badge--blue {
  color: var(--blue-tag-font-color);
  border-color: var(--blue-tag-border-color);
  background-color: var(--blue-tag-background-color);
}

.community-detail-card__badge--mint {
  color: var(--mint-tag-font-color);
  border-color: var(--mint-tag-border-color);
  background-color: var(--mint-tag-background-color);
}

.community-detail-card__badge--yellow {
  color: var(--yellow-tag-font-color);
  border-color: var(--yellow-tag-border-color);
  background-color: var(--yellow-tag-background-color);
}

.community-detail-card__badge--pink {
  color: var(--pink-tag-font-color);
  border-color: var(--pink-tag-border-color);
  background-color: var(--pink-tag-background-color);
}

.community-detail-card__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  border: 1px solid var(--line-component-border-color);
  background-color: var(--line-component-background-color);
  color: var(--dark-mode-main-font-color);
  font-size: 0.8125rem;
  font-weight: var(--font-weight-semibold);
}

.community-detail-card__actions {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 767px) {
  .community-detail-card {
    padding: 1rem;
  }

  .community-detail-card__actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
}
</style>
