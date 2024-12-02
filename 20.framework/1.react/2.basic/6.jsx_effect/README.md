
# React의 `useState`와 `useEffect` 이해하기

## `useState`란?
`useState`는 **함수형 컴포넌트에서 상태를 관리**하기 위한 React Hook입니다. 상태 변수를 정의하고 업데이트할 수 있으며, 상태가 변경되면 컴포넌트가 다시 렌더링됩니다.

### `useState`의 주요 특징:
- 사용자 입력, 카운터 등의 동적인 데이터 관리.
- 상태가 업데이트되면 UI가 자동으로 갱신.
- 버튼 클릭과 같은 사용자 이벤트에 적합.

---

## `useEffect`란?
`useEffect`는 **함수형 컴포넌트에서 사이드 이펙트(side effects)**를 처리하기 위한 React Hook입니다. 사이드 이펙트란 컴포넌트가 렌더링된 후 발생하는 동작(예: API 호출, DOM 조작 등)을 의미합니다.

### `useEffect`의 주요 특징:
- 컴포넌트 렌더링 후 실행.
- 상태 또는 props 변화에 따른 작업 수행.
- 메모리 누수를 방지하기 위한 정리 작업(cleanup) 수행.

---

## `useState`와 `useEffect`의 차이점

| **`useState`**                                      | **`useEffect`**                                    |
|-----------------------------------------------------|---------------------------------------------------|
| 컴포넌트의 상태를 정의하고 관리                     | 렌더링 이후의 작업(사이드 이펙트) 처리             |
| 명시적으로 상태를 업데이트할 때 실행               | 렌더링 후 또는 상태/props가 변경될 때 실행         |
| 버튼 클릭, 사용자 입력 등 사용자 이벤트 처리에 적합 | 렌더링 기반 작업(API 호출, 이벤트 리스너 등록) 처리에 적합 |

---

## 예제

### 1. **사용자 이벤트로 데이터를 로드 (`useState`만 사용)**

```jsx
import React, { useState } from "react";

const App = () => {
    const [data, setData] = useState(null);

    const loadData = async () => {
        const randomId = Math.floor(Math.random() * 10) + 1; // 랜덤 ID 생성
        const response = await fetch(\`https://jsonplaceholder.typicode.com/posts/\${randomId}\`);
        const result = await response.json();
        setData(result); // 상태 업데이트
    };

    return (
        <div>
            <button onClick={loadData}>데이터 로드</button>
            <div>
                {data ? (
                    <div>
                        <h3>{data.title}</h3>
                        <p>{data.body}</p>
                    </div>
                ) : (
                    <p>데이터가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default App;
```

- **동작 방식**:
  - 사용자가 버튼을 클릭하면 `loadData` 함수가 실행됩니다.
  - 데이터를 가져와서 상태를 업데이트하며, UI가 자동으로 갱신됩니다.
  - 렌더링과 무관하게 명시적으로 동작하기 때문에 `useEffect`가 필요하지 않습니다.

---

### 2. **컴포넌트 렌더링 시 자동으로 데이터 로드 (`useEffect` 사용)**

```jsx
import React, { useState, useEffect } from "react";

const App = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
            const result = await response.json();
            setData(result);
        };

        fetchData(); // 컴포넌트 렌더링 시 데이터 로드
    }, []); // 빈 배열: 최초 렌더링 시 한 번만 실행

    return (
        <div>
            <h3>{data ? data.title : "로딩 중..."}</h3>
            <p>{data ? data.body : ""}</p>
        </div>
    );
};

export default App;
```

- **동작 방식**:
  - 컴포넌트가 렌더링된 직후 `useEffect`가 실행됩니다.
  - 데이터가 로드되고 상태가 업데이트되며 UI가 갱신됩니다.
  - 빈 배열(`[]`)을 의존성으로 설정하여 이 작업이 한 번만 실행되도록 보장합니다.

---

## 언제 사용해야 할까?

1. **`useState`를 사용할 때**:
   - 사용자가 명시적으로 동작을 트리거해야 할 때.
   - 예: 버튼 클릭, 사용자 입력 이벤트 등.

2. **`useEffect`를 사용할 때**:
   - 렌더링 이후 작업이 필요할 때.
   - 예: 초기 데이터 로드, 상태 변경에 따른 API 호출, DOM 조작.

---

## 요약
- **`useState`**는 명시적으로 상태를 관리하며, 사용자 이벤트에 적합합니다.
- **`useEffect`**는 컴포넌트 렌더링 이후 발생하는 작업에 적합합니다.
- 특정 작업이 사용자 인터랙션인지, 렌더링 이후 작업인지에 따라 적절한 Hook을 선택하세요.

---

## React 프로젝트 실행 방법

1. React 프로젝트 생성:
   ```bash
   npx create-react-app hook-examples
   cd hook-examples
   ```

2. `App.js`에 위 코드를 복사하여 실행:
   ```bash
   npm start
   ```

3. 각 예제를 테스트하면서 `useState`와 `useEffect`의 차이를 이해하세요.
