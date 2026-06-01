<script setup lang="ts">
import CommonButton from '@/components/common/CommonButton.vue'
import { SiteRouter } from '@/constants/routes'
</script>

<template>
  <section
    class="not-found mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[var(--max-width)] flex-col items-center justify-center px-6 py-16 text-center"
    aria-labelledby="not-found-heading"
  >
    <img
      src="/images/not-found.png"
      alt=""
      class="not-found__illustration mb-8 h-auto w-full max-w-[280px] select-none sm:max-w-[320px]"
      width="320"
      height="320"
      decoding="async"
    />

    <h1
      id="not-found-heading"
      class="mb-3 text-2xl font-bold text-[var(--dark-mode-main-font-color)] sm:text-3xl"
    >
      페이지를 찾을 수 없어요
    </h1>

    <p class="mb-10 max-w-md text-base text-[var(--dark-mode-content-font-color)]">
      요청하신 주소가 없거나 이동·삭제된 페이지일 수 있어요.
      <br class="hidden sm:inline" />
      홈으로 돌아가 다시 둘러보시겠어요?
    </p>

    <div class="flex flex-wrap items-center justify-center gap-3">
      <CommonButton
        :href="SiteRouter.index"
        text="홈으로 가기"
        variant="gradient-shadow"
      />
      <CommonButton
        :href="SiteRouter.performanceList"
        text="공연 둘러보기"
        variant="line"
      />
    </div>
  </section>
</template>

