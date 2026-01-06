
# React Hooks와 useEffect

## React Hooks란?
React Hooks는 함수형 컴포넌트에서 상태와 생명주기 기능을 사용할 수 있도록 도와주는 기능입니다.  
React 16.8에서 처음 도입되었으며, 클래스형 컴포넌트의 복잡성을 줄이고 더 직관적으로 코드를 작성할 수 있게 합니다.

### Hooks의 주요 특징
- **상태 관리**: 함수형 컴포넌트에서도 `useState`를 통해 상태를 관리 가능.
- **생명주기 관리**: `useEffect`로 렌더링 후의 동작과 정리(cleanup) 작업 수행.
- **재사용성**: Custom Hook을 통해 로직을 재사용 가능.
- **클래스 불필요**: 클래스형 컴포넌트 없이도 React의 대부분 기능 사용 가능.

### 주요 Hooks 종류
1. **useState**  
   상태(state)를 관리하기 위한 Hook.  
   ```jsx
   import React, { useState } from 'react';

   function Counter() {
       const [count, setCount] = useState(0); // 초기 상태는 0

       return (
           <div>
               <p>현재 카운트: {count}</p>
               <button onClick={() => setCount(count + 1)}>증가</button>
           </div>
       );
   }
   ```

2. **useEffect**  
   컴포넌트의 **사이드 이펙트(side effects)**를 관리하기 위한 Hook.

3. **useContext**  
   Context API와 함께 사용하여 전역 상태를 쉽게 관리.

4. **useReducer**  
   복잡한 상태 로직을 처리하기 위한 Hook. Redux와 비슷한 방식.

5. **useMemo, useCallback**  
   성능 최적화를 위한 메모이제이션.

---

## useEffect란?
`useEffect`는 함수형 컴포넌트에서 **사이드 이펙트(side effects)**를 처리하기 위한 Hook입니다.  
React의 클래스형 컴포넌트에서의 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`를 통합한 기능을 제공합니다.

### useEffect의 주요 특징
1. **렌더링 후 실행**  
   컴포넌트가 렌더링된 직후 실행됩니다.

2. **의존성 배열**  
   특정 상태나 props가 변경될 때만 실행되도록 제어할 수 있습니다.

3. **정리 작업 (Cleanup)**  
   컴포넌트가 언마운트되거나 `useEffect`가 다시 실행되기 전에 정리 작업 수행.

---

### useEffect 사용법

#### 기본 사용법
```jsx
import React, { useState, useEffect } from 'react';

function Example() {
    const [count, setCount] = useState(0);

    // useEffect: 렌더링 후 실행
    useEffect(() => {
        console.log(`You clicked ${count} times`);
    });

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    );
}
```

#### 의존성 배열
- `useEffect`가 언제 실행될지를 제어합니다.
- **빈 배열(`[]`)**: 처음 렌더링될 때만 실행.
- **특정 변수 배열([state, props])**: 해당 값이 변경될 때만 실행.

```jsx
useEffect(() => {
    console.log('This will only run once after the initial render');
}, []); // 빈 배열: 처음 렌더링 시 실행

useEffect(() => {
    console.log('Count has changed:', count);
}, [count]); // count가 변경될 때 실행
```

#### Cleanup 함수
- `useEffect` 내에서 함수를 반환하면 **정리 작업(Cleanup)**을 수행합니다.
- 주로 이벤트 리스너 해제, 타이머 제거 등에 사용.

```jsx
useEffect(() => {
    const interval = setInterval(() => {
        console.log('Interval running');
    }, 1000);

    return () => {
        clearInterval(interval); // 정리 작업
        console.log('Interval cleared');
    };
}, []);
```

---

### 정리: useEffect의 실행 흐름
1. 처음 렌더링 시 실행 (의존성 배열 없이).
2. 의존성 배열 내 값이 변경되면 실행.
3. 컴포넌트 언마운트 또는 재실행 전에 정리 작업 수행.

---

### 실전 예제

#### 1. API 호출
```jsx
import React, { useState, useEffect } from 'react';

function FetchData() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts/1')
            .then((response) => response.json())
            .then((json) => setData(json));
    }, []); // 빈 배열: 처음 렌더링 시 한 번만 실행

    return (
        <div>
            <h1>API 데이터</h1>
            {data ? <p>{data.title}</p> : <p>Loading...</p>}
        </div>
    );
}
```

#### 2. 브라우저 타이틀 변경
```jsx
import React, { useState, useEffect } from 'react';

function UpdateTitle() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        document.title = `Clicked ${count} times`;
    }, [count]); // count가 변경될 때만 실행

    return (
        <div>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    );
}
```

---

## 주의사항
1. **의존성 배열 누락 방지**: 의존성 배열에 필요한 값을 누락하면 의도치 않은 동작이 발생할 수 있습니다.
2. **렌더링 성능 고려**: 불필요한 `useEffect` 호출을 피하기 위해 의존성 배열을 신중히 설정.

---

## 참고
- React 공식 문서: [React Hooks](https://reactjs.org/docs/hooks-intro.html)
