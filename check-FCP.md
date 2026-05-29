# FCP / LCP 성능 점검 및 개선 기록

> Culture Pick (Vue 3 + Vite) 메인 페이지 Lighthouse Performance 개선 작업 정리  
> 초기 측정: Performance **60점**, FCP **2.7s**, LCP **7.4s**

---

## 1. 원인 분석

### 1.1 초기 번들 / 에셋 (개선 전)

| 항목 | 크기 | 영향 |
|------|------|------|
| `src/assets/mock/main-bg.png` | **~2,020 KB** | LCP 주범 (히어로 배경) |
| `src/assets/fonts/WantedSansVariable.woff2` | **~1,289 KB** | `main.ts`에서 동기 로드 → FCP 지연 |
| `src/assets/logo.svg` | **~107 KB** | 네비·푸터 초기 로드 |
| `dist/assets/index-*.js` (진입) | 106 KB (gzip **41 KB**) | Vue + HomeView + 라우터가 한 청크 |
| `dist/assets/index-*.css` (Tailwind) | 32 KB (gzip **7 KB**) | `@source`로 전역 스캔 |

### 1.2 첫 화면에서 로드되는 이미지

| 이미지 | 용도 | 비고 |
|--------|------|------|
| `main-bg.png` | 홈 히어로 배경 | **2MB**, CSS `background-image` |
| `logo.svg` | AppNavbar, AppFooter | 107KB, path 수백 개 |
| `search-icon.svg` 등 | 네비/히어로 UI | 소형 |

### 1.3 LCP 요소

- **가장 큰 LCP 후보**: `HomeView`의 CSS `background-image`로 로드되던 `main-bg.png`
- CSS 배경은 브라우저가 LCP 후보로 인식·`fetchpriority`·`preload` 적용이 어려움
- 실제 치수: **1649 × 1099** px

### 1.4 라우터 lazy loading (개선 전)

| 경로 | lazy |
|------|------|
| `DefaultLayout` | ✅ |
| `SearchResultsView`, `PerformanceListPage` 등 | ✅ |
| **`HomeView` (`/`)** | ❌ **정적 import** |

```ts
// 개선 전 router/index.ts
import HomeView from '../views/HomeView.vue'
// ...
component: HomeView,
```

→ 홈 진입 시 HomeView + 2MB PNG가 초기 경로에 묶임.

### 1.5 불필요한 초기 로드

- `vite-plugin-vue-devtools`가 **프로덕션 빌드에도 활성**
- `AppFooter`, `HeroFloatingButtons` — 첫 뷰포트 밖/부가 UI인데 동기 import
- `src/stores/counter.ts` — Pinia 예제 스토어, **미사용** (삭제 후보)

### 1.6 의존성

**런타임 (`package.json`)**

| 패키지 | 용도 |
|--------|------|
| `vue` | 프레임워크 |
| `vue-router` | 라우팅 |
| `pinia` | 상태 (실사용 스토어 거의 없음) |

무거운 UI 라이브러리(차트, 에디터 등) 없음 → **tree shaking 여지는 제한적**, 에셋·코드 스플리팅이 효과 큼.

---

## 2. 적용한 개선

### 2.1 히어로 이미지 (LCP)

| 항목 | 내용 |
|------|------|
| 포맷 | PNG 2MB → **WebP ~38KB** (`quality 80`) |
| 배포 경로 | `public/images/hero-bg.webp` |
| 상수 | `src/constants/hero.ts` (`HERO_BG_WEBP`, width/height) |
| 마크업 | CSS 배경 → `<img fetchpriority="high" decoding="async">` |
| preload | `index.html` — `rel="preload" as="image" type="image/webp"` |
| 원본 PNG | `src/assets/mock/main-bg.png` — **import 하지 않음** (디자인 원본만 보관) |

### 2.2 코드 스플리팅

| 대상 | 방식 |
|------|------|
| `HomeView` | `() => import('../views/HomeView.vue')` |
| `HeroFloatingButtons` | `defineAsyncComponent` in `HomeView.vue` |
| `AppFooter` | `defineAsyncComponent` in `DefaultLayout.vue` |

### 2.3 폰트 (FCP)

- `main.ts`에서 `import './assets/fonts/wanted-sans.css'` **제거**
- `requestIdleCallback` 이후 동적 import → **초기 렌더 경로에서 분리**
- `wanted-sans.css`에는 이미 `font-display: swap` 적용됨

### 2.4 빌드 (`vite.config.ts`)

- `mode === 'development'`일 때만 `vite-plugin-vue-devtools` 로드
- `manualChunks`: `vue`, `vue-router`, `pinia` → **`vue-vendor`** 청크

### 2.5 이미지 속성

- **AppNavbar** 로고: `width` / `height`, `decoding="async"`
- **AppFooter** 로고: `loading="lazy"`, `decoding="async"`

### 2.6 변경 파일 목록

```
index.html
vite.config.ts
src/main.ts
src/router/index.ts
src/layouts/DefaultLayout.vue
src/views/HomeView.vue
src/constants/hero.ts
src/components/layout/AppNavbar.vue
src/components/layout/AppFooter.vue
public/images/hero-bg.webp          (신규)
src/assets/mock/main-bg.webp        (변환본, public과 동일 소스)
```

---

## 3. 번들 크기 비교

### 3.1 빌드 산출물 (개선 전 → 후)

| 구분 | 개선 전 | 개선 후 |
|------|---------|---------|
| 진입 JS | `index.js` **106 KB** (gzip 41 KB) | `index.js` **5 KB** (gzip 2 KB) + `vue-vendor` **95 KB** (gzip 37 KB) |
| 히어로 이미지 | `main-bg-*.png` **2,069 KB** | `images/hero-bg.webp` **~38 KB** (public) |
| 폰트 (초기 차단) | woff2 **1,289 KB** (main.ts 동기) | idle 이후 청크 로드 |
| 홈 JS | index에 포함 | `HomeView` ~3.7 KB, `DefaultLayout` ~5.4 KB (별도 청크) |
| CSS | ~32 KB (gzip 7 KB) | ~31 KB (gzip 6 KB) |
| `dist`에서 제거 | — | `main-bg-*.png` 청크 없음 |

### 3.2 메인 페이지 초기 전송량 (개략)

- **개선 전**: PNG + 동기 폰트만 해도 **~3.3MB+** (JS/CSS 제외)
- **개선 후**: 히어로 WebP 38KB + gzip JS ~50KB대 + 로고 SVG 등 → **수백 KB 단위**로 축소

> 정확한 Lighthouse 수치는 `npm run build-only && npm run preview` 후 홈(`/`)에서 재측정 필요.

---

## 4. 가장 큰 병목 (우선순위)

1. **히어로 PNG 2MB** — ✅ WebP + `<img>` + preload로 해결
2. **가변 폰트 1.29MB 동기 로드** — ✅ idle 이후 로드 (서브셋은 미적용)
3. **logo.svg 107KB** — ⚠️ 미해결 (Figma export, path 과다)
4. **HomeView 정적 import + CSS 배경** — ✅ lazy + img LCP

---

## 5. 추가 개선 후보

- [ ] `logo.svg` 경량화 (심볼용 SVG 또는 WebP, 네비 전용 `logo-mark.svg`)
- [ ] Wanted Sans **한글 서브셋** (woff2 용량 1.29MB → 수백 KB 이하 목표)
- [ ] 히어로 **responsive `srcset`** (예: 모바일 800w WebP)
- [ ] 미사용 `src/stores/counter.ts` 삭제
- [ ] `@unhead/vue` 등으로 라우트별 LCP preload
- [ ] CDN / HTTP 캐시 헤더 (`hero-bg.webp` long-cache)
- [ ] (장기) 홈 히어로 **SSG·prerender**로 FCP 텍스트 선노출

---

## 6. 재측정 방법

```bash
npm run build-only
npm run preview
```

1. 브라우저에서 preview URL 접속 (기본 `http://localhost:4173`)
2. Chrome DevTools → **Lighthouse** → Mode: Navigation, Device: Mobile
3. URL: **`/`** (홈)
4. Performance, FCP, LCP, **LCP element** 항목 확인

### WebP 재생성 (원본 PNG 교체 시)

```bash
npx sharp-cli -i "src/assets/mock/main-bg.png" -o "public/images/hero-bg.webp" -f webp -q 80
```

`src/constants/hero.ts`의 `HERO_BG_WIDTH` / `HERO_BG_HEIGHT`를 실제 이미지 크기에 맞게 수정.

---

## 7. 참고: LCP가 잘 잡히는 패턴

```html
<!-- index.html -->
<link rel="preload" href="/images/hero-bg.webp" as="image" type="image/webp" fetchpriority="high">
```

```vue
<!-- HomeView.vue -->
<img
  src="/images/hero-bg.webp"
  alt=""
  fetchpriority="high"
  decoding="async"
  :width="HERO_BG_WIDTH"
  :height="HERO_BG_HEIGHT"
  class="absolute inset-0 h-full w-full object-cover"
/>
```

- LCP는 가능한 한 **`<img>`** 로 노출
- **크기 명시**로 CLS 방지
- **preload**와 **동일 URL** 사용 (`public/` 경로)

---

*마지막 업데이트: 2026-05-29*
