# 3. Props와 State를 함께 사용
props와 state를 결합하여 데이터 전달과 상태 관리를 동시에 학습합니다.

## Props + State 활용 예제
- 목표:
  - 부모(Counter)의 state를 자식(Message)으로 전달.
  - 상태가 변경되면 props를 통해 자식의 UI도 동적으로 업데이트.

### Message.js 생성
```jsx
import React from 'react';

const Message = ({ count }) => {
  return <p>The current count is: {count}</p>;
};

export default Message;
```

### Counter.js 수정
```jsx
import React, { useState } from 'react';
import Message from './Message'; // Message 컴포넌트 추가

const Counter = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => setCount(count - 1);

  return (
    <div>
      <h2>Counter</h2>
      {/* Props로 state 전달 */}
      <Message count={count} />
      <button onClick={handleIncrement}>Increase</button>
      <button onClick={handleDecrement}>Decrease</button>
    </div>
  );
};

export default Counter;
```

## 특징
- 상태 소유자:
  - Counter 컴포넌트가 상태(count)와 상태 변경 함수(setCount)를 직접 소유합니다.
- 독립적:
  - Counter는 외부에서 아무것도 받지 않으며, 상태를 자체적으로 관리합니다.
- 재사용 제한:
  - 상태가 컴포넌트 내부에 있으므로, 동일한 상태를 다른 컴포넌트와 공유하거나 조작할 수 없습니다.

## 사용 시점
- 단일 컴포넌트가 상태를 관리하고, 다른 컴포넌트와 상태를 공유할 필요가 없을 때.
- 컴포넌트를 독립적으로 동작하게 만들고 싶을 때.
