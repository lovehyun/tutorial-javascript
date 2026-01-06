# 리엑트 앱 초기화
리액트 앱을 생성하면 기본적으로 여러 파일과 코드가 포함되어 있습니다. 필요하지 않은 파일을 제거하고, 기본 디렉토리 구조를 단순화하거나 백지 상태로 시작하려면 다음 과정을 따르세요.

## 1. 기본적으로 지워야 하는 파일
create-react-app으로 생성된 프로젝트에서 불필요한 파일:

- CSS 및 이미지 파일:
  - src/App.css
  - src/index.css
  - src/logo.svg
- 테스트 및 기타 파일:
  - src/App.test.js
  - src/reportWebVitals.js
  - src/setupTests.js

## 2. 필요 없는 코드 제거
src/index.js와 src/App.js에 포함된 초기 코드를 간소화합니다.

### 변경 전: index.js
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
```

### 변경 후: index.js
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

### 변경 전: App.js
```jsx
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;
```

### 변경 후: App.js
```jsx
import React from 'react';

const App = () => {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
};

export default App;
```

## 3. 기본 디렉토리 구조
간단하고 효율적인 프로젝트 디렉토리 구조:

```plaintext
src/
├── components/       # 재사용 가능한 컴포넌트
│   ├── Header.js
│   ├── Footer.js
├── pages/            # 페이지 단위 컴포넌트
│   ├── HomePage.js
│   ├── AboutPage.js
├── App.js            # 전체 앱 구성
├── index.js          # 앱 진입점
```

- components/: 공통 헤더, 푸터, 버튼 등 재사용 가능한 컴포넌트.
- pages/: 각각의 라우트에 해당하는 페이지 컴포넌트.

---

## 4. 백지 상태에서 시작하기
create-react-app을 사용하지 않고 백지 상태에서 시작하려면:

1) 디렉토리 생성
```bash
mkdir my-react-app
cd my-react-app
npm init -y
```

2) 필요한 패키지 설치
```bash
npm install react react-dom
npm install -D webpack webpack-cli babel-loader @babel/core @babel/preset-env @babel/preset-react html-webpack-plugin
```

3) 기본 설정 파일 추가
webpack.config.js:

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
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  devServer: {
    contentBase: './dist',
  },
};
```

.babelrc:

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

4) 기본 파일 구조 생성

```plaintext
src/
├── index.js
├── App.js
└── index.html
```

index.html:

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

index.js:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

App.js:

```jsx
import React from 'react';

const App = () => <h1>Hello, World!</h1>;

export default App;
```

5) 실행

```bash
npx webpack serve
```
