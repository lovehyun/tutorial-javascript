
# **빌드 방법 비교**

## 1. **일반적인 빌드 방법**

### 개요
- TypeScript를 `tsc`(TypeScript 컴파일러)로 JavaScript로 변환하고, 브라우저에서 실행 가능한 상태로 만듭니다.
- 별도의 번들링은 수행하지 않으며, TypeScript 파일당 JavaScript 파일이 각각 생성됩니다.

### 실행 방법
1. **번들링 패키지 설치**:
   ```bash
   npm install esbuild --save-dev
   ```

2. **빌드 스크립트 추가**:
   **`package.json`**
   ```json
   "scripts": {
     "build": "esbuild src/index.ts --bundle --outfile=public/app.js",
     "start": "npx http-server public"

   }
   ```

3. **빌드 실행**:
   ```bash
   npm run build
   ```

4. **HTTP 서버 실행**:
   ```bash
   npx http-server public
   or
   npm start
   ```

5. **브라우저에서 확인**:
   `http://localhost:8080`으로 접속합니다.

### 장점
- 모든 파일이 하나의 번들로 묶여 관리가 쉬움.
- 브라우저에서 별도의 서버 없이 실행 가능.
- TypeScript 설정이 간단하며, 번들링 도구(`esbuild`)로 인해 추가 작업이 필요 없음.

### 단점
- 브라우저 새로고침은 수동으로 해야 함.
- 대규모 프로젝트에서 번들 크기 최적화를 위해 추가 설정 필요.

---

## 2. **`esbuild`와 `live-server`를 사용하는 방법**

### 개요
- `esbuild`로 TypeScript 파일을 JavaScript로 번들링하며, `live-server`로 브라우저 자동 새로고침을 제공합니다.

### 실행 방법
1. **필수 패키지 설치**:
   ```bash
   npm install esbuild live-server --save-dev
   ```

2. **빌드 및 서버 스크립트 설정**:
   **`package.json`**
   ```json
   "scripts": {
     "dev": "esbuild src/index.ts --bundle --outfile=public/app.js --watch",
     "start": "npx live-server public"
   }
   ```

3. **개발 서버 실행**:
   ```bash
   npm run dev # 코드 변경 시 자동 빌드
   npm start   # 브라우저에서 확인
   ```

4. **브라우저에서 확인**:
   `http://127.0.0.1:8080`으로 접속합니다.

### 장점
- **번들링 지원**: TypeScript 파일과 종속 파일을 하나의 JavaScript 파일로 묶음.
- **자동 새로고침**: 파일 변경 시 브라우저가 자동 새로고침됩니다.
- **빠른 빌드**: `esbuild`는 매우 빠른 번들러입니다.

### 단점
- 프로젝트 크기가 커지면 설정이 복잡해질 수 있습니다.
- `live-server`는 기본적인 기능만 제공하며, 복잡한 개발 환경에는 부적합.

---

## 3. **`vite`를 사용하는 방법**

### 개요
- `vite`는 현대적인 프론트엔드 개발 환경을 제공하며, 번들링과 개발 서버, HMR(Hot Module Replacement)을 기본 제공합니다.
- TypeScript를 기본 지원합니다.

### 실행 방법
1. **Vite 프로젝트 생성**:
   ```bash
   npm create vite@latest calculator-app --template vanilla-ts
   cd calculator-app
   npm install
   ```

2. **프로젝트 구조**:
   기본적으로 `src` 폴더에 TypeScript 파일을 작성하며, `index.html`은 루트 디렉토리에 위치합니다.

3. **개발 서버 실행**:
   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**:
   `http://localhost:5173`으로 접속합니다.

5. **프로덕션 빌드**:
   ```bash
   npm run build
   ```
   - 결과 파일은 `dist` 폴더에 저장됩니다.
   - 프로덕션 서버 테스트:
     ```bash
     npx serve dist
     ```

### 장점
- **통합 도구**: 번들링, 개발 서버, HMR(Hot Module Replacement) 등을 기본 제공.
- **빠른 개발 서버**: 변경 사항이 즉시 반영됩니다.
- **프로덕션 준비 완료**: 최적화된 빌드 출력 제공.

### 단점
- 기존 프로젝트를 `vite`로 이전하려면 구조 변경이 필요할 수 있음.
- 다른 빌드 도구에 비해 초기 학습이 약간 필요.

---
# **방법 비교**

| **기능**              | **일반적인 빌드 (번들링 포함)** | **`esbuild` + `live-server`** | **Vite**                           |
|-----------------------|-------------------------------|--------------------------------|------------------------------------|
| **설정 복잡도**        | 간단함                         | 약간 복잡                       | 약간 복잡                           |
| **번들링 지원**         | ✅                             | ✅                              | ✅                                 |
| **브라우저 자동 새로고침** | ❌                             | ✅                              | ✅                                 |
| **빌드 속도**           | 빠름                           | 빠름                            | 매우 빠름                          |
| **Hot Module Replacement** | ❌                             | ❌                              | ✅                                 |
| **프로덕션 준비**        | ✅                             | ❌                              | ✅                                 |
| **추천 시나리오**       | 학습 또는 간단한 프로젝트       | 소규모 프로젝트                 | 중대형 프로젝트 또는 SPA 개발       |

---

# **결론**

1. **일반적인 빌드 (번들링 포함)**:
   - TypeScript를 학습하거나 간단한 프로젝트를 만들 때 적합.
   - 번들링된 파일을 통해 코드 관리가 쉬움.

2. **`esbuild` + `live-server`**:
   - 번들링과 브라우저 새로고침이 필요한 소규모 프로젝트에 적합.
   - 설정이 간단하면서도 빠른 개발 환경 제공.

3. **Vite**:
   - SPA(Single Page Application) 또는 중대형 프로젝트에 적합.
   - 현대적인 개발 환경과 프로덕션 빌드 지원.
