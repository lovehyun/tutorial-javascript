# 2. State 학습 추가
state는 컴포넌트 내부에서 관리되는 데이터입니다. 이를 배우려면 컴포넌트가 상태를 변경하는 간단한 예제를 추가합니다.

## State란?
State는 리액트 컴포넌트 내부에서 관리되는 동적인 데이터입니다. State는 컴포넌트의 상태를 나타내며, 사용자가 상호작용하거나 내부 로직이 변경되면 State가 업데이트되고, 이에 따라 UI가 다시 렌더링됩니다.

## State의 주요 특징
1. 컴포넌트 내부에서 관리
  - State는 컴포넌트 안에서 선언되고 관리됩니다.
  - 외부에서 직접 변경할 수 없으며, 컴포넌트가 자체적으로 업데이트합니다.
2. 동적 데이터 관리
  - State는 시간이 지남에 따라 변경될 수 있는 데이터(예: 입력값, 버튼 클릭 횟수, API 응답 등)를 저장합니다.
3. State 변경 시 UI 자동 업데이트
  - State가 변경되면 해당 상태를 사용하는 컴포넌트와 UI가 자동으로 다시 렌더링됩니다.
4. State는 비동기로 업데이트
  - State 업데이트는 비동기로 이루어지며, 최신 상태는 State 업데이트 함수(setState 또는 useState)를 사용해야 확인할 수 있습니다.

## State 예제
- 목표:
  - useState를 사용하여 상태를 선언하고 상태 변경.
  - 상태 변경에 따라 UI가 업데이트되는 것을 학습.

### App.js 수정
```jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Counter from './Counter'; // Counter 추가

const App = () => {
  const pageTitle = "Welcome to My Website";

  return (
    <div>
      <Header title={pageTitle} />
      <main>
        <p>This is the main content area.</p>
        {/* Counter 컴포넌트 사용 */}
        <Counter />
      </main>
      <Footer />
    </div>
  );
};

export default App;
```

### Counter.js 생성 (State 사용)
```jsx
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0); // State 선언

  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => setCount(count - 1);

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={handleIncrement}>Increase</button>
      <button onClick={handleDecrement}>Decrease</button>
    </div>
  );
};

export default Counter;
```
