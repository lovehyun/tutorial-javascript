# 컴포넌트간에 메세지 전달

1. 다중 상태 관리
  - Counter의 상태를 App.js로 올려서 여러 컴포넌트에서 공유.
  - 추가 Counter 컴포넌트를 만들어 상태를 독립적으로 관리하거나 공유.
2. 새로운 상태와 기능 추가
  - Message.js와 연계하여 상태에 따라 동적으로 메시지를 업데이트.
  - 예: 버튼 클릭 시 다른 컴포넌트에서 메시지를 표시.
3. 입력과 출력 연동 
  - 새로운 입력 필드 컴포넌트를 추가하여 상태를 변경.
  - Counter.js와 Message.js를 연결해 상태 기반 UI 렌더링.

## 추가된 기능
1. Counter와 Message 연계
  - count가 10 이상이면 Message에 특별한 메시지를 표시.
2. Input 컴포넌트 추가
  - 사용자가 입력한 텍스트를 Message에 표시.

## 확장된 동작 흐름
1. Counter 상태 공유:
  - App.js에서 count와 setCount를 관리.
  - Counter.js에서 상태를 업데이트.
2. Message 상태 연계:
  - Message.js는 count와 message를 받아 동적 콘텐츠를 렌더링.
3. Input 컴포넌트와 상태 연동:
  - Input.js에서 사용자가 입력한 메시지를 setMessage를 통해 상태로 업데이트.

### 확장된 파일 구조
```plaintext
src/
├── App.js           // 부모 컴포넌트: 상태 관리와 데이터 흐름 중심
├── Counter.js       // Counter 컴포넌트: 버튼 클릭으로 상태 변경
├── Footer.js        // Footer: 정적 콘텐츠
├── Header.js        // Header: 제목 표시
├── index.js         // 애플리케이션 진입점
├── Message.js       // 상태에 따른 메시지 렌더링
└── Input.js         // [확장] 사용자 입력 필드 추가
```

### 확장된 코드
1. App.js
상태를 App.js로 올리고, 하위 컴포넌트가 상태를 공유하도록 변경.

```jsx
import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Counter from "./Counter";
import Message from "./Message";
import Input from "./Input";

const App = () => {
  const [count, setCount] = useState(0); // Counter 상태
  const [message, setMessage] = useState(""); // Input에서 사용될 메시지 상태

  return (
    <div>
      <Header title="React App" />
      <main>
        <Counter count={count} setCount={setCount} />
        <Message count={count} message={message} />
        <Input setMessage={setMessage} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
```

2. Counter.js

부모(App.js)에서 받은 count와 setCount를 사용.

```jsx
import React from "react";

const Counter = ({ count, setCount }) => {
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increase</button>
      <button onClick={() => setCount(count - 1)}>Decrease</button>
    </div>
  );
};

export default Counter;
```

#### 특징
- 상태 소유자:
  - 상태(count와 setCount)는 부모 컴포넌트에서 전달됩니다.
  - Counter는 상태를 받아서 사용하는 역할만 합니다.
- 공유 가능:
  - 동일한 상태를 여러 컴포넌트에 전달하거나, 여러 컴포넌트에서 같은 상태를 조작할 수 있습니다.
- 단순화:
  - 상태와 관련된 로직은 부모 컴포넌트에 집중되며, Counter는 상태를 조작하는 UI만 담당합니다.

#### 사용 시점
- 다수의 컴포넌트가 동일한 상태를 공유해야 할 때.
- 부모 컴포넌트에서 상태를 중앙에서 관리하고, 자식 컴포넌트는 단순히 UI를 렌더링하도록 만들고 싶을 때.

3. Message.js

count와 message를 받아 동적 메시지를 표시.

```jsx
import React from "react";

const Message = ({ count, message }) => {
  return (
    <div>
      <h3>Message: {message}</h3>
      {count > 10 && <p>You've clicked more than 10 times!</p>}
    </div>
  );
};

export default Message;
```

4. Input.js

setMessage를 사용해 사용자가 입력한 메시지를 상태로 업데이트.

```jsx
import React from "react";

const Input = ({ setMessage }) => {
  return (
    <div>
      <label>Enter a message: </label>
      <input
        type="text"
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type here..."
      />
    </div>
  );
};

export default Input;
```
