<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { SiteRouter } from '@/constants/routes'
import type { CommunityPost } from '@/mocks/community.mock'

const props = defineProps<{
  post: CommunityPost
}>()

const categoryLabelMap: Record<CommunityPost['category'], string> = {
  review: '공연후기',
  recommend: '공연추천',
  info: '정보공유',
  free: '자유토론',
}

const badgeClassMap: Record<CommunityPost['category'], string> = {
  review: 'community-post-card__badge--blue',
  recommend: 'community-post-card__badge--mint',
  info: 'community-post-card__badge--yellow',
  free: 'community-post-card__badge--pink',
}

const categoryLabel = computed(() => categoryLabelMap[props.post.category])
const categoryClass = computed(() => badgeClassMap[props.post.category])
</script>

<template>
  <RouterLink
    :to="SiteRouter.communityPost(post.id)"
    class="community-post-card group block rounded-2xl border border-[var(--line-component-border-color)] bg-[var(--card-background-color)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--hover-point-text)]"
  >
    <article>
      <div class="mb-3 flex items-center gap-2">
        <span class="community-post-card__badge" :class="categoryClass">
          {{ categoryLabel }}
        </span>
      </div>

      <h3
        class="mb-2 line-clamp-1 text-lg font-semibold text-[var(--dark-mode-main-font-color)] transition-colors duration-200 group-hover:text-[var(--hover-point-text)]"
      >
        {{ post.title }}
      </h3>

      <p class="community-post-card__content mb-4 text-sm text-[var(--dark-mode-content-font-color)]">
        {{ post.content }}
      </p>

      <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--caption-text-color)]">
        <span>{{ post.author }}</span>
        <span aria-hidden="true">·</span>
        <time :datetime="post.createdAt">{{ post.createdAt }}</time>
        <span aria-hidden="true">·</span>
        <span>댓글 {{ post.commentCount }}</span>
      </div>
    </article>
  </RouterLink>
</template>

<style scoped>
.community-post-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid transparent;
  padding: 0.25rem 0.625rem;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-medium);
}

.community-post-card__badge--blue {
  color: var(--blue-tag-font-color);
  border-color: var(--blue-tag-border-color);
  background-color: var(--blue-tag-background-color);
}

.community-post-card__badge--mint {
  color: var(--mint-tag-font-color);
  border-color: var(--mint-tag-border-color);
  background-color: var(--mint-tag-background-color);
}

.community-post-card__badge--yellow {
  color: var(--yellow-tag-font-color);
  border-color: var(--yellow-tag-border-color);
  background-color: var(--yellow-tag-background-color);
}

.community-post-card__badge--pink {
  color: var(--pink-tag-font-color);
  border-color: var(--pink-tag-border-color);
  background-color: var(--pink-tag-background-color);
}

.community-post-card__content {
  line-height: 1.5;
  max-height: calc(1.5em * 2);
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  overflow: hidden;
}

@media (max-width: 767px) {
  .community-post-card {
    padding: 1rem;
  }
}
</style>
