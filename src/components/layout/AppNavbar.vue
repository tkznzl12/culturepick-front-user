<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { genreList } from '@/constants'
import aiIcon from '@/assets/icons/ai-icon.svg'
import searchIcon from '@/assets/icons/search-icon.svg'
import userIcon from '@/assets/icons/user-icon.svg'
import logoUrl from '@/assets/logo.svg'

const searchQuery = ref('')

type NavLink = {
  key: string
  label: string
  to: RouteLocationRaw
}

function toGenreRoute(code: string, name: string): RouteLocationRaw {
  return {
    path: '/',
    query: code ? { genre: code } : { genre: name },
  }
}

const navLinks = computed<NavLink[]>(() => [
  { key: 'home', label: '공연 홈', to: '/' },
  ...genreList.map((genre) => ({
    key: `genre-${genre.code || genre.name}`,
    label: genre.name,
    to: toGenreRoute(genre.code, genre.name),
  })),
])

function onSearchSubmit() {
  if (!searchQuery.value.trim()) return
  // TODO: 검색 API 연동
}
</script>

<template>
  <header class="app-navbar">
    <div class="app-navbar__inner">
      <RouterLink to="/" class="app-navbar__logo-link" aria-label="홈으로">
        <img :src="logoUrl" alt="Culture Pick" class="app-navbar__logo" />
      </RouterLink>

      <nav class="app-navbar__nav">
        <RouterLink
          v-for="link in navLinks"
          :key="link.key"
          :to="link.to"
          class="app-navbar__link"
          active-class="app-navbar__link--active"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="app-navbar__actions">
        <form class="app-navbar__search" role="search" @submit.prevent="onSearchSubmit">
          <input
            v-model="searchQuery"
            type="search"
            name="q"
            placeholder="공연 검색..."
            class="app-navbar__search-input"
          />
          <button type="submit" class="app-navbar__search-btn" aria-label="검색">
            <img :src="searchIcon" alt="" width="15" height="15" />
          </button>
        </form>

        <button type="button" class="app-navbar__btn app-navbar__btn--gradient">
          <img :src="aiIcon" alt="" width="14" height="14" />
          <span>AI 추천</span>
        </button>

        <button type="button" class="app-navbar__btn app-navbar__btn--line">로그인</button>

        <button type="button" class="app-navbar__btn app-navbar__btn--user" aria-label="마이페이지">
          <img :src="userIcon" alt="" width="16" height="16" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  background-color: var(--dark-mode-background-color);
}

.app-navbar__inner {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  width: 100%;
  max-width: var(--max-width);
  height: 4rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  box-sizing: border-box;
}

.app-navbar__nav {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
  flex: 1 1 auto;
  overflow-x: auto;
  scrollbar-width: none;
}

.app-navbar__nav::-webkit-scrollbar {
  display: none;
}

.app-navbar__link,
.app-navbar__link:visited {
  flex-shrink: 0;
  padding: 0.5rem 0.75rem;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-body);
  line-height: 1.25rem;
  color: var(--dark-mode-main-font-color);
  white-space: nowrap;
  text-decoration: none;
  transition: color 0.2s ease;
}

.app-navbar__link:hover {
  color: var(--hover-point-text);
}

.app-navbar__link--active,
.app-navbar__nav :deep(.router-link-active) {
  color: var(--dark-mode-main-font-color);
}

.app-navbar__actions {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  align-items: center;
  gap: 0.5rem;
}

.app-navbar__logo-link {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  line-height: 0;
  text-decoration: none;
}

.app-navbar__logo {
  display: block;
  height: 2.5rem;
  width: auto;
  object-fit: contain;
}

.app-navbar__search {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  height: fit-content;
  padding: 0.375rem 1rem;
  border: 1px solid var(--line-component-border-color);
  border-radius: 624.9375rem;
  background-color: var(--line-component-background-color);
}

.app-navbar__search-input {
  width: 9.5rem;
  min-width: 0;
  padding: 0;
  border: none;
  background: transparent;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-body);
  line-height: 1.25rem;
  color: var(--dark-mode-main-font-color);
  outline: none;
}

.app-navbar__search-input::placeholder {
  color: var(--line-component-font-color);
}

.app-navbar__search-btn {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 0.9375rem;
  height: 0.9375rem;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.app-navbar__search-btn img {
  display: block;
  width: 0.9375rem;
  height: 0.9375rem;
}

.app-navbar__btn {
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  flex-shrink: 0;
  height: fit-content;
  margin: 0;
  border-radius: 624.9375rem;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  line-height: 1.25rem;
  color: var(--dark-mode-main-font-color);
  white-space: nowrap;
  cursor: pointer;
  transition:
    opacity 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.app-navbar__btn img {
  display: block;
  flex-shrink: 0;
}

.app-navbar__btn--gradient {
  padding: 0.375rem 0.75rem;
  border: none;
  background: var(--gradient-button);
}

.app-navbar__btn--gradient:hover {
  opacity: 0.92;
}

.app-navbar__btn--line {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--line-component-border-color);
  background: transparent;
}

.app-navbar__btn--line:hover {
  border-color: var(--hover-point-text);
  color: var(--hover-point-text);
}

.app-navbar__btn--user {
  padding: 0.5rem;
  border: 1px solid var(--line-component-border-color);
  background-color: var(--line-component-background-color);
}

.app-navbar__btn--user:hover {
  border-color: var(--hover-point-text);
}

@media (max-width: 1023px) {
  .app-navbar__search {
    display: none;
  }

  .app-navbar__btn--gradient span {
    display: none;
  }
}

@media (max-width: 767px) {
  .app-navbar__inner {
    flex-wrap: wrap;
    height: auto;
    min-height: 4rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .app-navbar__logo-link {
    order: 0;
  }

  .app-navbar__nav {
    flex: 1 1 100%;
    order: 2;
  }

  .app-navbar__actions {
    flex: 1 1 auto;
    order: 1;
    justify-content: flex-end;
    min-width: 0;
  }
}
</style>
