<script setup lang="ts">
import { computed } from 'vue'
import CommonButton from '@/components/common/CommonButton.vue'
import { SiteRouter } from '@/constants/routes'
import type { CommunityPostDetailItem } from '@/types/community'

const props = defineProps<{
  post: CommunityPostDetailItem
  currentUserId: number
}>()

const emit = defineEmits<{
  deletePost: []
}>()

const categoryClassMap: Record<string, string> = {
  review: 'community-detail-card__badge--blue',
  performance_review: 'community-detail-card__badge--blue',
  recommend: 'community-detail-card__badge--mint',
  performance_recommendation: 'community-detail-card__badge--mint',
  info: 'community-detail-card__badge--yellow',
  information: 'community-detail-card__badge--yellow',
  free: 'community-detail-card__badge--pink',
  free_discussion: 'community-detail-card__badge--pink',
}

const isAuthor = computed(() => props.post.authorId === props.currentUserId)
const authorAvatar = computed(() => props.post.authorDisplayName.trim().charAt(0) || '?')
const categoryClass = computed(
  () => categoryClassMap[props.post.category] ?? 'community-detail-card__badge--blue',
)
</script>

<template>
  <article
    class="community-detail-card rounded-3xl border border-[var(--line-component-border-color)] bg-[var(--card-background-color)] p-6"
  >
    <header class="mb-5 flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <span class="community-detail-card__badge" :class="categoryClass">
          {{ post.categoryLabel }}
        </span>
      </div>

      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div class="min-w-0">
          <h1 class="text-2xl leading-tight font-bold text-[var(--dark-mode-main-font-color)] sm:text-3xl">
            {{ post.title }}
          </h1>

          <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--caption-text-color)]">
            <span class="community-detail-card__avatar" aria-hidden="true">{{ authorAvatar }}</span>
            <span>{{ post.authorDisplayName }}</span>
            <span aria-hidden="true">·</span>
            <time :datetime="post.createdAt">{{ post.createdAt }}</time>
            <span aria-hidden="true">·</span>
            <span>댓글 {{ post.commentCount }}</span>
            <span aria-hidden="true">·</span>
            <span>조회 {{ post.viewCount }}</span>
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

    <div
      v-if="post.contentFormat === 'html'"
      class="community-detail-card__content text-base leading-7 text-[var(--dark-mode-content-font-color)]"
      v-html="post.content"
    />
    <p v-else class="community-detail-card__content whitespace-pre-wrap text-base leading-7 text-[var(--dark-mode-content-font-color)]">
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

.community-detail-card__content :deep(p) {
  margin: 0 0 1rem;
}

.community-detail-card__content :deep(p:last-child) {
  margin-bottom: 0;
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
