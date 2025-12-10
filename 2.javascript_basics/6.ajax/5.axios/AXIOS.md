# 기본 문법 비교
```javascript
// fetch
const res = await fetch('/api/user');
if (!res.ok) throw new Error('Request failed');
const data = await res.json();

// axios
const res = await axios.get('/api/user');
const data = res.data;  // 바로 데이터
```

# 예외 처리 과정 비교
```javascript
// fetch
try {
  const res = await fetch('/api/user');
  if (!res.ok) {
    // 404, 500도 여기서 따로 처리해야 함
    throw new Error(`HTTP error: ${res.status}`);
  }
} catch (err) {
  // 네트워크 에러 + 위에서 던진 에러
}

// axios
try {
  const res = await axios.get('/api/user');
} catch (err) {
  // 404, 500 같은 HTTP 오류도 여기로 떨어짐
  // err.response.status 로 바로 확인 가능
}
```

# 메인에서 테스트 시...
```javascript
// test.js
async function main() {
    try {
        const res = await fetch('https://example.com/api/user');

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status}`);
        }

        const data = await res.json();
        console.log('결과:', data);
    } catch (err) {
        console.error('요청 중 에러 발생:', err);
    }
}

main();  // 메인 함수 실행
```

```javascript
// 즉시실행함수 (IIFE, Immediately Invoked Function Expression)
(async () => {
    try {
        const res = await fetch('https://example.com/api/user');

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status}`);
        }

        const data = await res.json();
        console.log('결과:', data);
    } catch (err) {
        console.error('요청 중 에러:', err);
    }
})();

```
