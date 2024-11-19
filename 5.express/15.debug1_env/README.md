
# 실행 방법

## 패키지 설정

### 1. 기본 설정 (`Linux` 환경)
```json
"scripts": {
  "start": "node app.js",
  "start:prod": "NODE_ENV=production node app.js"
}
```

### 2. 윈도우 환경 설정
```json
"scripts": {
  "start": "node app.js",
  "start:prod": "set NODE_ENV=production && node app.js"
}
```

### 3. 크로스 플랫폼 설정 (권장)
운영 체제에 관계없이 빌드를 지원하기 위해 `cross-env` 패키지를 사용합니다.

#### `cross-env` 설치
```bash
npm install --save-dev cross-env
npm install -D cross-env
```

#### 수정된 스크립트
```json
"scripts": {
  "start": "node app.js",
  "start:prod": "cross-env NODE_ENV=production node app.js"
}
```

---

## 실행 명령어

### 1. 개발 환경 (디버깅 활성화)
```bash
npm start
```

### 2. 프로덕션 환경 (디버깅 비활성화)
```bash
npm run start:prod
```

---

## 실행 결과

### 개발 모드 (`DEBUG=true`)
```plaintext
[DEBUG] GET /
Server running on http://localhost:3000 in development mode
[DEBUG] GET /error
[DEBUG ERROR] This is a test error.
```

### 프로덕션 모드 (`DEBUG=false`)
```plaintext
Running in production mode. Debugging is disabled.
Server running on http://localhost:3000 in production mode
```

---

### 정리
1. **`cross-env` 사용**을 통해 윈도우와 유닉스 환경 모두에서 동일한 방식으로 스크립트를 실행할 수 있습니다.
2. 디버깅 모드와 프로덕션 모드를 명확히 구분하여 개발 및 배포 환경을 효율적으로 관리할 수 있습니다.
