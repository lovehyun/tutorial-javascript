# 자바스크립트 비동기 처리, Promise, async/await, 그리고 이벤트 루프

## 📌 비동기 처리란?
자바스크립트는 싱글 스레드 기반 언어로, 기본적으로 코드가 위에서 아래로 **순차적(동기적)** 으로 실행됩니다. 하지만 네트워크 요청, 타이머, 파일 읽기 등의 작업은 시간이 오래 걸릴 수 있으므로, 이러한 작업을 **비동기적으로 처리**하여 사용자 경험을 향상시킵니다.

---

## 🧱 Promise란?
`Promise`는 비동기 작업의 **성공 또는 실패**를 나타내는 객체입니다.

```js
const promise = new Promise((resolve, reject) => {
    // 비동기 처리
    if (성공) resolve(result);
    else reject(error);
});
```

### ✔️ 상태
- `pending`: 대기 중
- `fulfilled`: 완료됨 (`resolve`)
- `rejected`: 실패 (`reject`)

### ✔️ 사용 예시
```js
fetch('https://example.com')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

---

## ✨ async / await
`async/await`는 `Promise`를 **더 직관적이고 동기식처럼** 보이게 작성할 수 있게 해줍니다.

```js
async function getData() {
    try {
        const response = await fetch('https://example.com');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
```

- `async` 함수는 항상 `Promise`를 반환합니다.
- `await`는 `Promise`가 처리될 때까지 **기다립니다.**

---

## 🔁 이벤트 루프(Event Loop)

자바스크립트 런타임(브라우저 또는 Node.js)의 **이벤트 루프(Event Loop)**는 비동기 처리를 **언제 실행할지** 결정하는 핵심 역할을 합니다.

### 📌 주요 구성
```
┌──────────────┐
│ Call Stack   │ ← 동기 코드 실행
└──────────────┘
       ↓
┌─────────────────────┐
│ Microtask Queue     │ ← Promise.then, async/await
└─────────────────────┘
       ↓
┌─────────────────────┐
│ Event Loop          │ ← Stack이 비면 큐를 실행
└─────────────────────┘
       ↓
┌────────────────────────┐
│ Task Queue (macrotask) │ ← setTimeout, fetch
└────────────────────────┘
```

### 예시
```js
console.log('A');

Promise.resolve().then(() => {
    console.log('B');
});

console.log('C');
```

**출력:**
```
A
C
B
```

- `Promise.then()`은 **Microtask Queue**에 들어가서 Call Stack이 끝난 뒤 실행됩니다.

---

## ✅ 정리

| 항목             | 처리 위치          | 예시                                 |
|------------------|---------------------|----------------------------------------|
| 동기 코드        | Call Stack          | `console.log("A")`                     |
| 마이크로태스크   | Microtask Queue     | `Promise.then(...)`, `await`          |
| 매크로태스크     | Task Queue          | `setTimeout(...)`, `fetch().then(...)`|

---

## 📚 결론

- `Promise`는 비동기 처리를 객체로 표현하는 방법
- `async/await`는 Promise를 더 쉽게 사용하는 문법
- 비동기 작업은 이벤트 루프가 관리하며, 순차 실행을 보장하지 않음
