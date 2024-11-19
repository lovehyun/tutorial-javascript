
# Debug 모듈을 활용한 Express 애플리케이션 디버깅 설정

`debug` 모듈을 사용하여 Express 애플리케이션의 디버깅 메시지를 출력하고 관리하는 방법에 대한 안내입니다.

---

## 1. 설치

먼저 `debug` 모듈을 설치합니다:

```bash
npm install debug
```

---

## 2. 실행 명령어

`DEBUG` 환경 변수를 설정하여 디버깅을 활성화할 수 있습니다.

### Unix 계열 (macOS, Linux)
```bash
DEBUG=myapp:server node app.js
DEBUG=myapp:server,myapp:request node app.js
DEBUG=myapp:* node app.js
```

### Windows (환경 변수 설정 방식이 다름)
#### Windows 기본 명령어
```bash
set DEBUG=myapp:server && node app.js
set DEBUG=myapp:server,myapp:request && node app.js
set DEBUG=myapp:* && node app.js
```

#### Windows + `cross-env` 사용 (추천)
`cross-env`를 설치한 경우:
```bash
npx cross-env DEBUG=myapp:* node app.js
```

---

## 3. 디버깅 영역 설정

### 모든 영역 활성화
```bash
DEBUG=myapp:* node app.js
```

### 특정 영역만 활성화
- **서버 관련 디버깅만 출력**:
  ```bash
  DEBUG=myapp:server node app.js
  ```
- **업로드 관련 디버깅만 출력**:
  ```bash
  DEBUG=myapp:upload node app.js
  ```
- **요청 관련 디버깅만 출력**:
  ```bash
  DEBUG=myapp:request node app.js
  ```

---

## 4. 출력 예시

### 명령어
```bash
DEBUG=myapp:* node app.js
```

### 실행 결과 (예시)
```plaintext
  myapp:server 서버 시작 +0ms
Server is ready on 3000
  myapp:request Request:  / +2ms
  myapp:request Request:  /upload?key=testKey +1ms
  myapp:upload upload 기능 요청:  testKey +0ms
```

---

## 5. 동적 디버깅 활성화 및 비활성화 (추가 기능)

### 설명

아래는 런타임에서 디버깅 상태를 동적으로 켜고 끌 수 있는 기능을 구현한 예제입니다. 
특정 경로(`/debug`)에 쿼리 파라미터로 요청하여 디버그 설정을 변경할 수 있습니다.

### 코드 예제

```
생략
```

---

### cURL 명령어로 디버깅 제어

#### 1. 모든 디버깅 활성화
```bash
curl "http://localhost:3000/debug?server=1&upload=1&request=1"
```

#### 2. 특정 디버깅만 활성화 (예: `myapp:server`)
```bash
curl "http://localhost:3000/debug?server=1&upload=0&request=0"
```

#### 3. 특정 디버깅 비활성화 (예: `myapp:upload`)
```bash
curl "http://localhost:3000/debug?upload=0"
```

#### 4. 현재 상태 확인
```bash
curl "http://localhost:3000/debug"
```

#### 응답 예시:
```json
{
  "server": 1,
  "upload": 0,
  "request": 1
}
```

---

### 테스트 요청 cURL

```
curl "http://localhost:3000/"
curl "http://localhost:3000/upload?key=exampleKey"
curl "http://localhost:3000/admin"
```

---

이 설정은 `debug` 모듈을 활용한 정적 및 동적 디버깅 활성화 방법을 모두 포함하며, 개발 및 유지보수에 매우 유용하게 사용할 수 있습니다.
