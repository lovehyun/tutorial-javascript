# React + Vite로 Hello World 시작하기

이 문서는 **React를 처음 배우는 분**이 `Vite`를 사용해 프로젝트를 초기화하고  
브라우저에 **Hello World**를 출력하기까지의 전체 과정을 단계별로 설명합니다.

---

## 1. 사전 준비

### 1-1. Node.js 설치 확인

터미널(또는 PowerShell)에서 아래 명령어를 실행합니다.

```bash
node -v
npm -v
```

- 버전이 출력되면 이미 설치되어 있습니다.
- 설치되어 있지 않다면 👉 https://nodejs.org 에서 **LTS 버전**을 설치하세요.

---

## 2. Vite로 React 프로젝트 생성

### 2-1. 프로젝트 생성

```bash
npm create vite@latest
```

### 2-2. 질문에 대한 선택

```text
✔ Project name: react-hello
✔ Select a framework: React
✔ Select a variant: JavaScript
```

---

## 3. 프로젝트 폴더로 이동

```bash
cd react-hello
```

---

## 4. 의존성 설치

```bash
npm install
```

설치가 완료되면 `node_modules` 폴더가 생성됩니다.

---

## 5. 개발 서버 실행

```bash
npm run dev
```

실행 결과 예시:

```text
Local: http://localhost:5173/
```

👉 브라우저에서 주소를 열면 기본 Vite + React 화면이 보입니다.

포트 변경 시:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

일회성 임시 포트 변경 시:

```bash
npm run dev -- --port 4000
```

---

## 6. Hello World 작성

### 6-1. `src/App.jsx` 수정

기존 내용을 모두 지우고 아래처럼 작성하세요.

```jsx
function App() {
  return (
    <h1>Hello World</h1>
  );
}

export default App;
```

### 6-2. 저장 후 확인

- 파일 저장 즉시 브라우저가 자동으로 갱신됩니다.
- 화면에 **Hello World**가 보이면 성공입니다.

---

## 7. 파일 구조 간단 설명

```text
react-hello/
├─ src/
│  ├─ App.jsx        ← 메인 컴포넌트
│  ├─ main.jsx       ← React 시작점
├─ index.html        ← HTML 템플릿
├─ package.json      ← 프로젝트 설정
└─ vite.config.js    ← Vite 설정
```

---

## 8. 핵심 개념 요약

- **Vite**: 빠른 개발 서버 + 번들러
- **App.jsx**: 화면을 구성하는 React 컴포넌트
- **JSX**: JavaScript 안에서 HTML처럼 작성하는 문법
- **npm run dev**: 개발 서버 실행

---

## 9. 다음 단계 추천

- JSX 문법 더 알아보기
- 컴포넌트 분리하기
- props / state 개념 이해하기
- CSS 적용하기

---

🎉 축하합니다! React 첫 프로젝트를 성공적으로 실행하셨습니다.
