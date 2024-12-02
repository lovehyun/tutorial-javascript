
# React 설치 및 수동 구성 가이드

---

## **1. 최신 React 설치**

최신 React 버전을 설치하려면 아래 명령어를 사용하세요.

### **1.1 npm 사용**
```bash
npm install react@latest react-dom@latest
```

### **1.2 yarn 사용**
```bash
yarn add react@latest react-dom@latest
```

---

## **2. React 17 설치**

특정 버전(React 17)을 설치하려면 아래 명령어를 사용하세요.

### **2.1 npm 사용**
```bash
npm install react@17 react-dom@17
```

### **2.2 yarn 사용**
```bash
yarn add react@17 react-dom@17
```

---

## **3. React 프로젝트를 수동으로 구성**

React 프로젝트를 `create-react-app` 없이 수동으로 설정하는 방법은 다음과 같습니다.

### **3.1 프로젝트 디렉토리 생성**
```bash
mkdir my-react-app
cd my-react-app
```

### **3.2 npm 초기화**
```bash
npm init -y
```

### **3.3 React 및 React-DOM 설치**
```bash
npm install react react-dom
```

### **3.4 Webpack 및 Babel 설치**
React 애플리케이션을 빌드하고 변환하기 위해 Webpack과 Babel을 설치합니다.

```bash
npm install webpack webpack-cli webpack-dev-server --save-dev
npm install babel-loader @babel/core @babel/preset-env @babel/preset-react --save-dev
npm install html-webpack-plugin --save-dev
```

### **3.5 파일 구조 생성**
아래와 같은 디렉토리 구조를 만듭니다:

```
my-react-app/
├── src/
│   ├── index.js
│   └── App.js
├── public/
│   └── index.html
├── package.json
├── webpack.config.js
└── .babelrc
```

### **3.6 Webpack 설정 파일 생성**
`webpack.config.js` 파일을 생성하고 다음 내용을 추가합니다:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    devServer: {
        static: './dist',
    },
    mode: 'development',
};
```

### **3.7 Babel 설정 파일 생성**
`.babelrc` 파일을 생성하고 다음 내용을 추가합니다:

```json
{
    "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

### **3.8 HTML 파일 작성**
`public/index.html` 파일을 생성하고 다음 내용을 추가합니다:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

### **3.9 React 진입 파일 작성**
`src/index.js` 파일을 생성하고 다음 내용을 추가합니다:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

### **3.10 React 컴포넌트 작성**
`src/App.js` 파일을 생성하고 다음 내용을 추가합니다:

```javascript
import React from 'react';

const App = () => {
    return <h1>Hello, React!</h1>;
};

export default App;
```

### **3.11 개발 서버 실행**
`package.json` 파일에 다음 스크립트를 추가합니다:

```json
"scripts": {
    "start": "webpack serve"
}
```

개발 서버를 실행하려면 아래 명령어를 입력합니다:
```bash
npm start
```

---

## **4. 요약**

1. **최신 React 설치**:
   - `npm install react@latest react-dom@latest` 또는 `yarn add react@latest react-dom@latest`.

2. **React 17 설치**:
   - `npm install react@17 react-dom@17` 또는 `yarn add react@17 react-dom@17`.

3. **수동 프로젝트 구성**:
   - Webpack, Babel, React, React-DOM 설치.
   - 설정 파일(`webpack.config.js`, `.babelrc`) 작성.
   - React 애플리케이션 파일 구조 생성 후 실행.

---

이 가이드를 따라 React 프로젝트를 최신 버전 또는 수동 구성으로 설정할 수 있습니다.

---

# React 라이브러리 안내 (React와 React-DOM: 차이점과 함께 설치해야 하는 이유)

---

## **1. React의 역할**
- **React 라이브러리**는 React의 핵심 기능을 제공합니다.
- 컴포넌트를 정의하고, 상태를 관리하며, UI를 구성하는 데 사용됩니다.
- React 자체는 DOM에 의존하지 않으며, 다양한 플랫폼에서 동작하도록 설계되었습니다.

### 주요 기능:
- **컴포넌트 정의**: React 컴포넌트를 생성 및 관리.
- **상태 관리**: `useState`, `useEffect`와 같은 Hook 제공.
- **플랫폼 독립적**: 웹, 모바일, 서버 등 다양한 환경에서 작동.

#### React를 사용하는 코드 예제:
```javascript
import React, { useState } from 'react';

const Counter = () => {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
};

export default Counter;
```

---

## **2. React-DOM의 역할**
- **React-DOM**은 React 컴포넌트를 **브라우저 DOM에 렌더링**하기 위한 라이브러리입니다.
- React는 플랫폼 독립적이지만, React-DOM은 브라우저 환경에 맞게 설계되었습니다.
- DOM에 컴포넌트를 삽입하고 렌더링하는 기능을 제공합니다.

### 주요 기능:
- React 컴포넌트를 브라우저 DOM에 연결.
- 브라우저 환경에 특화된 렌더링 메서드 제공.

#### React-DOM을 사용하는 코드 예제:
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

---

## **3. 왜 분리되었을까?**
React는 다양한 플랫폼에서 사용 가능하도록 설계되었습니다. 따라서, DOM 렌더링 관련 기능은 별도의 라이브러리로 분리되었습니다.

### 이유:
1. **플랫폼 독립성**:
   - React는 DOM에 국한되지 않고, 네이티브 앱(React Native), 서버 렌더링(SSR) 등 다양한 플랫폼에서 사용할 수 있습니다.

2. **유연성 제공**:
   - 웹에서만 동작하는 DOM 관련 기능을 React 자체에 포함시키지 않고, React-DOM으로 분리하여 필요할 때만 설치할 수 있습니다.

3. **경량화**:
   - DOM을 사용하지 않는 환경(예: React Native)에서는 React-DOM 없이 React만 사용 가능합니다.

---

## **4. 둘 다 설치해야 하는 이유**
- React와 React-DOM은 역할이 다르지만, **웹 애플리케이션**에서는 둘 다 필수적으로 설치해야 합니다.

### 설치하지 않을 경우:
1. **React만 설치**:
   - 컴포넌트를 정의하거나 상태를 관리할 수 있지만, 컴포넌트를 DOM에 렌더링할 수 없습니다.

2. **React-DOM만 설치**:
   - DOM에 렌더링은 가능하지만, 컴포넌트를 정의하거나 상태를 관리할 수 없습니다.

---

## **5. 정리**
- **React**: 컴포넌트를 정의하고 상태를 관리하는 핵심 라이브러리.
- **React-DOM**: React 컴포넌트를 브라우저 DOM에 렌더링하기 위한 라이브러리.
- 웹 애플리케이션에서는 둘 다 필요하며, 역할이 다르기 때문에 함께 설치해야 합니다.
