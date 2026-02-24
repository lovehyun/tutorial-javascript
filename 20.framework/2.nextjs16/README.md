# Next.js 요약

본 문서는 Next.js 의 기본 셋업, 기본 코드, layout.tsx, Next.js 탄생 배경, 철학, 아키텍처 에 대한 소개를 담고 있습니다.

------------------------------------------------------------------------

# 1. Next.js 설치 및 기본 실행

## 프로젝트 생성

``` bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

------------------------------------------------------------------------

# 2. Next.js 최소 예제 코드

## ✔ app/page.tsx

``` tsx
export default function Page() {
  return <h1>Hello Next.js!</h1>;
}
```

## ✔ app/layout.tsx

(이 파일은 Next.js 13+ App Router에서 **전역 레이아웃**으로 필수 구성)

``` tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

## ✔ 폴더 구조 (최소)

    my-app/
     ├─ app/
     │   ├─ page.tsx
     │   └─ layout.tsx
     ├─ tsconfig.json
     ├─ next.config.mjs
     └─ package.json

------------------------------------------------------------------------

# 3. Next.js는 누가 만들었는가?

-   개발사: **Vercel(구 ZEIT)**\
-   창업자: **Guillermo Rauch**\
-   목표: "서버리스 웹과 현대적 프론트엔드를 위한 React 기반 풀스택 프레임워크 제공"

------------------------------------------------------------------------

# 4. Next.js는 왜 만들어졌는가? (문제 → 해결)

React의 한계 때문에 탄생:

  React 단독 문제               Next.js 해결
  ---------------------------- -----------------------------------
  라우팅 없음                   파일 기반 라우팅 제공
  SSR 없음 → SEO 취약           SSR/SSG/ISR 모든 방식 제공
  복잡한 설정(Webpack/Babel)    Zero Config 자동 설정
  성능 최적화 어려움            자동 코드 스플리팅, 이미지 최적화
  프론트/백엔드 분리            API Routes + Server Actions 내장

------------------------------------------------------------------------

# 5. Next.js 철학 (Philosophy)

## ✔ 1) Zero Config

설정 없이 개발 가능 (Webpack/Turbopack/TS 자동 설정)

## ✔ 2) Universal React

React가 브라우저/서버/엣지 어디서나 동작

## ✔ 3) Hybrid Rendering

SSR / SSG / ISR / CSR / Streaming을 페이지 단위로 선택 가능

## ✔ 4) Full-stack React

Next.js 내부에서: - 화면(UI) - API 서버(Route Handlers) - 동작(Server
Actions) - DB 접근(Server Components)

전부 하나에서 처리하는 **풀스택 React** 철학

------------------------------------------------------------------------

# 6. Next.js 아키텍처 (App Router 기준, RSC 중심)

## ✔ React Server Components (RSC)

-   서버에서 실행
-   DB 접근 가능
-   클라이언트 JS 번들에 포함되지 않음 (0KB)
-   보안성과 성능 우수

## ✔ Client Components

-   상호작용이 필요한 UI만 `"use client"`로 지정하여 브라우저에서 실행

## ✔ Route Handlers (API 서버)

-   `app/api/**/route.ts`\
-   Express 없이 Next.js 내부에서 REST API 실행

## ✔ Server Actions

-   클라이언트에서 직접 서버 함수를 호출하는 최신 패턴

------------------------------------------------------------------------

# 7. 전체 아키텍처 ASCII 도식화

    ────────────────────────────────────────────────────────────
                         [ Browser (Client) ]
                     ┌───────────────────────────┐
                     │   Client Components (JS)   │
                     │   상호작용 처리             │
                     └───────────────┬───────────┘
                                     │
                           이벤트/상태 업데이트
                                     │
                     ┌───────────────▼───────────┐
                     │  React Server Components   │
                     │ - DB 쿼리                  │
                     │ - 보안 로직                │
                     │ - 서버에서만 실행          │
                     └───────────────┬───────────┘
                                     │
                            RSC Protocol (React 18)
                                     │
                     ┌───────────────▼───────────┐
                     │        Next.js Server       │
                     │ - SSR/SSG/ISR 렌더링        │
                     │ - API Route                 │
                     │ - Server Actions            │
                     │ - 라우팅 / 빌드 / 최적화    │
                     └───────────────┬───────────┘
                                     │
                         배포 시 HTML/JS 스트리밍
                                     │
                     ┌───────────────▼───────────┐
                     │      Edge / CDN Layer       │
                     │   (Vercel, Cloudflare 등)   │
                     └────────────────────────────┘
    ────────────────────────────────────────────────────────────

------------------------------------------------------------------------

# 8. 추가 파일 설명

## ✔ next-env.d.ts (커밋해야 함)

Next.js에서 TypeScript 타입을 자동 주입하는 선언 파일.

## ✔ .next 폴더 (커밋하면 안 됨)

-   빌드 결과물 / 캐시
-   삭제해도 자동 생성됨

------------------------------------------------------------------------

# 9. 요약

-   Next.js는 Vercel이 만든 **React 풀스택 프레임워크**
-   React의 단점을 극복하기 위해 탄생
-   철학: Zero Config, Universal React, Hybrid Rendering, Full-stack
    React
-   아키텍처: App Router + RSC + Route Handlers + Server Actions +
    Turbopack
-   최소 기본 파일: app/page.tsx, app/layout.tsx

------------------------------------------------------------------------

