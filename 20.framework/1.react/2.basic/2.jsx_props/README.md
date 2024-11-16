# 1. Props 학습 추가
props는 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달할 때 사용합니다. 이 개념을 배우려면 아래와 같은 단계를 추가할 수 있습니다.

## Props란 무엇인가?
Props(Properties의 약자)는 리액트 컴포넌트에서 부모 컴포넌트가 자식 컴포넌트로 데이터를 전달할 때 사용하는 방법입니다. Props는 읽기 전용 데이터이며, 자식 컴포넌트 내부에서는 변경할 수 없습니다.

## Props의 주요 특징
1. 읽기 전용
  - Props는 자식 컴포넌트에서 값을 변경할 수 없습니다.
  - 데이터를 전달받아 UI를 렌더링하는 역할만 수행합니다.
2. 단방향 데이터 흐름
  - 데이터는 항상 부모에서 자식으로 흐릅니다.
  - 자식에서 부모로 데이터를 전달하려면 별도의 이벤트 핸들러(예: onClick)를 사용해야 합니다.
3. 컴포넌트의 재사용성을 높임
  - Props를 통해 같은 컴포넌트를 다양한 데이터로 렌더링할 수 있습니다.

## Props 예제
부모에서 자식으로 데이터 전달

- 목표:
  - props를 사용해 부모(App)에서 자식(Header)으로 데이터를 전달.
  - 자식 컴포넌트에서 props를 읽고 UI에 반영.

### App.js 수정
```jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const App = () => {
  const pageTitle = "Welcome to My Website";

  return (
    <div>
      {/* Props로 데이터를 전달 */}
      <Header title={pageTitle} />
      <main>
        <p>This is the main content area.</p>
      </main>
      <Footer />
    </div>
  );
};

export default App;
```

### Header.js 수정 (Props 사용)
```jsx
import React from 'react';

const Header = ({ title }) => {
  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
};

export default Header;
```
