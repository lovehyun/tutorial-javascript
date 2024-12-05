
# SOP, CORS, 그리고 Express에서의 동작 원리

## 1. SOP (Same-Origin Policy)
### SOP란 무엇인가?
- **Same-Origin Policy (SOP)**는 브라우저 보안 모델의 핵심 정책으로, 웹 페이지가 자신이 로드된 도메인(Origin) 외부의 리소스와 상호작용하는 것을 제한합니다.
- **Origin의 정의**:
  - 프로토콜, 호스트(도메인 이름), 포트를 기준으로 동일한 Origin인지 판단.
  - 예: 
    - `https://example.com:443`와 `http://example.com:80`은 Origin이 다름.

### SOP가 해결하고자 하는 문제
1. **민감한 데이터 보호**:
   - 다른 도메인의 악성 스크립트가 사용자의 인증 정보(쿠키, 세션)를 무단으로 이용하거나 데이터를 훔치는 것을 방지.

2. **무분별한 데이터 노출 차단**:
   - 웹 애플리케이션이 실수나 취약점으로 인해 다른 Origin에 데이터를 노출하지 못하도록 제한.

3. **공격 벡터 차단**:
   - **XSS (Cross-Site Scripting)**와 **CSRF (Cross-Site Request Forgery)**와 같은 보안 문제를 최소화.

### SOP의 작동 방식
- 기본적으로 동일한 Origin에서만:
  - **DOM 접근 가능**.
  - **데이터 요청 및 응답 읽기 가능**.

- **차단 예시**:
  - 다른 Origin에서 `XMLHttpRequest` 또는 `fetch`를 통해 데이터를 요청하려고 하면, SOP가 이를 차단.

- **허용 예외**:
  - `<script>` 태그를 통해 JavaScript 라이브러리를 로드하거나, `<img>` 태그로 이미지를 로드하는 등의 단순 리소스 요청은 SOP가 허용.

### SOP의 한계
- SOP는 다른 Origin으로의 요청 자체를 완전히 막지는 못합니다. 요청은 가능하지만, **응답 데이터를 읽지 못하도록 차단**.
- SOP만으로 모든 보안 문제를 해결할 수 없으며, 유연한 데이터 교환을 위해 CORS와 같은 추가 메커니즘이 필요.

---

## 2. CORS (Cross-Origin Resource Sharing)
### CORS란 무엇인가?
- **CORS**는 SOP의 제한을 우회하여 **안전한 Cross-Origin 데이터 교환을 가능하게 하는 보안 메커니즘**입니다.
- CORS는 서버가 허용된 Origin에서의 요청만 처리하도록 설정하며, 허용되지 않은 요청은 차단됩니다.

### CORS의 도입 배경
- SOP는 보안을 강화하지만, 합법적인 Cross-Origin 요청도 차단.
- 예: 
  - API 서버와 클라이언트가 서로 다른 도메인에 배포된 경우.
  - CDN(Content Delivery Network)에서 리소스를 로드하는 경우.
- 이를 해결하기 위해 서버가 명시적으로 허용된 요청만 받아들일 수 있도록 설계된 것이 CORS.

### 주요 CORS 헤더
1. **`Access-Control-Allow-Origin`**:
   - 허용된 Origin을 명시.
   - 예: `Access-Control-Allow-Origin: http://localhost:3001`.
   - `*`를 사용하면 모든 Origin 허용.

2. **`Access-Control-Allow-Methods`**:
   - 허용된 HTTP 메서드(예: `GET`, `POST`, `PUT`, `DELETE`)를 지정.

3. **`Access-Control-Allow-Headers`**:
   - 클라이언트 요청에서 허용할 추가 헤더를 명시(예: `Authorization`, `Content-Type`).

4. **`Access-Control-Allow-Credentials`**:
   - 쿠키와 같은 인증 정보를 요청에 포함할 수 있는지 여부를 지정.

### CORS의 동작 방식
1. **단순 요청(Simple Request)**:
   - GET, POST 메서드로 기본적인 요청을 보낼 때 Preflight 요청 없이 바로 실행.

2. **Preflight 요청**:
   - 요청이 단순 요청의 조건을 충족하지 못하면, 브라우저는 **OPTIONS 메서드**를 사용하여 서버의 CORS 정책을 확인.

### CORS 동작 흐름
1. **Preflight 요청**:
   - 브라우저는 클라이언트가 보내려는 요청의 정책이 허용되는지 확인하기 위해 OPTIONS 요청을 보냄.

2. **Preflight 응답**:
   - 서버는 허용된 Origin, 메서드, 헤더 정보를 포함한 응답을 반환.

3. **실제 요청**:
   - Preflight 요청이 성공하면, 브라우저는 실제 데이터를 포함한 요청을 전송.

---

## 3. Preflight 요청과 Express에서의 처리
### Preflight 요청이란?
- 브라우저가 안전성을 확인하기 위해 보내는 **OPTIONS 메서드 요청**.
- 발생 조건:
  - HTTP 메서드가 `PUT`, `DELETE`, `PATCH` 등인 경우.
  - 요청에 `Authorization`과 같은 커스텀 헤더가 포함된 경우.

### Preflight 요청 내용
#### 요청 예시
```http
OPTIONS /api/resource HTTP/1.1
Origin: http://localhost:3001
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Authorization
```

#### 응답 예시
```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
```

### Express에서 CORS 처리
#### `cors` 모듈을 사용한 간단한 설정
```javascript
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors({
    origin: 'http://localhost:3001', // React 개발 서버 도메인 허용
    // origin: ['http://localhost:3001', 'http://localhost:3000'], // 여러 도메인 허용
}));
```

#### Preflight 요청 직접 처리
```javascript
app.options('/api/resource', (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.status(204).send();
});
```

---

## 4. 결론
- **SOP**는 브라우저의 기본 보안 모델로, Cross-Origin 데이터 접근을 제한하여 사용자를 보호.
- **CORS**는 SOP를 보완하여, 명시적으로 허용된 Origin과의 안전한 데이터 교환을 가능하게 함.
- **Preflight 요청**은 브라우저가 서버의 정책을 확인하기 위해 자동으로 발생하며, 이를 적절히 처리하면 클라이언트와 서버 간의 유연한 통신이 가능.

---

## 참고: 보안 강화 방법
1. **CORS 정책을 올바르게 설정**:
   - `Access-Control-Allow-Origin`을 `*` 대신 특정 도메인으로 제한.

2. **CSRF 방지**:
   - CSRF 토큰을 사용하여 인증된 요청만 허용.

3. **쿠키 설정**:
   - `SameSite=Strict` 또는 `Lax`로 설정하여 크로스-Origin 요청에서 쿠키 전송 제한.

4. **Content Security Policy (CSP)**:
   - 악성 스크립트가 임의의 도메인으로 요청을 보내지 못하도록 제한.
