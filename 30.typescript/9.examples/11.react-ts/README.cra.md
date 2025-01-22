
# React 프로젝트를 TypeScript로 시작하기

## 1. React 프로젝트 생성
TypeScript를 바로 사용할 수 있도록 설정된 React 프로젝트를 생성하려면 `create-react-app` 명령어를 사용합니다:

```bash
npx create-react-app my-app --template typescript
```

위 명령어는 TypeScript 템플릿을 포함한 새로운 React 프로젝트를 생성합니다.

---

## 2. TypeScript 추가 (기존 React 프로젝트에 TypeScript 설치)

이미 기존의 React 프로젝트가 있다면 TypeScript와 필요한 타입 패키지를 설치해야 합니다:

```bash
npm install --save typescript @types/react @types/react-dom
```

그런 다음 프로젝트 루트에 TypeScript 설정 파일을 생성합니다:

```bash
npx tsc --init
```

---

## 3. `tsconfig.json` 설정
`tsconfig.json` 파일은 TypeScript 컴파일러의 동작을 설정합니다. 기본적으로 생성된 설정으로 충분하지만, 필요에 따라 옵션을 수정할 수 있습니다. 예를 들어:

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "esnext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## 4. JavaScript 파일을 TypeScript로 변환
기존의 `.js` 파일을 `.tsx`로 확장자를 변경하고, 파일 내부에서 필요한 타입을 지정합니다.

### 예제:

#### `App.tsx`
```tsx
import React from 'react';

interface AppProps {
  message: string;
}

const App: React.FC<AppProps> = ({ message }) => {
  return <h1>{message}</h1>;
};

export default App;
```

---

## 5. 타입 정의 설치
React 프로젝트에서는 추가로 사용하는 라이브러리들의 타입 정의가 필요합니다. 필요한 경우 `@types/`로 시작하는 패키지를 설치하세요.

예:

```bash
npm install --save-dev @types/react-router-dom
```

---

## 6. TypeScript 실행 확인
프로젝트를 실행해 TypeScript 설정이 정상 작동하는지 확인합니다.

```bash
npm start
```

---

## 7. Linting 및 포맷팅
TypeScript와 함께 ESLint와 Prettier를 설정하면 코드 품질을 더 쉽게 관리할 수 있습니다.

```bash
npm install --save-dev eslint prettier eslint-plugin-react @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

---

## 참고자료 및 링크
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)
- [React 공식 문서](https://reactjs.org/)
- [Create React App 공식 문서](https://create-react-app.dev/)
  - [Create React App TypeScript 공식 문서](https://create-react-app.dev/docs/adding-typescript/)
- [ESLint 공식 문서](https://eslint.org/)
- [Prettier 공식 문서](https://prettier.io/)
