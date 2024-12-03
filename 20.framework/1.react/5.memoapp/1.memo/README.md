# Memo 앱 개발
React 프로젝트를 초기화(npx create-react-app my-memo-app)한 이후에 불필요한 파일을 정리하고 새로운 파일을 추가하거나 수정하여 간단하고 깔끔한 프로젝트 구조를 만들 수 있습니다. 아래는 프로젝트 정리와 추가해야 할 작업에 대한 단계별 설명입니다.

## 1. 불필요한 파일 제거
초기화된 프로젝트에는 기본 제공되는 파일들이 많습니다. 아래의 파일들을 삭제해도 프로젝트 실행에는 문제가 없습니다.

삭제할 파일:
- src/logo.svg
- src/App.css (필요하면 새 스타일 파일을 만듦)
- src/App.test.js (테스트 코드 작성이 필요하면 다시 추가 가능)
- src/index.css (필요에 따라 새 스타일 파일을 작성)
- src/reportWebVitals.js
- src/setupTests.js

삭제 후 디렉토리 구조:
```bash
my-memo-app/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── App.js
│   ├── index.js
│   └── styles.css (새로 생성)
└── package.json
```

## 2. 필요한 파일 수정
### 2.1. src/index.js
index.js는 React 앱의 진입점입니다. 불필요한 코드와 import를 제거합니다.

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css'; // 스타일 파일 연결 (필요 시)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 2.2. src/App.js
초기 템플릿을 삭제하고 새로 작업할 컴포넌트를 구성합니다. 기본적으로 React에서 제공하는 내용은 모두 지우고, 새 컴포넌트를 사용합니다.

```jsx
import React from 'react';

const App = () => {
  return (
    <div>
      <h1>메모 앱</h1>
    </div>
  );
};

export default App;
```

### 2.3. public/index.html
public/index.html에서 기본 제공되는 <title> 및 기타 메타 데이터를 수정합니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <title>메모 앱</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

## 3. 스타일 파일 추가
src/styles.css 파일을 새로 만들고 기본적인 스타일을 작성합니다.

```css
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f7f7f7;
}

h1 {
  color: #333;
  text-align: center;
  margin-top: 20px;
}
```

## 4. 추가해야 할 라이브러리 설치 (필요에 따라)
React 프로젝트에서 유용한 라이브러리를 설치할 수 있습니다.

### 4.1. 상태 관리 라이브러리:
React 기본 상태 관리로 충분하지 않을 경우 Redux 또는 zustand 같은 상태 관리 라이브러리를 사용할 수 있습니다.

```bash
npm install redux react-redux
```

### 4.2. 아이콘 라이브러리:
아이콘을 사용하고 싶다면 react-icons를 설치합니다.

```bash
npm install react-icons
```

## 5. 개발 서버 실행
파일 정리와 기본 코드 작성이 끝난 뒤, 아래 명령어로 앱을 실행합니다.

``` bash
npm start
```

브라우저에서 http://localhost:3000에 접속하여 앱을 확인합니다.
