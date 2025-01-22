
# Vite로 React + TypeScript 앱 만들기

이 문서는 **Vite**를 사용하여 React + TypeScript 애플리케이션을 설정하고 실행하는 방법을 안내합니다.

---

## 1. Vite 설치 및 초기화
Vite는 "비트"로 발음합니다. 프랑스어로 "빠른"이라는 뜻에서 이름이 유래되었으며, Vite는 현대적인 JavaScript 애플리케이션 개발을 위한 빠르고 경량화된 빌드 도구입니다.

### 1.1 프로젝트 생성
다음 명령어를 사용하여 Vite 기반 React + TypeScript 프로젝트를 생성합니다:

```bash
npm create vite@latest my-react-app -- --template react-ts
```
또는
```bash
npx create-vite@latest my-react-app --template react-ts
```

- `my-react-app`: 생성할 프로젝트 폴더 이름입니다.
- `--template react-ts`: React와 TypeScript를 사용하는 템플릿을 지정합니다.

### 1.2 디렉토리 이동 및 의존성 설치
```bash
cd my-react-app
npm install
```

---

## 2. 폴더 구조
Vite로 생성된 프로젝트는 기본적으로 아래와 같은 구조를 가집니다:

```
my-react-app/
├── node_modules/
├── public/
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 3. 주요 파일 설명

### 3.1 `src/main.tsx`
React의 진입점 파일입니다. ReactDOM을 사용하여 애플리케이션을 렌더링합니다.

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 3.2 `src/App.tsx`
React 컴포넌트의 기본 템플릿입니다.

```tsx
import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Hello, Vite + React + TypeScript!</h1>
    </div>
  );
};

export default App;
```

### 3.3 `vite.config.ts`
Vite의 설정 파일로, 기본 설정은 대부분 자동으로 제공됩니다.

---

## 4. 프로젝트 실행

### 4.1 개발 서버 실행
```bash
npm run dev
```

- 서버가 실행된 후 출력된 URL을 브라우저에서 열어 결과를 확인합니다 (기본: `http://localhost:5173`).

### 4.2 프로덕션 빌드
```bash
npm run build
```

- 최적화된 프로덕션 빌드를 생성합니다.

### 4.3 로컬에서 빌드된 파일 미리보기
```bash
npm run preview
```

- 빌드된 파일을 로컬 서버에서 미리보기합니다.

### 4.4 결과물 실행
```bash
npx serve -s dist
```

- 빌드된 파일을 로컬 서버에서 제공합니다.

---

## 5. 주요 명령어 요약

| 명령어               | 설명                                   |
|----------------------|----------------------------------------|
| `npm run dev`        | 개발 서버 실행                         |
| `npm run build`      | 프로덕션 빌드 생성                     |
| `npm run preview`    | 빌드된 파일 로컬 미리보기              |

---

## 6. 참고
- Vite 공식 문서: [https://vitejs.dev/](https://vitejs.dev/)
- TypeScript: [https://www.typescriptlang.org/](https://www.typescriptlang.org/)
