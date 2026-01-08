
# React Router v6.4와 Data Router 완전 정리

## 1. v6.4는 무엇인가?
- v6.4는 **React Router (react-router-dom)**의 버전입니다.
- React 18 / React 19와는 **완전히 별개**입니다.
- 이 버전부터 **Data Router** 개념이 도입되었습니다.

### 패키지 구분
- react: React 자체
- react-dom: DOM 렌더러
- react-router-dom: 라우팅 라이브러리

---

## 2. 기존 방식: BrowserRouter (UI Router)

### 개념
> URL에 따라 **컴포넌트만** 전환한다.

### 특징
- 데이터 로딩은 컴포넌트 내부(useEffect)
- 로딩/에러 처리 방식이 컴포넌트마다 다름
- 소규모 앱이나 학습용으로 적합

### 예제 흐름
1. URL 변경
2. 컴포넌트 렌더
3. useEffect 실행
4. fetch 요청

### 한계
- 화면이 먼저 보였다가 로딩됨
- 인증/권한 로직이 컴포넌트에 흩어짐
- 구조가 커질수록 복잡해짐

---

## 3. Data Router란 무엇인가? (v6.4+)

### 핵심 개념
> **라우트 진입 전에 데이터를 준비**한다.

즉,
> 라우트 = 화면 + 데이터 + 에러 정책

---

## 4. Data Router: createBrowserRouter

### 특징
- loader에서 데이터 로딩
- errorElement로 에러 처리
- 컴포넌트는 순수 UI 역할

### 예제 흐름
1. URL 변경
2. loader 실행
3. 성공 → 컴포넌트 렌더
4. 실패 → errorElement 렌더

---

## 5. 두 방식 비교

| 항목 | BrowserRouter | Data Router |
|---|---|---|
| 데이터 위치 | 컴포넌트 | 라우트 |
| 로딩 처리 | 컴포넌트마다 | 라우터 |
| 에러 처리 | 개별 try/catch | errorElement |
| 인증 처리 | 화면 렌더 후 | 진입 전 |
| 확장성 | 낮음 | 높음 |

---

## 6. Data Router가 해결한 문제

- 로딩/에러 처리의 일관성
- 인증 페이지 깜빡임 문제 제거
- 라우트 단위 책임 분리
- 대규모 앱 구조 안정성 확보

---

## 7. 언제 어떤 방식을 써야 하나?

### BrowserRouter
- React 입문
- 데이터 없는 SPA
- 빠른 프로토타입

### Data Router
- 실제 서비스
- API 중심 앱
- 인증/권한 필요
- 유지보수 고려

---

## 8. 추천 학습 순서

1. BrowserRouter
   - Routes / Route
   - Link / NavLink
   - useParams / Outlet

2. createBrowserRouter
   - loader
   - errorElement
   - useLoaderData

3. 실무 확장
   - redirect
   - 보호 라우트
   - 코드 스플리팅

---

## 9. 핵심 한 줄 요약

> **Data Router는 라우팅을 데이터 흐름의 최상단으로 끌어올린 구조다.**
