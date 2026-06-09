# Culturepick (컬처픽)
<a href="https://culturepick.netlify.app/"><img width="100" height="60" alt="1" src="https://github.com/user-attachments/assets/0993062d-72cb-4225-9ff5-5672d94b15fe" /></a>  
###### (클릭시 데모 페이지로 이동합니다)  
국내 공연 정보 검색 및 AI 공연 추천 서비스

## 작업 인원
정수진(FE)

## 작업 기간
- **기획&디자인** : 26.05.01 ~26.05.08  
- **레이아웃 및 페이지 작업 (Next -> Vue 전환 및 추가작업)** : 26.05.26 ~ 26.06.02
- **API 연동** : 작업 예정
 
## 주요기능
- 공연 검색
- 공연 상세 조회 및 예매페이지 연동
- 공연데이터 기반의 AI 추천
- 로그인 / 회원가입
- 반응형 웹 지원

## 사용 기술스택
```
Vue + TypeScript 프로젝트

상태관리 : Pinia
라우팅 : Vue Router
스타일 : TailwindCSS, CSS3
빌드/개발 서버 : Vite
```

## 프로젝트 실행
```
npm i or npm install
npm run dev
```

## 프로젝트 특징
- Feature 기반으로 공연(performances) 관련 기능을 모듈화
- Composition API(composables)를 활용하여 비즈니스 로직 분리
- Pinia를 활용한 전역 상태 관리
- 재사용 가능한 공통 컴포넌트 중심 구조 설계
- TypeScript를 통한 타입 안정성 확보

## 프로젝트 구조
```
src
├─ api              # API 요청 및 응답 처리
├─ assets           # 이미지, 폰트, 아이콘, Mock 데이터
│  ├─ active-icon
│  ├─ fonts
│  ├─ icons
│  └─ mock
├─ components       # 재사용 가능한 UI 컴포넌트
│  ├─ ai-chat       # AI 추천/채팅 관련 컴포넌트
│  ├─ card          # 카드 UI 컴포넌트
│  ├─ common        # 공통 컴포넌트
│  ├─ form          # 폼 관련 컴포넌트
│  │  └─ auth       # 인증 관련 폼
│  ├─ icons         # SVG 아이콘 컴포넌트
│  ├─ layout        # 레이아웃 컴포넌트
│  ├─ performances  # 공연 관련 컴포넌트
│  └─ skeleton      # 스켈레톤 UI
├─ composables      # Vue Composition API 로직
├─ constants        # 상수 관리
├─ layouts          # 페이지 레이아웃
├─ mocks            # Mock 데이터
├─ pages            # 페이지 단위 컴포넌트
│  └─ performances
├─ router           # Vue Router 설정
├─ stores           # Pinia 상태 관리
├─ types            # TypeScript 타입 정의
├─ utils            # 공통 유틸 함수
└─ views            # 화면(View)
    └─ auth         # 로그인/회원가입
```

## 사이트 Route  
<img width="5880" height="1920" alt="userFlow (3)" src="https://github.com/user-attachments/assets/371afafb-aee5-46c3-b428-7a74d3d5dc66" />

## 사이트맵
<img width="3040" height="1664" alt="userFlow (4)" src="https://github.com/user-attachments/assets/d8a348c4-f66e-4506-8082-3b5ee7a3b0d5" />
