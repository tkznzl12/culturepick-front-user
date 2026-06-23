<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'
import { SiteRouter } from '@/constants/routes'
import type { MyPost } from '@/mocks/mypage.mock'

const props = defineProps<{
  items: MyPost[]
}>()

const categoryLabelMap: Record<MyPost['category'], string> = {
  review: '공연후기',
  recommend: '공연추천',
  info: '정보공유',
  free: '자유토론',
}

const badgeClassMap: Record<MyPost['category'], string> = {
  review: 'mypage-post-badge--blue',
  recommend: 'mypage-post-badge--mint',
  info: 'mypage-post-badge--yellow',
  free: 'mypage-post-badge--pink',
}

const postRows = computed(() =>
  props.items.map((item) => ({
    ...item,
    categoryLabel: categoryLabelMap[item.category],
    badgeClass: badgeClassMap[item.category],
  })),
)
</script>

<template>
  <section>
    <header class="mb-4 flex items-center justify-between gap-3">
      <h2 class="text-xl font-bold text-[var(--dark-mode-main-font-color)]">
        내가 작성한 글 {{ items.length }}
      </h2>
      <CommonButton variant="line" text="글쓰기" :href="SiteRouter.communityCreate" />
    </header>

    <div v-if="postRows.length > 0" class="space-y-3">
      <RouterLink
        v-for="post in postRows"
        :key="post.id"
        :to="SiteRouter.communityPost(post.id)"
        class="mypage-post-item"
      >
        <div class="flex min-w-0 items-center gap-2">
          <span class="mypage-post-badge" :class="post.badgeClass">
            {{ post.categoryLabel }}
          </span>
          <h3 class="truncate text-sm font-semibold text-[var(--dark-mode-main-font-color)] sm:text-base">
            {{ post.title }}
          </h3>
        </div>

        <div class="mypage-post-meta">
          <span>조회 {{ post.viewCount.toLocaleString() }}</span>
          <span>댓글 {{ post.commentCount }}</span>
          <time :datetime="post.createdAt">{{ post.createdAt }}</time>
        </div>
      </RouterLink>
    </div>

    <p
      v-else
      class="rounded-xl border border-[var(--line-component-border-color)] bg-[var(--line-component-background-color)] p-6 text-center text-[var(--caption-text-color)]"
    >
      작성한 글이 없습니다.
    </p>
  </section>
</template>

<style scoped>
.mypage-post-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid var(--line-component-border-color);
  border-radius: 0.875rem;
  padding: 0.875rem 1rem;
  background-color: var(--card-background-color);
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.mypage-post-item:hover {
  border-color: var(--hover-point-text);
  transform: translateY(-1px);
}

.mypage-post-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid transparent;
  padding: 0.25rem 0.625rem;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-medium);
  flex-shrink: 0;
}

.mypage-post-badge--blue {
  color: var(--blue-tag-font-color);
  border-color: var(--blue-tag-border-color);
  background-color: var(--blue-tag-background-color);
}

.mypage-post-badge--mint {
  color: var(--mint-tag-font-color);
  border-color: var(--mint-tag-border-color);
  background-color: var(--mint-tag-background-color);
}

.mypage-post-badge--yellow {
  color: var(--yellow-tag-font-color);
  border-color: var(--yellow-tag-border-color);
  background-color: var(--yellow-tag-background-color);
}

.mypage-post-badge--pink {
  color: var(--pink-tag-font-color);
  border-color: var(--pink-tag-border-color);
  background-color: var(--pink-tag-background-color);
}

.mypage-post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--caption-text-color);
  font-size: var(--font-size-caption);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .mypage-post-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .mypage-post-meta {
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
  }
}
</style>
