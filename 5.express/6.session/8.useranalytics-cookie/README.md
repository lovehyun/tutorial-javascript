
# 세션 쿠키와 일반 쿠키

쿠키는 클라이언트 측에 데이터를 저장하여 서버와의 상태를 유지하거나 정보를 관리하는 데 사용됩니다. 쿠키는 **세션 쿠키(Session Cookie)**와 **일반 쿠키(Persistent Cookie)**로 나뉩니다.

---

## 1. 세션 쿠키 (Session Cookie)

### 특징
- **유효 기간이 설정되지 않은 쿠키**.
- 브라우저가 **열려 있는 동안**에만 유지됩니다.
- 브라우저를 **닫으면 자동으로 삭제**됩니다.
- 브라우저 메모리에만 저장되며, 파일로 저장되지 않습니다.
- 보통 **일시적인 데이터**나 세션 상태를 유지하는 데 사용됩니다.

### 사용 사례
- 사용자 인증 상태 유지 (로그인 세션).
- 쇼핑몰의 장바구니 데이터.
- 웹 애플리케이션에서 **세션 기반 트래킹**.

### 예시
```plaintext
Name:   session_id
Value:  abc123
Domain: example.com
Expires: (Not Set)
```

### 설정 방법 (Node.js 예제)
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.cookie('session_id', 'abc123', { path: '/' }); // 세션 쿠키 설정
    res.send('Session cookie set!');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

---

## 2. 일반 쿠키 (Persistent Cookie)

### 특징
- **유효 기간(expires)** 또는 **max-age**가 설정된 쿠키.
- 지정된 만료 시간까지 저장됩니다.
- 브라우저를 닫아도 삭제되지 않으며, **만료 기간**이 지나기 전까지 유지됩니다.
- 디스크에 저장되어 브라우저를 다시 열어도 접근 가능.
- 보통 **사용자 환경 설정**이나 **장기적인 데이터**를 저장하는 데 사용됩니다.

### 사용 사례
- 로그인 상태 유지 (자동 로그인).
- 사용자 기본 설정 (언어, 테마 등).
- 광고 트래킹 또는 장기 데이터 관리.

### 예시
```plaintext
Name:   theme
Value:  dark
Domain: example.com
Expires: Tue, 28 Nov 2024 12:00:00 GMT
```

### 설정 방법 (Node.js 예제)
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.cookie('theme', 'dark', {
        path: '/',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24시간 후 만료
    });
    res.send('Persistent cookie set!');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

---

## 3. 세션 쿠키와 일반 쿠키 비교

| **특징**            | **세션 쿠키**                                | **일반 쿠키**                          |
|---------------------|---------------------------------------------|---------------------------------------|
| **유효 기간 설정**   | 없음                                        | `expires` 또는 `max-age`로 설정 가능    |
| **저장 위치**        | 브라우저 메모리                            | 브라우저 파일로 저장                  |
| **유효 기간**        | 브라우저 세션 동안                          | 설정된 유효 기간까지 유지             |
| **삭제 시점**        | 브라우저 종료 시 자동 삭제                  | 유효 기간 만료 시 또는 사용자에 의해 삭제 |
| **사용 목적**        | 단기 데이터 (세션 ID, 임시 설정)             | 장기 데이터 (로그인 상태, 환경 설정)   |

---

## 4. 쿠키 확인 및 관리 방법

### 브라우저에서 쿠키 확인
1. **Chrome/Edge**:
   - `F12` 키를 눌러 개발자 도구 열기.
   - **Application 탭 > Storage > Cookies**를 선택.
   - 현재 웹사이트의 쿠키 목록 확인.

2. **세션 쿠키와 일반 쿠키 구분**:
   - `Expires` 또는 `Max-Age` 속성이 없는 경우 세션 쿠키.
   - `Expires`가 설정되어 있다면 일반 쿠키.

### JavaScript로 쿠키 확인
```javascript
document.cookie.split(';').forEach((cookie) => {
    console.log(cookie.trim());
});
```

---

## 5. 보안 관련 옵션
- **HttpOnly**:
  - 쿠키를 JavaScript로 접근하지 못하도록 설정.
  - XSS 공격 방지에 유용.
  - 설정 예시: `res.cookie('key', 'value', { httpOnly: true });`

- **Secure**:
  - HTTPS 환경에서만 쿠키를 전송.
  - 설정 예시: `res.cookie('key', 'value', { secure: true });`

- **SameSite**:
  - 크로스 사이트 요청에서 쿠키 전송 제한.
  - 설정 예시: `res.cookie('key', 'value', { sameSite: 'Strict' });`

